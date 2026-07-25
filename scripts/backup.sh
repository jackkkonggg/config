#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
source "$REPO_DIR/scripts/worktree-lib.sh"
skills_require_linked_worktree "$REPO_DIR" "scripts/backup.sh"

echo "==> Backing up configs into $REPO_DIR"

# Claude Code
mkdir -p "$REPO_DIR/claude-code"
cp "$HOME/.claude/settings.json" "$REPO_DIR/claude-code/settings.json" 2>/dev/null && echo "  claude-code/settings.json" || echo "  claude-code/settings.json (not found)"
cp "$HOME/.claude/CLAUDE.md" "$REPO_DIR/claude-code/CLAUDE.md" 2>/dev/null && echo "  claude-code/CLAUDE.md" || echo "  claude-code/CLAUDE.md (not found)"
cp "$HOME/.claude/notify.sh" "$REPO_DIR/claude-code/notify.sh" 2>/dev/null && echo "  claude-code/notify.sh" || echo "  claude-code/notify.sh (not found)"
cp "$HOME/.claude/statusline.sh" "$REPO_DIR/claude-code/statusline.sh" 2>/dev/null && echo "  claude-code/statusline.sh" || echo "  claude-code/statusline.sh (not found)"
if [ -f "$HOME/.claude.json" ] && command -v jq >/dev/null 2>&1 && jq -e '.mcpServers.motion' "$HOME/.claude.json" >/dev/null; then
  jq --arg token '${MOTION_TOKEN}' \
    '{mcpServers: {motion: (.mcpServers.motion | .env.TOKEN = $token)}}' \
    "$HOME/.claude.json" > "$REPO_DIR/claude-code/mcp.json.template"
  echo "  claude-code/mcp.json.template (redacted)"
else
  echo "  claude-code/mcp.json.template (motion server not found)"
fi

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
fi

# Cursor
mkdir -p "$REPO_DIR/cursor"
cp "$HOME/.cursor/mcp.json" "$REPO_DIR/cursor/mcp.json" 2>/dev/null && echo "  cursor/mcp.json" || echo "  cursor/mcp.json (not found)"

# OpenCode
mkdir -p "$REPO_DIR/opencode"
if [ -f "$HOME/.config/opencode/opencode.jsonc" ]; then
  sed -E 's/("TOKEN"[[:space:]]*:[[:space:]]*")[0-9a-f]{64}"/\1${MOTION_TOKEN}"/' \
    "$HOME/.config/opencode/opencode.jsonc" > "$REPO_DIR/opencode/opencode.jsonc.template"
  echo "  opencode/opencode.jsonc.template (redacted)"
else
  echo "  opencode/opencode.jsonc.template (not found)"
fi

# Zed
mkdir -p "$REPO_DIR/zed/themes"
cp "$HOME/.config/zed/settings.json" "$REPO_DIR/zed/settings.json" 2>/dev/null && echo "  zed/settings.json" || echo "  zed/settings.json (not found)"
cp "$HOME/.config/zed/keymap.json" "$REPO_DIR/zed/keymap.json" 2>/dev/null && echo "  zed/keymap.json" || echo "  zed/keymap.json (not found)"
cp "$HOME/.config/zed/themes/dark-modern.json" "$REPO_DIR/zed/themes/dark-modern.json" 2>/dev/null && echo "  zed/themes/dark-modern.json" || echo "  zed/themes/dark-modern.json (not found)"

# Verify no secrets leaked
if grep -rq "ctx7sk" "$REPO_DIR/claude-code" "$REPO_DIR/claude-desktop" "$REPO_DIR/codex" "$REPO_DIR/cursor" "$REPO_DIR/opencode" "$REPO_DIR/zed" 2>/dev/null ||
   grep -rEq '("TOKEN"[[:space:]]*:[[:space:]]*"[0-9a-f]{64}"|^TOKEN = "[0-9a-f]{64}")' \
     "$REPO_DIR/claude-code" "$REPO_DIR/claude-desktop" "$REPO_DIR/codex" "$REPO_DIR/cursor" "$REPO_DIR/opencode" "$REPO_DIR/zed" 2>/dev/null; then
  echo ""
  echo "WARNING: API key found in config files! Check redaction."
  exit 1
fi

echo ""
echo "==> Backup complete. Run 'git diff' to see changes."
