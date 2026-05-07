# Skills & Config Backup — Agent Guide

## Repository Layout

```
skills/          Installable user-authored skills + patched vendor skills
skills-cli/      Repo-owned skills add CLI derived from vercel-labs/skills
vendor/          External skill repos (shallow git submodules)
.vendor-state/   Vendor pristine copies and generated patches
claude-code/     Claude Code config backups
claude-desktop/  Claude Desktop config backups
codex/           Codex config backups
cursor/          Cursor config backups
zed/             Zed config backups
scripts/         Automation (backup, restore, install, update)
bin/             Global command entrypoints
```

Claude Code's global instruction file is backed up as `claude-code/CLAUDE.md` and applied to `~/.claude/CLAUDE.md`.

## Skills CLI

This repo owns an installable machine-level `skills` wrapper.

Install it once:

```bash
./scripts/install-cli.sh
```

The command is symlinked to `~/.local/bin/skills`, which should be on `PATH`.

### Reinstall all repo skills

```bash
skills install --all
```

### Apply repo settings and skills

```bash
skills apply
```

This copies the current repo backups for Claude Code, Claude Desktop, Codex, and Zed into their live settings directories, then reinstalls all repo skills as global symlinks.

### Reinstall a single skill

```bash
skills install <skill-name>
```

### Create a custom skill

Create custom skills directly in `skills/<skill-name>/SKILL.md`:

```markdown
---
name: my-skill
description: Use when the user asks for X, Y, or Z.
---

# My Skill

Instructions the agent should follow when this skill is active.
```

Then link it into global agent skill directories:

```bash
skills install my-skill
```

### Add an external skill

```bash
skills add <source> --skill <skill-name>
```

`skills add` is backed by this repo's local `skills-cli/` copy, derived from `vercel-labs/skills`. It keeps upstream-style source parsing and skill discovery, but it always imports into `skills/` and then links from this repo. It does not support project/global scope or agent-selection flags.

### Update repo and skills

```bash
skills update-repo
```

Use this to check for updates from the original vendor git sources. It pulls the repo, updates shallow vendor submodules, syncs patched vendor skill mirrors, and reinstalls all repo skills.

### Sync app settings for review

```bash
skills sync-settings
```

This creates a new `sync/settings-YYYYMMDD-HHMMSS` branch, fetches Claude Code, Codex, Claude Desktop, and Zed settings into the repo, refreshes repo skill links, then prints `git status` so changes can be reviewed with `git diff`.

## Available User-Authored Skills

| Skill | Purpose |
|---|---|
| `code-audit` | Structured codebase audit with auto-detection and prioritized findings |
| `convex-best-practices` | Convex backend rules (functions, schema, database, auth, scheduling) |
| `grammy-best-practices` | grammY Telegram bot framework patterns |
| `gsap-best-practices` | GSAP animation rules (core, timelines, ScrollTrigger, plugins, utils) |
| `motion-react-best-practices` | Motion React setup, variants, presence, layout, gestures, scroll |
| `react-gsap-best-practices` | React + GSAP lifecycle-safe patterns (useGSAP, contextSafe, SSR) |
| `typescript-clean-code` | Clean Code principles adapted for TypeScript |
| `react-doctor` | Scan React code for security, performance, correctness issues |

## Vendor Skill Sources

| Source Repo | Skills Provided |
|---|---|
| `vercel-labs/agent-skills` | react-best-practices, web-design-guidelines, composition-patterns |
| `vercel-labs/agent-browser` | agent-browser |
| `vercel-labs/skills` | find-skills |
| `vercel-labs/next-skills` | next-best-practices |
| `anthropics/skills` | frontend-design |
| `remotion-dev/skills` | remotion-best-practices |
| `shadcn/ui` | shadcn |
| `avdlee/swiftui-agent-skill` | swiftui-expert-skill |
| `avdlee/swift-concurrency-agent-skill` | swift-concurrency |
| `figma/mcp-server-guide` | create-design-system-rules, implement-design |
| `garrytan/gstack` | browse, qa, review, ship, retro, plan-ceo-review, plan-eng-review, setup-browser-cookies |

## Vendor Patch Workflow

Patched vendor copies live under `skills/`. Pristine vendor state lives under `.vendor-state/pristine/`, and generated patch files live under `.vendor-state/patches/`.

```bash
skills sync-vendor
```

Do not put `.pristine` or `vendor.patch` files back inside installable skill directories.

## Config Backup & Restore

```bash
./scripts/backup.sh    # system -> repo (redacts secrets)
./scripts/restore.sh   # repo -> system (substitutes secrets from .env)
```

Codex config is stored as `codex/config.toml.template`. Backup and sync scripts redact Context7 keys as `${CONTEXT7_API_KEY}` from both `CONTEXT7_API_KEY = "ctx7sk-..."` assignments and `--api-key "ctx7sk-..."` MCP arguments.
