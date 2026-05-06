#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Backing up configs into $REPO_DIR"

# Claude Code
mkdir -p "$REPO_DIR/claude-code"
cp "$HOME/.claude/settings.json" "$REPO_DIR/claude-code/settings.json" 2>/dev/null && echo "  claude-code/settings.json" || echo "  claude-code/settings.json (not found)"
cp "$HOME/.claude/notify.sh" "$REPO_DIR/claude-code/notify.sh" 2>/dev/null && echo "  claude-code/notify.sh" || echo "  claude-code/notify.sh (not found)"
cp "$HOME/.claude/statusline.sh" "$REPO_DIR/claude-code/statusline.sh" 2>/dev/null && echo "  claude-code/statusline.sh" || echo "  claude-code/statusline.sh (not found)"

# Codex
mkdir -p "$REPO_DIR/codex"
if [ -f "$HOME/.codex/config.toml" ]; then
  sed 's/CONTEXT7_API_KEY = "ctx7sk-[^"]*"/CONTEXT7_API_KEY = "${CONTEXT7_API_KEY}"/' \
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

# Zed
mkdir -p "$REPO_DIR/zed/themes"
cp "$HOME/.config/zed/settings.json" "$REPO_DIR/zed/settings.json" 2>/dev/null && echo "  zed/settings.json" || echo "  zed/settings.json (not found)"
cp "$HOME/.config/zed/keymap.json" "$REPO_DIR/zed/keymap.json" 2>/dev/null && echo "  zed/keymap.json" || echo "  zed/keymap.json (not found)"
cp "$HOME/.config/zed/themes/dark-modern.json" "$REPO_DIR/zed/themes/dark-modern.json" 2>/dev/null && echo "  zed/themes/dark-modern.json" || echo "  zed/themes/dark-modern.json (not found)"

# Verify no secrets leaked
if grep -rq "ctx7sk" "$REPO_DIR/claude-code" "$REPO_DIR/claude-desktop" "$REPO_DIR/codex" "$REPO_DIR/cursor" "$REPO_DIR/zed" 2>/dev/null; then
  echo ""
  echo "WARNING: API key found in config files! Check redaction."
  exit 1
fi

echo ""
echo "==> Backup complete. Run 'git diff' to see changes."
