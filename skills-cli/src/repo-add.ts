import { createHash } from 'crypto';
import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'fs';
import { cp, readdir, readFile, rm, stat } from 'fs/promises';
import { basename, dirname, join, relative, resolve } from 'path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { parseSource } from './source-parser.ts';
import { discoverSkills, filterSkills, getSkillDisplayName } from './skills.ts';
import { searchMultiselect } from './prompts/search-multiselect.ts';
import type { Skill } from './types.ts';
import type { AddOptions } from './add.ts';

const LINK_TARGETS = [
  '.agents/skills',
  '.claude/skills',
  '.codex/skills',
  '.gemini/antigravity/skills',
];

type ManifestEntry = {
  vendor_path: string;
  hash: string;
  file_map?: Record<string, string>;
};

type Manifest = Record<string, ManifestEntry>;

function run(command: string, args: string[], cwd: string): void {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed`);
  }
}

function capture(command: string, args: string[], cwd: string): string {
  const result = spawnSync(command, args, {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf-8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `${command} ${args.join(' ')} failed`);
  }

  return result.stdout.trim();
}

function safeName(value: string): string {
  let name = value
    .replace(/\.git$/, '')
    .replace(/^git@/, '')
    .replace(/^ssh:\/\//, '')
    .replace(/^https?:\/\//, '')
    .replace(/^github\.com\//, '')
    .replace(/^gitlab\.com\//, '')
    .replace(/^.*:/, '')
    .replaceAll('/', '-')
    .replace(/[^A-Za-z0-9._-]/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  if (!name) name = 'source';
  return name;
}

function toRepoRelative(configRepoDir: string, path: string): string {
  return relative(configRepoDir, path).replaceAll('\\', '/');
}

function ensureInsideRepo(configRepoDir: string, path: string): void {
  const repo = resolve(configRepoDir);
  const target = resolve(path);
  if (target !== repo && !target.startsWith(repo + '/')) {
    throw new Error(`Refusing to import path outside repo-owned vendor state: ${target}`);
  }
}

async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === '__pycache__') continue;
    if (entry.name.endsWith('.tmpl')) continue;

    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

async function computeHash(path: string): Promise<string> {
  const stats = await stat(path);

  if (stats.isFile()) {
    const hash = createHash('sha256');
    hash.update(await readFile(path));
    return hash.digest('hex');
  }

  const hash = createHash('sha256');
  const files = await listFiles(path);
  for (const file of files) {
    hash.update(relative(path, file).replaceAll('\\', '/'));
    hash.update('\0');
    hash.update(await readFile(file));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function readManifest(manifestPath: string): Manifest {
  if (!existsSync(manifestPath)) return {};
  return JSON.parse(readFileSync(manifestPath, 'utf-8')) as Manifest;
}

function writeManifest(manifestPath: string, manifest: Manifest): void {
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
}

async function copySkill(source: string, target: string): Promise<void> {
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  await cp(source, target, {
    recursive: true,
    filter: (src) => {
      const name = basename(src);
      return name !== '.git' && name !== '__pycache__' && !name.endsWith('.tmpl');
    },
  });
}

function linkSkill(configRepoDir: string, skillName: string): void {
  const skillDir = join(configRepoDir, 'skills', skillName);
  if (!existsSync(join(skillDir, 'SKILL.md'))) {
    throw new Error(`Imported skill is missing SKILL.md: ${skillDir}`);
  }

  for (const relTarget of LINK_TARGETS) {
    const targetRoot = join(process.env.HOME || '', relTarget);
    if (!targetRoot) continue;
    mkdirSync(targetRoot, { recursive: true });
    const linkPath = join(targetRoot, skillName);
    rmSync(linkPath, { recursive: true, force: true });
    symlinkSync(skillDir, linkPath);
  }
}

function sourceToStableUrl(source: string, parsedUrl: string): string {
  if (
    parsedUrl.startsWith('http://') ||
    parsedUrl.startsWith('https://') ||
    parsedUrl.startsWith('git@')
  ) {
    return parsedUrl;
  }
  return source;
}

function normalizeGitUrl(url: string): string {
  return url
    .replace(/^git\+/, '')
    .replace(/^https:\/\/github\.com\//, 'github.com/')
    .replace(/^http:\/\/github\.com\//, 'github.com/')
    .replace(/^git@github\.com:/, 'github.com/')
    .replace(/\.git$/, '')
    .replace(/\/$/, '');
}

function findExistingSubmodule(configRepoDir: string, url: string): string | null {
  const gitmodulesPath = join(configRepoDir, '.gitmodules');
  if (!existsSync(gitmodulesPath)) return null;

  const output = capture(
    'git',
    ['config', '--file', '.gitmodules', '--get-regexp', '^submodule\\..*\\.url$'],
    configRepoDir
  );
  const target = normalizeGitUrl(url);

  for (const line of output.split('\n')) {
    const [key, submoduleUrl] = line.split(/\s+/, 2);
    if (!key || !submoduleUrl) continue;
    if (normalizeGitUrl(submoduleUrl) !== target) continue;

    const pathKey = key.replace(/\.url$/, '.path');
    const submodulePath = capture(
      'git',
      ['config', '--file', '.gitmodules', '--get', pathKey],
      configRepoDir
    );
    if (submodulePath) return join(configRepoDir, submodulePath);
  }

  return null;
}

async function prepareRemoteSource(
  configRepoDir: string,
  source: string,
  url: string,
  ref?: string
): Promise<string> {
  const existingSubmodule = findExistingSubmodule(configRepoDir, url);
  if (existingSubmodule && existsSync(existingSubmodule)) {
    const submodulePath = toRepoRelative(configRepoDir, existingSubmodule);
    p.log.info(`Updating vendor source: ${submodulePath}`);
    try {
      const updateArgs = ['submodule', 'update', '--init', '--remote', '--depth', '1'];
      if (ref) updateArgs.push('--checkout');
      updateArgs.push(submodulePath);
      run('git', updateArgs, configRepoDir);

      if (ref) {
        run('git', ['fetch', '--depth', '1', 'origin', ref], existingSubmodule);
        run('git', ['checkout', 'FETCH_HEAD'], existingSubmodule);
      }
    } catch {
      p.log.warn(`Could not update ${submodulePath}; reusing current checkout`);
    }
    return existingSubmodule;
  }

  const vendorName = safeName(sourceToStableUrl(source, url));
  const vendorDir = join(configRepoDir, 'vendor', vendorName);

  if (existsSync(vendorDir)) {
    p.log.info(`Updating vendor source: vendor/${vendorName}`);
    try {
      run('git', ['fetch', '--depth', '1', 'origin'], vendorDir);
      run('git', ['pull', '--ff-only', '--depth', '1'], vendorDir);
    } catch {
      p.log.warn(`Could not fast-forward vendor/${vendorName}; reusing current checkout`);
    }
    return vendorDir;
  }

  p.log.info(`Cloning vendor source: ${url}`);
  mkdirSync(join(configRepoDir, 'vendor'), { recursive: true });

  const addArgs = ['submodule', 'add', '--depth', '1'];
  if (ref) addArgs.push('--branch', ref);
  addArgs.push(url, `vendor/${vendorName}`);

  try {
    run('git', addArgs, configRepoDir);
  } catch {
    const cloneArgs = ['clone', '--depth', '1'];
    if (ref) cloneArgs.push('--branch', ref);
    cloneArgs.push(url, vendorDir);
    run('git', cloneArgs, configRepoDir);
  }

  return vendorDir;
}

async function prepareLocalSource(configRepoDir: string, localPath: string): Promise<string> {
  const resolvedLocal = resolve(localPath);
  const resolvedRepo = resolve(configRepoDir);
  if (resolvedLocal === resolvedRepo || resolvedLocal.startsWith(resolvedRepo + '/')) {
    return resolvedLocal;
  }

  return resolvedLocal;
}

function parseExplicitPath(options: AddOptions): string | undefined {
  return options.path;
}

function isCancelled(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

export async function selectSkills(skills: Skill[], options: AddOptions): Promise<Skill[]> {
  if (options.skill?.includes('*') || options.all) return skills;

  if (options.skill && options.skill.length > 0) {
    const selected = filterSkills(skills, options.skill);
    if (selected.length === 0) {
      throw new Error(
        `No matching skills found for: ${options.skill.join(', ')}\nAvailable skills: ${skills
          .map((skill) => getSkillDisplayName(skill))
          .join(', ')}`
      );
    }
    return selected;
  }

  if (skills.length === 1) return skills;

  const selectedNames = await searchMultiselect({
    message: 'Which skills do you want to install?',
    items: skills.map((skill) => ({
      value: getSkillDisplayName(skill),
      label: getSkillDisplayName(skill),
      hint: skill.description,
    })),
    required: true,
  });

  if (isCancelled(selectedNames)) {
    throw new Error('Cancelled');
  }

  return filterSkills(skills, selectedNames);
}

async function materializeExternalLocalSkill(
  configRepoDir: string,
  skill: Skill,
  installName: string
): Promise<string> {
  const vendorDir = join(configRepoDir, 'vendor', `local-${installName}`);
  if (existsSync(vendorDir)) {
    throw new Error(`vendor/local-${installName} already exists; choose another skill name`);
  }
  await copySkill(skill.path, vendorDir);
  return vendorDir;
}

async function importSkill(
  configRepoDir: string,
  skill: Skill,
  installName: string
): Promise<void> {
  const skillDir = join(configRepoDir, 'skills', installName);
  const pristineDir = join(configRepoDir, '.vendor-state', 'pristine', installName);
  const manifestPath = join(configRepoDir, 'skills', '.vendor-manifest.json');

  if (existsSync(pristineDir)) {
    throw new Error(
      `${installName} already has pristine vendor state; use skills sync-vendor to update it`
    );
  }
  if (existsSync(join(skillDir, 'SKILL.md'))) {
    throw new Error(`skills/${installName} already exists; choose another name or remove it first`);
  }

  let vendorSource = skill.path;
  try {
    ensureInsideRepo(configRepoDir, vendorSource);
  } catch {
    vendorSource = await materializeExternalLocalSkill(configRepoDir, skill, installName);
  }

  await copySkill(vendorSource, pristineDir);
  await copySkill(vendorSource, skillDir);

  const manifest = readManifest(manifestPath);
  manifest[installName] = {
    vendor_path: toRepoRelative(configRepoDir, vendorSource),
    hash: await computeHash(vendorSource),
  };
  writeManifest(manifestPath, Object.fromEntries(Object.entries(manifest).sort()));
  linkSkill(configRepoDir, installName);
}

export async function runRepoAdd(args: string[], options: AddOptions): Promise<void> {
  const configRepoDir = process.env.SKILLS_CONFIG_REPO_DIR;
  if (!configRepoDir) {
    throw new Error('SKILLS_CONFIG_REPO_DIR is required for repo-owned add');
  }

  if (options.global || options.project || options.agent?.length || options.copy) {
    throw new Error(
      `Scope, agent, and copy flags are not supported. Skills are always imported into ${configRepoDir}/skills and linked from there.`
    );
  }

  const source = args[0];
  if (!source) {
    throw new Error('Missing required argument: source');
  }

  const parsed = parseSource(source);
  let sourceRoot: string;

  if (parsed.type === 'well-known') {
    throw new Error('Well-known HTTP skill indexes are not supported by this repo-owned fork yet');
  }

  if (parsed.type === 'local') {
    if (!existsSync(parsed.localPath!)) {
      throw new Error(`Local path does not exist: ${parsed.localPath}`);
    }
    sourceRoot = await prepareLocalSource(configRepoDir, parsed.localPath!);
  } else {
    sourceRoot = await prepareRemoteSource(configRepoDir, source, parsed.url, parsed.ref);
  }

  if (parsed.skillFilter) {
    options.skill = options.skill || [];
    if (!options.skill.includes(parsed.skillFilter)) {
      options.skill.push(parsed.skillFilter);
    }
  }

  if (options.all) {
    options.skill = ['*'];
    options.yes = true;
  }

  const explicitPath = parseExplicitPath(options);
  const searchSubpath = explicitPath || parsed.subpath;
  const includeInternal = !!(options.skill && options.skill.length > 0);
  const skills = await discoverSkills(sourceRoot, searchSubpath, {
    includeInternal,
    fullDepth: options.fullDepth || includeInternal,
  });

  if (skills.length === 0) {
    throw new Error('No valid skills found. Skills require a SKILL.md with name and description.');
  }

  if (options.list) {
    for (const skill of skills) {
      const relPath = relative(sourceRoot, skill.path).replaceAll('\\', '/');
      console.log(`${getSkillDisplayName(skill)}\t${relPath || '.'}\t${skill.description}`);
    }
    return;
  }

  const selectedSkills =
    explicitPath && options.skill?.length === 1 ? skills : await selectSkills(skills, options);

  for (const skill of selectedSkills) {
    const installName =
      explicitPath && options.skill?.length === 1 ? options.skill[0]! : getSkillDisplayName(skill);
    await importSkill(configRepoDir, skill, installName);
    p.log.success(
      `Imported ${pc.cyan(installName)} -> ${pc.dim(join(configRepoDir, 'skills', installName))}`
    );
  }
}
