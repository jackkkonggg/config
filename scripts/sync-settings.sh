#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
source "$REPO_DIR/scripts/worktree-lib.sh"

if skills_is_primary_worktree "$REPO_DIR"; then
  worktree_result="$(skills_create_review_worktree "$REPO_DIR" "settings-sync")"
  printf '%s\n' "$worktree_result"
  review_worktree="$(printf '%s\n' "$worktree_result" | sed -n 's/^WORKTREE_PATH=//p')"
  exec "$review_worktree/scripts/sync-settings.sh" --in-worktree
fi

skills_require_linked_worktree "$REPO_DIR" "scripts/sync-settings.sh"
cd "$REPO_DIR"

if [ "${1:-}" = "--in-worktree" ]; then
  shift
fi

echo "==> Using review worktree"
echo "  $(git branch --show-current)"
echo "  $REPO_DIR"

echo ""
echo "==> Fetching settings into repo"

# Claude Code
mkdir -p "$REPO_DIR/claude-code"
cp "$HOME/.claude/settings.json" "$REPO_DIR/claude-code/settings.json" 2>/dev/null && echo "  claude-code/settings.json" || echo "  claude-code/settings.json (not found)"
cp "$HOME/.claude/CLAUDE.md" "$REPO_DIR/claude-code/CLAUDE.md" 2>/dev/null && echo "  claude-code/CLAUDE.md" || echo "  claude-code/CLAUDE.md (not found)"
cp "$HOME/.claude/notify.sh" "$REPO_DIR/claude-code/notify.sh" 2>/dev/null && echo "  claude-code/notify.sh" || echo "  claude-code/notify.sh (not found)"
cp "$HOME/.claude/statusline.sh" "$REPO_DIR/claude-code/statusline.sh" 2>/dev/null && echo "  claude-code/statusline.sh" || echo "  claude-code/statusline.sh (not found)"

# Codex
mkdir -p "$REPO_DIR/codex"
if [ -f "$HOME/.codex/config.toml" ]; then
  sed \
    -e 's/CONTEXT7_API_KEY = "ctx7sk-[^"]*"/CONTEXT7_API_KEY = "${CONTEXT7_API_KEY}"/' \
    -e 's/"--api-key", "ctx7sk-[^"]*"/"--api-key", "${CONTEXT7_API_KEY}"/' \
    -e 's/^TOKEN = "[0-9a-f]\{64\}"$/TOKEN = "${MOTION_TOKEN}"/' \
    "$HOME/.codex/config.toml" > "$REPO_DIR/codex/config.toml.template"
  echo "  codex/config.toml.template (redacted)"
else
  echo "  codex/config.toml (not found)"
fi
cp "$HOME/.codex/AGENTS.md" "$REPO_DIR/codex/AGENTS.md" 2>/dev/null && echo "  codex/AGENTS.md" || echo "  codex/AGENTS.md (not found)"

# Claude Desktop
mkdir -p "$REPO_DIR/claude-desktop"
CLAUDE_DESKTOP="$HOME/Library/Application Support/Claude"
if [ -f "$CLAUDE_DESKTOP/claude_desktop_config.json" ]; then
  cp "$CLAUDE_DESKTOP/claude_desktop_config.json" "$REPO_DIR/claude-desktop/claude_desktop_config.json"
  echo "  claude-desktop/claude_desktop_config.json"
else
  echo "  claude-desktop/claude_desktop_config.json (not found)"
fi

# Zed
mkdir -p "$REPO_DIR/zed/themes"
cp "$HOME/.config/zed/settings.json" "$REPO_DIR/zed/settings.json" 2>/dev/null && echo "  zed/settings.json" || echo "  zed/settings.json (not found)"
cp "$HOME/.config/zed/keymap.json" "$REPO_DIR/zed/keymap.json" 2>/dev/null && echo "  zed/keymap.json" || echo "  zed/keymap.json (not found)"
cp "$HOME/.config/zed/themes/dark-modern.json" "$REPO_DIR/zed/themes/dark-modern.json" 2>/dev/null && echo "  zed/themes/dark-modern.json" || echo "  zed/themes/dark-modern.json (not found)"

echo ""
echo "==> Checking for leaked secrets"
if grep -rq "ctx7sk" "$REPO_DIR/claude-code" "$REPO_DIR/claude-desktop" "$REPO_DIR/codex" "$REPO_DIR/zed" 2>/dev/null; then
  echo "ERROR: API key found in config files. Check redaction before committing." >&2
  exit 1
fi

echo ""
echo "==> Review"
git status --short
echo ""
echo "Run 'git diff' to review changes, then commit when ready."
