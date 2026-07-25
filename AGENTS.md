# Skills & Config Backup — Agent Guide

## Repository Layout

```
skills/          Installable local skills and patched vendor skills
skills-cli/      Repo-owned skills CLI
vendor/          External source repositories as git submodules
.vendor-state/   Merge bases, source locks, and generated patches
scripts/         Update, backup, restore, and validation automation
bin/             Global command entrypoints
```

The remaining top-level app directories contain backed-up Claude, Codex, Cursor,
OpenCode, and Zed configuration.

## Worktree Safety

The primary checkout is live: global Codex and Claude skill directories symlink
into its `skills/` tree. Never edit skills, vendor state, manifests, or backed-up
settings in the primary checkout.

- Create an isolated branch and linked worktree with `skills worktree create <slug>`.
- Run imports, vendor syncs, settings syncs, and update preparation there.
- Review and commit the worktree, then promote it from the clean primary checkout
  with `skills updates promote <branch>`.
- `skills install --all`, `skills apply`, and restore operations are primary-only.

The command guards enforce these boundaries. Do not bypass them by editing through
a global skill symlink.

## Skills CLI

Install the machine-level wrapper once with `./scripts/install-cli.sh`.

Common commands:

```bash
skills list
skills doctor
skills install --all
skills apply
skills sync-settings
skills updates check --all
skills updates prepare --all
skills updates verify
skills updates promote <branch>
```

`skills updates check` is read-only. `prepare` advances changed source submodules
only inside a linked worktree, then performs transactional merges and validation.
The deprecated `skills update-repo` alias now prepares a review worktree; it does
not update or install directly from the primary checkout.

Create local skills under `skills/<name>/SKILL.md`. Add external skills with
`skills add <source> --skill <name>` from a linked worktree.

## Source Ownership

Direct mirrors use `skills/.vendor-manifest.json` and
`.vendor-state/pristine/`. Grouped derivatives use:

- `skills/.composites.json` for source paths, imports, watched adapters, ignores,
  and license destinations.
- `skills/.provenance.json` for locked revisions and per-file hashes.
- `.vendor-state/composites/` for three-way merge bases.

Imported reference files may merge automatically. Changes to watched routers or
adapters stop for manual review. New unmapped upstream files fail validation.
Never advance a source lock after a conflict.

## Canonical Inventories

- `skills list` / `skills/.groups.json`: installed selectors and taxonomy.
- `skills/.vendor-manifest.json`: direct vendor mirrors.
- `skills/.composites.json`: grouped-skill ownership and merge policy.
- `skills/.provenance.json`: composite source locks.
- `.gitmodules`: source repositories.

Do not maintain a parallel Markdown skill inventory; it becomes stale and is not
used by the tooling.

## Config Backup and Restore

`skills sync-settings` and `scripts/backup.sh` must run in a linked worktree and
redact secrets before writing templates. `skills apply` and `scripts/restore.sh`
must run in the primary checkout because they update live configuration. Never
commit `.env` or unredacted credentials.
