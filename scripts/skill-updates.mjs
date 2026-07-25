#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    env: process.env,
  });
  if (result.status !== 0 && !options.allowFailure) {
    const detail = options.capture ? result.stderr.trim() : "";
    throw new Error(`${command} ${args.join(" ")} failed${detail ? `: ${detail}` : ""}`);
  }
  return result;
}

function git(args, options = {}) {
  return run("git", args, options);
}

function parseArgs(argv) {
  const command = argv.shift();
  const options = { command, all: false, json: false, selectors: [] };
  while (argv.length) {
    const arg = argv.shift();
    if (arg === "--all") options.all = true;
    else if (arg === "--json") options.json = true;
    else options.selectors.push(arg);
  }
  if (!["check", "prepare", "verify"].includes(command)) {
    throw new Error("Usage: skill-updates.mjs <check|prepare|verify> [--all|selector...] [--json]");
  }
  return options;
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(repoRoot, path), "utf8"));
}

function submodules() {
  const result = git(
    ["config", "-f", ".gitmodules", "--get-regexp", "^submodule\\..*\\.(path|url|branch)$"],
    { capture: true },
  );
  const records = new Map();
  for (const line of result.stdout.trim().split("\n")) {
    const [key, ...parts] = line.split(/\s+/);
    const value = parts.join(" ");
    const match = key.match(/^submodule\.(.*)\.(path|url|branch)$/);
    if (!match) continue;
    const record = records.get(match[1]) ?? { name: match[1] };
    record[match[2]] = value;
    records.set(match[1], record);
  }
  return [...records.values()];
}

const manifest = readJson("skills/.vendor-manifest.json");
const composites = readJson("skills/.composites.json");

function rootForPath(path, modules) {
  return modules
    .map((module) => module.path)
    .filter((root) => path === root || path.startsWith(`${root}/`))
    .sort((left, right) => right.length - left.length)[0];
}

function sourceCatalog(modules) {
  const catalog = new Map(modules.map((module) => [module.path, { ...module, selectors: new Set() }]));
  for (const [selector, record] of Object.entries(manifest)) {
    catalog.get(rootForPath(record.vendor_path, modules))?.selectors.add(selector);
  }
  for (const [selector, composite] of Object.entries(composites.composites ?? {})) {
    for (const source of composite.sources ?? []) {
      catalog.get(source.vendor_root)?.selectors.add(selector);
    }
  }
  return catalog;
}

function selectedSources(options, catalog) {
  if (options.all || options.selectors.length === 0) return [...catalog.values()];
  const selected = [...catalog.values()].filter(
    (source) =>
      options.selectors.includes(source.path) ||
      options.selectors.includes(source.name) ||
      [...source.selectors].some((selector) => options.selectors.includes(selector)),
  );
  const matched = new Set(
    selected.flatMap((source) => [source.path, source.name, ...source.selectors]),
  );
  const unknown = options.selectors.filter((selector) => !matched.has(selector));
  if (unknown.length) throw new Error(`Unknown selector or source: ${unknown.join(", ")}`);
  return selected;
}

function remoteHead(source) {
  const ref = source.branch ? `refs/heads/${source.branch}` : "HEAD";
  const result = git(["ls-remote", source.url, ref], { capture: true, allowFailure: true });
  if (result.status !== 0 || !result.stdout.trim()) {
    return { error: result.stderr.trim() || `No remote ref ${ref}` };
  }
  return { revision: result.stdout.trim().split(/\s+/)[0] };
}

function currentRevision(source) {
  const result = git(["-C", source.path, "rev-parse", "HEAD"], {
    capture: true,
    allowFailure: true,
  });
  return result.status === 0 ? result.stdout.trim() : null;
}

function check(options, catalog) {
  const sources = [];
  for (const source of selectedSources(options, catalog)) {
    const current = currentRevision(source);
    const remote = remoteHead(source);
    sources.push({
      source: source.path,
      selectors: [...source.selectors].sort(),
      current,
      remote: remote.revision ?? null,
      update_available: Boolean(remote.revision && current !== remote.revision),
      error: remote.error,
    });
  }
  return {
    checked_at: new Date().toISOString(),
    sources,
    update_count: sources.filter((source) => source.update_available).length,
    error_count: sources.filter((source) => source.error).length,
  };
}

function printReport(report, json) {
  if (json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  for (const source of report.sources) {
    const status = source.error
      ? `ERROR ${source.error}`
      : source.update_available
        ? `${source.current.slice(0, 8)} -> ${source.remote.slice(0, 8)}`
        : "current";
    console.log(`${source.source}: ${status}`);
  }
  console.log(`${report.update_count} source update(s) available.`);
}

function prepare(options, catalog) {
  const report = check(options, catalog);
  if (report.error_count) {
    printReport(report, options.json);
    throw new Error("Cannot prepare updates while source checks are failing");
  }
  const changed = report.sources.filter((source) => source.update_available);
  if (!changed.length) {
    printReport(report, options.json);
    return;
  }

  for (const source of changed) {
    console.log(`==> Updating ${source.source} to ${source.remote}`);
    git(["-C", source.source, "fetch", "--depth", "1", "origin", source.remote]);
    git(["-C", source.source, "checkout", "--detach", source.remote]);

    const direct = Object.entries(manifest)
      .filter(([, record]) => rootForPath(record.vendor_path, [...catalog.values()]) === source.source)
      .map(([selector]) => selector);
    if (direct.length) run("bash", ["scripts/vendor-sync.sh", ...direct]);
    run("node", ["scripts/composite-sync.mjs", "sync", "--source", source.source]);
  }
  verify();
  printReport(report, options.json);
}

function verify() {
  run("node", [
    "scripts/validate-skill-catalog.mjs",
    "--groups",
    "skills/.groups.json",
    "--provenance",
    "skills/.provenance.json",
    "--composites",
    "skills/.composites.json",
    "--skip-global-links",
  ]);
  run("node", ["scripts/composite-sync.mjs", "check"]);
  run("git", ["diff", "--check"]);
  const conflicts = git(
    ["grep", "-n", "-E", "^(<<<<<<<|=======|>>>>>>>)", "--", "skills", ".vendor-state"],
    { capture: true, allowFailure: true },
  );
  if (conflicts.status === 0 && conflicts.stdout.trim()) {
    throw new Error(`Conflict markers remain:\n${conflicts.stdout.trim()}`);
  }
  run("git", ["submodule", "status", "--recursive"]);
  const changedFiles = git(["diff", "--name-only", "main"], { capture: true }).stdout
    .trim()
    .split("\n")
    .filter(Boolean);
  const behavioralChanges = changedFiles.filter(
    (path) =>
      /^skills\/.*\.md$/.test(path) &&
      !/\/assets\/.*(?:LICENSE|COPYING)/i.test(path),
  );
  if (behavioralChanges.length) {
    const evaluationPath = resolve(
      repoRoot,
      "reports/skill-update-evaluation-2026-07-26.md",
    );
    const evaluation = existsSync(evaluationPath) ? readFileSync(evaluationPath, "utf8") : "";
    if (!/\bClaude\b/i.test(evaluation) || !/\bGPT\b/i.test(evaluation)) {
      throw new Error(
        `Behavioral skill changes require Claude and GPT evaluation evidence in ${evaluationPath}:\n${behavioralChanges.join("\n")}`,
      );
    }
  }
  console.log("Skill update verification passed.");
}

try {
  const options = parseArgs(process.argv.slice(2));
  const modules = submodules();
  const catalog = sourceCatalog(modules);
  if (options.command === "check") printReport(check(options, catalog), options.json);
  else if (options.command === "prepare") prepare(options, catalog);
  else verify();
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 1;
}
