# AI Agent Config & Skills Backup

Comprehensive backup of AI coding agent skills, plugin commands, and IDE configurations. One repo restores the environment on a new machine and installs a global `skills` wrapper for day-to-day skill management.

## Quick Start

```bash
git clone --recurse-submodules --shallow-submodules git@github.com:jackkkonggg/skills.git
cd skills
cp .env.example .env  # add API keys if needed
./scripts/install-cli.sh
./scripts/restore.sh
skills install --all
```

After `install-cli.sh`, `skills` is available from any directory through `~/.local/bin/skills`.

## Directory Structure

```
skills/          Installable user-authored skills + patched vendor skills
skills-cli/      Repo-owned skills add CLI derived from vercel-labs/skills
vendor/          External skill repos (git submodules, shallow)
.vendor-state/   Vendor pristine copies and generated patch files
claude-code/     Claude Code config backups
claude-desktop/  Claude Desktop config backups
codex/           Codex config backups
cursor/          Cursor config backups
opencode/        OpenCode config backups
zed/             Zed config backups
scripts/         Automation (backup, restore, install, update)
bin/             Global command entrypoints
```

## Skills Command

| Command | Description |
|---|---|
| `skills install --all` | Link all repo skills into global agent skill directories |
| `skills install <skill>` | Link one or more repo skills into global agent skill directories |
| `skills add <source> ...` | Clone/import skills into this repo, then link from `skills/` |
| `skills apply` | Copy repo Claude Code, Claude Desktop, Codex, and Zed configs into live settings directories, then install all repo skills |
| `skills sync-settings [branch-name]` | Create/switch to a sync branch, fetch Claude/Codex/Claude Desktop/Zed settings, refresh skill links, and show changes for review |
| `skills update-repo` | Pull this repo, check vendor skill sources for updates, sync vendor mirrors, reinstall skills |
| `skills sync-vendor` | Sync vendor skill mirrors and regenerate patch files |
| `skills doctor` | Check local dependencies, command installation, target dirs, repo skills, and symlinks |

`skills add` is backed by this repo's local `skills-cli/` copy, derived from `vercel-labs/skills`, so it keeps upstream-style source parsing and skill discovery for sources such as `owner/repo`, `owner/repo@skill`, GitHub tree URLs, SSH git URLs, direct git URLs, and local paths. It does not ask for project/global scope or agent selection: imports always land in this repo's `skills/` directory, and global agent skill directories are symlinked back here.

## User-Authored Skills

Create custom skills directly in `skills/<skill-name>/SKILL.md`:

```markdown
---
name: my-skill
description: Use when the user asks for X, Y, or Z.
---

# My Skill

Instructions the agent should follow when this skill is active.
```

Install one custom skill:

```bash
skills install my-skill
```

Install all repo skills:

```bash
skills install --all
```

| Skill | Description |
|---|---|
| `code-audit` | Structured codebase audit with auto-detection and findings report |
| `convex-best-practices` | Convex backend rules (functions, schema, database, auth) |
| `grammy-best-practices` | grammY Telegram bot framework patterns |
| `gsap-best-practices` | GSAP animation rules (core, timelines, ScrollTrigger, plugins) |
| `motion` | Official Motion AI Kit skill for animation guidance, docs, examples, springs, previews, and performance audits |
| `react-gsap-best-practices` | React + GSAP lifecycle-safe patterns |
| `typescript-clean-code` | Clean Code principles for TypeScript |
| `react-doctor` | Scan React code for security, performance, and correctness |

## Vendor Skills

External skill repos are tracked as shallow git submodules in `vendor/`. Patched installable copies live in `skills/`; pristine vendor copies and generated patches live in `.vendor-state/`.

To check for updates from the original vendor git sources and refresh installed skills, run:

```bash
skills update-repo
```

This pulls the config repo, updates the shallow vendor submodules, syncs patched vendor mirrors, and reinstalls all repo skills.

| Submodule | Source | Skills |
|---|---|---|
| `vercel-agent-skills` | vercel-labs/agent-skills | react-best-practices, web-design-guidelines, composition-patterns |
| `vercel-agent-browser` | vercel-labs/agent-browser | agent-browser |
| `vercel-skills` | vercel-labs/skills | find-skills |
| `vercel-next-skills` | vercel-labs/next-skills | next-best-practices |
| `anthropic-skills` | anthropics/skills | frontend-design |
| `remotion-skills` | remotion-dev/skills | remotion-best-practices |
| `shadcn-ui` | shadcn/ui | shadcn |
| `swiftui-agent-skill` | avdlee/swiftui-agent-skill | swiftui-expert-skill |
| `swift-concurrency` | avdlee/swift-concurrency-agent-skill | swift-concurrency |
| `figma-mcp-server-guide` | figma/mcp-server-guide | create-design-system-rules, implement-design |
| `gstack` | garrytan/gstack | browse, qa, review, ship, retro, plan-ceo-review, plan-eng-review, setup-browser-cookies |
| `claude-plugins-official` | anthropics/claude-plugins-official | commit-commands, frontend-design, typescript-lsp, swift-lsp |

## Config Backups

| Repo Path | Source | Notes |
|---|---|---|
| `claude-code/settings.json` | `~/.claude/settings.json` | Permissions, hooks, plugins |
| `claude-code/CLAUDE.md` | `~/.claude/CLAUDE.md` | Global Claude Code instructions |
| `claude-code/notify.sh` | `~/.claude/notify.sh` | Notification hook |
| `claude-code/statusline.sh` | `~/.claude/statusline.sh` | Status line display |
| `claude-code/mcp.json.template` | `~/.claude.json` | Motion MCP entry with `${MOTION_TOKEN}` substituted on restore |
| `codex/config.toml.template` | `~/.codex/config.toml` | Context7 and Motion API keys substituted on restore |
| `codex/AGENTS.md` | `~/.codex/AGENTS.md` | Agent guidelines |
| `claude-desktop/claude_desktop_config.json` | Claude Desktop app | MCP server config |
| `cursor/mcp.json` | `~/.cursor/mcp.json` | MCP server config |
| `opencode/opencode.jsonc.template` | `~/.config/opencode/opencode.jsonc` | Motion MCP entry with `${MOTION_TOKEN}` substituted on restore |
| `zed/settings.json` | `~/.config/zed/settings.json` | Editor settings |
| `zed/keymap.json` | `~/.config/zed/keymap.json` | Key bindings |
| `zed/themes/dark-modern.json` | `~/.config/zed/themes/dark-modern.json` | Custom Dark Modern theme |

## Workflows

**Periodic sync:**
```bash
skills sync-settings
git add -A && git commit -m "chore: sync agent settings"
```

`skills sync-settings` and `./scripts/backup.sh` redact Context7 and Motion keys before writing their templates. `./scripts/restore.sh` reads `CONTEXT7_API_KEY` and `MOTION_TOKEN` from the environment or `.env`.

**Sync settings for review:**
```bash
skills sync-settings
git diff
```

**Backup config only:**
```bash
./scripts/backup.sh
```

**Restore config only:**
```bash
./scripts/restore.sh
```

**Apply repo state to this machine:**
```bash
skills apply
```

**Add a new vendor skill:**
```bash
skills add org/repo --skill skill-name
skills add org/repo --list
```
