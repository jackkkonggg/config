#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";

function usage() {
  console.error("Usage: composite-sync.mjs <check|initialize|sync> [--json] [--source vendor/path]");
}

function parseArgs(argv) {
  const mode = argv.shift();
  const options = { mode, json: false, sources: [] };
  while (argv.length) {
    const arg = argv.shift();
    if (arg === "--json") options.json = true;
    else if (arg === "--source") options.sources.push(argv.shift());
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!["check", "initialize", "sync"].includes(mode)) {
    usage();
    process.exit(2);
  }
  return options;
}

const options = parseArgs(process.argv.slice(2));
const repoRoot = process.env.SKILLS_REPO_ROOT
  ? resolve(process.env.SKILLS_REPO_ROOT)
  : resolve(dirname(new URL(import.meta.url).pathname), "..");
const recipesPath = join(repoRoot, "skills/.composites.json");
const lockPath = join(repoRoot, "skills/.provenance.json");
const stateRoot = join(repoRoot, ".vendor-state/composites");
const recipes = JSON.parse(readFileSync(recipesPath, "utf8"));
const priorLock = existsSync(lockPath)
  ? JSON.parse(readFileSync(lockPath, "utf8"))
  : { version: 2, composites: {} };
const errors = [];
const warnings = [];
const changes = [];

function slash(path) {
  return path.split(sep).join("/");
}

function filesUnder(root) {
  if (!existsSync(root)) return [];
  const files = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile()) files.push(slash(relative(root, path)));
    }
  }
  walk(root);
  return files.sort();
}

function globRegex(pattern) {
  let result = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    if (char === "*" && pattern[index + 1] === "*") {
      index += 1;
      if (pattern[index + 1] === "/") {
        index += 1;
        result += "(?:.*/)?";
      } else {
        result += ".*";
      }
    } else if (char === "*") result += "[^/]*";
    else if (char === "?") result += "[^/]";
    else result += char.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`${result}$`);
}

function matches(path, pattern) {
  return globRegex(pattern).test(path);
}

function hashFile(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function revision(vendorRoot) {
  const result = spawnSync("git", ["-C", resolve(repoRoot, vendorRoot), "rev-parse", "HEAD"], {
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(`Cannot resolve revision for ${vendorRoot}`);
  return result.stdout.trim();
}

function sourceFiles(source) {
  const root = resolve(repoRoot, source.vendor_root, source.source_root);
  if (!existsSync(root)) {
    errors.push(`${source.id}: missing source root ${source.vendor_root}/${source.source_root}`);
    return { root, files: [] };
  }
  return { root, files: filesUnder(root) };
}

function expandRule(rule, files) {
  if (rule.from) return files.includes(rule.from) ? [rule.from] : [];
  const selected = files.filter((file) => matches(file, rule.from_glob));
  return selected.filter(
    (file) => !(rule.exclude ?? []).some((pattern) => matches(file, pattern)),
  );
}

function classify(source, files) {
  const ownership = new Map();
  for (const rule of source.imports ?? []) {
    for (const file of expandRule(rule, files)) {
      if (ownership.has(file)) errors.push(`${source.id}: ${file} has duplicate ownership`);
      ownership.set(file, { kind: "import", rule });
    }
  }
  for (const rule of source.watches ?? []) {
    for (const file of expandRule(rule, files)) {
      if (ownership.has(file)) errors.push(`${source.id}: ${file} has duplicate ownership`);
      ownership.set(file, { kind: "watch", rule });
    }
  }
  for (const rule of source.ignores ?? []) {
    for (const file of files.filter((item) => matches(item, rule.glob))) {
      if (ownership.has(file)) errors.push(`${source.id}: ${file} has duplicate ownership`);
      ownership.set(file, { kind: "ignore", rule });
    }
  }
  for (const file of files) {
    if (!ownership.has(file)) errors.push(`${source.id}: unmapped upstream file ${file}`);
  }
  for (const rule of [...(source.imports ?? []), ...(source.watches ?? [])]) {
    if (expandRule(rule, files).length === 0) {
      errors.push(`${source.id}: rule matched no files: ${rule.from ?? rule.from_glob}`);
    }
  }
  return ownership;
}

function importTarget(rule, sourcePath) {
  if (rule.to) return rule.to;
  return `${rule.to_prefix}${basename(sourcePath)}`;
}

function mergeFile(local, base, upstream, output) {
  if (!existsSync(local) || !existsSync(base)) {
    mkdirSync(dirname(output), { recursive: true });
    cpSync(upstream, output);
    return true;
  }
  const result = spawnSync("git", ["merge-file", "-p", local, base, upstream], {
    encoding: null,
  });
  if (result.status !== 0) return false;
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, result.stdout);
  return true;
}

function sourceSelected(source) {
  return (
    options.sources.length === 0 ||
    options.sources.some(
      (selected) =>
        selected === source.vendor_root ||
        selected === source.id ||
        selected === `${source.vendor_root}/${source.source_root}`,
    )
  );
}

const nextLock = { version: 2, composites: {} };

for (const [compositeName, composite] of Object.entries(recipes.composites ?? {})) {
  const previousComposite = priorLock.composites?.[compositeName] ?? {};
  const nextComposite = {
    ownership: composite.ownership,
    sources: {},
    licenses: composite.licenses ?? [],
  };
  nextLock.composites[compositeName] = nextComposite;
  let compositeBlocked = false;

  if (options.mode === "sync") {
    const beforePreflight = errors.length;
    for (const source of (composite.sources ?? []).filter(sourceSelected)) {
      const { root, files } = sourceFiles(source);
      const ownership = classify(source, files);
      const previous = previousComposite.sources?.[source.id];
      if (!previous) {
        errors.push(`${compositeName}/${source.id}: run initialize before sync`);
        continue;
      }
      const hashes = Object.fromEntries(files.map((file) => [file, hashFile(join(root, file))]));
      const changed = files.filter((file) => previous.files?.[file] !== hashes[file]);
      const deleted = Object.keys(previous.files ?? {}).filter((file) => !hashes[file]);
      for (const file of [...changed, ...deleted]) {
        const owned = ownership.get(file);
        if (owned?.kind === "watch" || !owned) {
          errors.push(
            `${compositeName}/${source.id}: manual adapter review required for ${file}`,
          );
        } else if (owned.kind === "import" && changed.includes(file)) {
          const target = importTarget(owned.rule, file);
          const local = join(repoRoot, "skills", compositeName, target);
          const base = join(stateRoot, compositeName, source.id, file);
          if (existsSync(local) && existsSync(base)) {
            const merge = spawnSync(
              "git",
              ["merge-file", "-p", local, base, join(root, file)],
              { encoding: null },
            );
            if (merge.status !== 0) {
              errors.push(`${compositeName}/${source.id}: merge conflict in ${file}`);
            }
          }
        } else if (owned.kind === "import" && deleted.includes(file)) {
          const target = importTarget(owned.rule, file);
          const local = join(repoRoot, "skills", compositeName, target);
          const base = join(stateRoot, compositeName, source.id, file);
          if (existsSync(local) && existsSync(base) && hashFile(local) !== hashFile(base)) {
            errors.push(
              `${compositeName}/${source.id}: upstream deleted locally edited ${file}`,
            );
          }
        }
      }
    }
    compositeBlocked = errors.length > beforePreflight;
  }

  for (const source of composite.sources ?? []) {
    const { root, files } = sourceFiles(source);
    const ownership = classify(source, files);
    const hashes = Object.fromEntries(files.map((file) => [file, hashFile(join(root, file))]));
    const previous = previousComposite.sources?.[source.id];
    const record = {
      vendor_root: source.vendor_root,
      source_root: source.source_root,
      revision: revision(source.vendor_root),
      files: hashes,
    };
    nextComposite.sources[source.id] = record;

    if (options.mode === "check") {
      if (!previous) changes.push(`${compositeName}/${source.id}: not initialized`);
      else {
        for (const file of new Set([...Object.keys(previous.files ?? {}), ...files])) {
          if (previous.files?.[file] !== hashes[file]) {
            changes.push(`${compositeName}/${source.id}: ${file}`);
          }
        }
      }
      continue;
    }

    if (options.mode === "sync" && !sourceSelected(source)) {
      if (previous) nextComposite.sources[source.id] = previous;
      continue;
    }

    if (options.mode === "sync" && compositeBlocked) {
      if (previous) nextComposite.sources[source.id] = previous;
      continue;
    }

    if (options.mode === "sync" && !previous) {
      errors.push(`${compositeName}/${source.id}: run initialize before sync`);
      continue;
    }

    const changed = files.filter((file) => previous?.files?.[file] !== hashes[file]);
    const deleted = Object.keys(previous?.files ?? {}).filter((file) => !hashes[file]);
    const watched = [...changed, ...deleted].filter(
      (file) => ownership.get(file)?.kind === "watch" || !ownership.has(file),
    );
    if (options.mode === "sync" && watched.length) {
      for (const file of watched) {
        errors.push(
          `${compositeName}/${source.id}: manual adapter review required for ${file}`,
        );
      }
      nextComposite.sources[source.id] = previous;
      continue;
    }

    const sourceState = join(stateRoot, compositeName, source.id);
    if (options.mode === "initialize") {
      rmSync(sourceState, { recursive: true, force: true });
      for (const file of files) {
        const destination = join(sourceState, file);
        mkdirSync(dirname(destination), { recursive: true });
        cpSync(join(root, file), destination);
      }
      continue;
    }

    if (changed.length === 0 && deleted.length === 0) continue;

    const candidateRoot = mkdtempSync(join(tmpdir(), `skills-${compositeName}-`));
    cpSync(join(repoRoot, "skills", compositeName), candidateRoot, { recursive: true });
    let mergeOkay = true;
    for (const file of changed) {
      const owned = ownership.get(file);
      if (owned?.kind !== "import") continue;
      const target = importTarget(owned.rule, file);
      const output = join(candidateRoot, target);
      if (
        !mergeFile(
          join(repoRoot, "skills", compositeName, target),
          join(sourceState, file),
          join(root, file),
          output,
        )
      ) {
        errors.push(`${compositeName}/${source.id}: merge conflict in ${file}`);
        mergeOkay = false;
      }
    }
    for (const file of deleted) {
      const oldOwner = classify(source, [...files, file]).get(file);
      if (oldOwner?.kind !== "import") continue;
      const target = importTarget(oldOwner.rule, file);
      const local = join(repoRoot, "skills", compositeName, target);
      const base = join(sourceState, file);
      if (existsSync(local) && existsSync(base) && hashFile(local) !== hashFile(base)) {
        errors.push(`${compositeName}/${source.id}: upstream deleted locally edited ${file}`);
        mergeOkay = false;
      } else rmSync(join(candidateRoot, target), { force: true });
    }
    if (mergeOkay) {
      const live = join(repoRoot, "skills", compositeName);
      rmSync(live, { recursive: true });
      renameSync(candidateRoot, live);
      rmSync(sourceState, { recursive: true, force: true });
      for (const file of files) {
        const destination = join(sourceState, file);
        mkdirSync(dirname(destination), { recursive: true });
        cpSync(join(root, file), destination);
      }
      changes.push(`${compositeName}/${source.id}: synchronized`);
    } else {
      rmSync(candidateRoot, { recursive: true, force: true });
      nextComposite.sources[source.id] = previous;
    }
  }

  for (const license of composite.licenses ?? []) {
    const source = resolve(repoRoot, license.vendor_root, license.from);
    const destination = resolve(repoRoot, "skills", compositeName, license.to);
    if (!existsSync(source)) {
      errors.push(`${compositeName}: missing license ${license.vendor_root}/${license.from}`);
    } else if (options.mode !== "check" && !compositeBlocked) {
      mkdirSync(dirname(destination), { recursive: true });
      cpSync(source, destination);
    }
  }
}

if (options.mode !== "check" && errors.length === 0) {
  mkdirSync(dirname(lockPath), { recursive: true });
  writeFileSync(lockPath, `${JSON.stringify(nextLock, null, 2)}\n`);
}

const report = { mode: options.mode, changes, warnings, errors };
if (options.json) console.log(JSON.stringify(report, null, 2));
else {
  for (const change of changes) console.log(`changed: ${change}`);
  for (const warning of warnings) console.log(`warning: ${warning}`);
  for (const error of errors) console.error(`error: ${error}`);
  if (!changes.length && !errors.length) console.log("Composite sources are current.");
}
if (errors.length) process.exitCode = 1;
