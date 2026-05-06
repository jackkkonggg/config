#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FORCE=false

while getopts "f" opt; do
  case $opt in
    f) FORCE=true ;;
    *) echo "Usage: $0 [-f]"; exit 1 ;;
  esac
done

confirm() {
  if $FORCE; then return 0; fi
  read -rp "  Overwrite $1? [y/N] " answer
  [[ "$answer" =~ ^[Yy] ]]
}

safe_copy() {
  local src="$1" dst="$2"
  if [ ! -f "$src" ]; then
    echo "  skip: $src (not in repo)"
    return
  fi
  if [ -f "$dst" ] && ! $FORCE; then
    if diff -q "$src" "$dst" >/dev/null 2>&1; then
      echo "  skip: $dst (unchanged)"
      return
    fi
    if ! confirm "$dst"; then
      echo "  skip: $dst (declined)"
      return
    fi
  fi
  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
  echo "  copied: $dst"
}

echo "==> Restoring configs from $REPO_DIR"

# Claude Code
safe_copy "$REPO_DIR/claude-code/settings.json" "$HOME/.claude/settings.json"
safe_copy "$REPO_DIR/claude-code/notify.sh" "$HOME/.claude/notify.sh"
safe_copy "$REPO_DIR/claude-code/statusline.sh" "$HOME/.claude/statusline.sh"
chmod +x "$HOME/.claude/notify.sh" "$HOME/.claude/statusline.sh" 2>/dev/null || true

# Codex
safe_copy "$REPO_DIR/codex/AGENTS.md" "$HOME/.codex/AGENTS.md"
if [ -f "$REPO_DIR/codex/config.toml.template" ]; then
  # Load API key from .env or environment
  if [ -z "${CONTEXT7_API_KEY:-}" ] && [ -f "$REPO_DIR/.env" ]; then
    CONTEXT7_API_KEY=$(grep -E '^CONTEXT7_API_KEY=' "$REPO_DIR/.env" | cut -d= -f2- | tr -d '"' | tr -d "'")
  fi
  if [ -z "${CONTEXT7_API_KEY:-}" ]; then
    read -rp "  Enter CONTEXT7_API_KEY (or leave blank to use placeholder): " CONTEXT7_API_KEY
  fi
  if [ -n "$CONTEXT7_API_KEY" ]; then
    sed "s|\${CONTEXT7_API_KEY}|$CONTEXT7_API_KEY|g" \
      "$REPO_DIR/codex/config.toml.template" > /tmp/codex-config.toml
    safe_copy /tmp/codex-config.toml "$HOME/.codex/config.toml"
    rm -f /tmp/codex-config.toml
  else
    echo "  skip: codex config.toml (no API key provided)"
  fi
fi

# Claude Desktop
CLAUDE_DESKTOP="$HOME/Library/Application Support/Claude"
safe_copy "$REPO_DIR/claude-desktop/claude_desktop_config.json" "$CLAUDE_DESKTOP/claude_desktop_config.json"

# Cursor
safe_copy "$REPO_DIR/cursor/mcp.json" "$HOME/.cursor/mcp.json"

# Zed
mkdir -p "$HOME/.config/zed/themes"
safe_copy "$REPO_DIR/zed/settings.json" "$HOME/.config/zed/settings.json"
safe_copy "$REPO_DIR/zed/keymap.json" "$HOME/.config/zed/keymap.json"
safe_copy "$REPO_DIR/zed/themes/dark-modern.json" "$HOME/.config/zed/themes/dark-modern.json"

echo ""
echo "==> Restore complete."
