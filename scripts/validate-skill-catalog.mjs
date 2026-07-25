#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  const options = {
    root: resolve("skills"),
    groups: null,
    provenance: null,
    baseline: false,
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--root") options.root = resolve(argv[++index]);
    else if (argument === "--groups") options.groups = resolve(argv[++index]);
    else if (argument === "--provenance") options.provenance = resolve(argv[++index]);
    else if (argument === "--baseline") options.baseline = true;
    else if (argument === "--json") options.json = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }

  return options;
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return JSON.parse(trimmed);
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replaceAll("''", "'");
  }
  return trimmed;
}

function parseFrontmatter(raw, path) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${path}: missing YAML frontmatter`);

  const lines = match[1].split(/\r?\n/);
  const data = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const field = line.match(/^([a-zA-Z0-9_-]+):(?:\s*(.*))?$/);
    if (!field) continue;

    const [, key, rawValue = ""] = field;
    if (rawValue === ">" || rawValue === "|" || (rawValue === "" && /^\s+/.test(lines[index + 1] ?? ""))) {
      const parts = [];
      while (index + 1 < lines.length && /^\s+/.test(lines[index + 1])) {
        parts.push(lines[++index].trim());
      }
      data[key] = rawValue === "|" ? parts.join("\n").trim() : parts.join(" ").trim();
    } else {
      data[key] = parseScalar(rawValue);
    }
  }

  if (!data.name || !data.description) {
    throw new Error(`${path}: frontmatter requires name and description`);
  }

  return data;
}

function countWords(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function discoverSkills(root) {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(root, entry.name, "SKILL.md"))
    .filter(existsSync)
    .map((path) => {
      const raw = readFileSync(path, "utf8");
      const metadata = parseFrontmatter(raw, path);
      return {
        name: metadata.name,
        path,
        folder: basename(dirname(path)),
        description: metadata.description,
        descriptionChars: metadata.description.length,
        entryWords: countWords(raw),
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function validateLinks(path, label, errors) {
  const raw = readFileSync(path, "utf8").replace(/```[\s\S]*?```/g, "");
  const links = raw.matchAll(/\[[^\]]*]\(([^)]+)\)/g);

  for (const match of links) {
    let target = match[1].trim().replace(/^<|>$/g, "");
    target = target.split(/\s+["']/)[0].split("#")[0];
    if (!target || /^(?:[a-z]+:|#|\/)/i.test(target) || /[{}[\]]/.test(target)) continue;

    const resolved = resolve(dirname(path), target);
    if (!existsSync(resolved)) errors.push(`${label}: missing link target ${target}`);
  }
}

function validateGroups(catalog, groups, repoRoot, errors) {
  const known = new Set(catalog.map((skill) => skill.name));
  const memberships = new Map();

  for (const group of groups.groups ?? []) {
    for (const skill of group.skills ?? []) {
      if (!known.has(skill)) errors.push(`${group.id}: unknown skill ${skill}`);
      const prior = memberships.get(skill);
      if (prior) errors.push(`${skill}: appears in both ${prior} and ${group.id}`);
      memberships.set(skill, group.id);
    }

    for (const provider of group.external_providers ?? []) {
      const configPath = resolve(repoRoot, provider.config);
      if (!existsSync(configPath)) {
        errors.push(`${provider.id}: missing config ${provider.config}`);
        continue;
      }

      if (provider.format === "claude_enabled_plugins") {
        const settings = readJson(configPath);
        if (settings.enabledPlugins?.[provider.id] !== true) {
          errors.push(`${provider.id}: plugin is not enabled`);
        }
        continue;
      }

      const config = readFileSync(configPath, "utf8");
      const header = `[plugins."${provider.id}"]`;
      const start = config.indexOf(header);
      if (start === -1) {
        errors.push(`${provider.id}: plugin section is missing`);
        continue;
      }
      const remainder = config.slice(start + header.length);
      const section = remainder.split(/\n\[/, 1)[0];
      if (!/^\s*enabled\s*=\s*true\s*$/m.test(section)) {
        errors.push(`${provider.id}: plugin is not enabled`);
      }
    }
  }

  for (const skill of known) {
    if (!memberships.has(skill)) errors.push(`${skill}: missing group membership`);
  }

  if (
    Number.isInteger(groups.expected_repo_selectors) &&
    catalog.length !== groups.expected_repo_selectors
  ) {
    errors.push(
      `expected ${groups.expected_repo_selectors} repo selectors, found ${catalog.length}`,
    );
  }

  const descriptionTotal = catalog.reduce(
    (total, skill) => total + skill.descriptionChars,
    0,
  );
  if (
    Number.isInteger(groups.max_description_characters) &&
    descriptionTotal > groups.max_description_characters
  ) {
    errors.push(
      `description characters ${descriptionTotal} exceed ${groups.max_description_characters}`,
    );
  }

  for (const skill of catalog) {
    if (
      Number.isInteger(groups.max_skill_description_characters) &&
      skill.descriptionChars > groups.max_skill_description_characters
    ) {
      errors.push(
        `${skill.name}: description has ${skill.descriptionChars} characters, maximum is ${groups.max_skill_description_characters}`,
      );
    }
  }

  const byName = new Map(catalog.map((skill) => [skill.name, skill]));
  for (const name of groups.router_skills ?? []) {
    const skill = byName.get(name);
    if (!skill) continue;
    if (
      Number.isInteger(groups.max_router_words) &&
      skill.entryWords > groups.max_router_words
    ) {
      errors.push(
        `${name}: router has ${skill.entryWords} words, maximum is ${groups.max_router_words}`,
      );
    }
  }

  for (const retired of groups.retired_skills ?? []) {
    if (known.has(retired)) errors.push(`${retired}: retired skill remains installed`);
    for (const root of [".agents/skills", ".claude/skills", ".codex/skills"]) {
      const path = join(homedir(), root, retired);
      if (existsSync(path) || isSymlink(path)) errors.push(`${retired}: stale global target ${path}`);
    }
  }
}

function collectMarkdown(root) {
  const files = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...collectMarkdown(path));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
  }
  return files;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function validateRetiredReferences(root, retired, errors) {
  for (const path of collectMarkdown(root)) {
    const raw = readFileSync(path, "utf8");
    for (const name of retired) {
      let pattern;
      if (name === "how" || name === "why") {
        pattern = new RegExp(
          `(?:\\*\\*|\\\`)${name}(?:\\*\\*|\\\`)(?:\\s+skill|\\s+over|\\s*\\+)`,
          "i",
        );
      } else {
        pattern = new RegExp(`(?:^|[^a-z0-9-])${escapeRegex(name)}(?:$|[^a-z0-9-])`, "i");
      }
      if (pattern.test(raw)) {
        errors.push(`${relative(root, path)}: stale reference to ${name}`);
      }
    }
  }
}

function isSymlink(path) {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}

function validateProvenance(provenance, repoRoot, errors, warnings) {
  for (const [composite, record] of Object.entries(provenance.composites ?? {})) {
    for (const source of record.sources ?? []) {
      const sourcePath = resolve(repoRoot, source.path);
      if (!existsSync(sourcePath)) {
        errors.push(`${composite}: missing source ${source.path}`);
        continue;
      }

      if (source.license) {
        const licensePath = resolve(repoRoot, source.license);
        if (!existsSync(licensePath)) errors.push(`${composite}: missing license ${source.license}`);
      }

      const vendorRoot = resolve(repoRoot, source.vendor_root);
      const revision = spawnSync("git", ["-C", vendorRoot, "rev-parse", "HEAD"], {
        encoding: "utf8",
      });
      if (revision.status !== 0) {
        errors.push(`${composite}: cannot resolve vendor revision for ${source.vendor_root}`);
      } else if (revision.stdout.trim() !== source.revision) {
        warnings.push(
          `${composite}: source drift at ${source.vendor_root}, expected ${source.revision}, found ${revision.stdout.trim()}`,
        );
      }
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const repoRoot = resolve(options.root, "..");
  const catalog = discoverSkills(options.root);
  const errors = [];
  const warnings = [];

  for (const skill of catalog) {
    if (skill.name !== skill.folder) {
      errors.push(`${skill.name}: folder is ${skill.folder}`);
    }
    validateLinks(skill.path, skill.name, errors);
  }

  if (!options.baseline) {
    if (!options.groups || !existsSync(options.groups)) {
      errors.push("group manifest is required");
    } else {
      const groups = readJson(options.groups);
      validateGroups(catalog, groups, repoRoot, errors);
      validateRetiredReferences(options.root, groups.retired_skills ?? [], errors);
      for (const path of collectMarkdown(options.root)) {
        if (!path.endsWith("/SKILL.md")) {
          validateLinks(path, relative(options.root, path), errors);
        }
      }
    }

    if (!options.provenance || !existsSync(options.provenance)) {
      errors.push("provenance manifest is required");
    } else {
      validateProvenance(readJson(options.provenance), repoRoot, errors, warnings);
    }
  }

  const report = {
    skillCount: catalog.length,
    descriptionChars: catalog.reduce((total, skill) => total + skill.descriptionChars, 0),
    skills: catalog,
    errors,
    warnings,
  };

  if (options.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    console.log(`skills: ${report.skillCount}`);
    console.log(`description characters: ${report.descriptionChars}`);
    for (const warning of warnings) console.log(`warning: ${warning}`);
    for (const error of errors) console.error(`error: ${error}`);
  }

  if (errors.length > 0) process.exitCode = 1;
}

main();
