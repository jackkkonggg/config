#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
source "$REPO_DIR/scripts/worktree-lib.sh"
skills_require_primary_worktree "$REPO_DIR" "scripts/restore.sh"
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
safe_copy "$REPO_DIR/claude-code/CLAUDE.md" "$HOME/.claude/CLAUDE.md"
safe_copy "$REPO_DIR/claude-code/notify.sh" "$HOME/.claude/notify.sh"
safe_copy "$REPO_DIR/claude-code/statusline.sh" "$HOME/.claude/statusline.sh"
chmod +x "$HOME/.claude/notify.sh" "$HOME/.claude/statusline.sh" 2>/dev/null || true

if [ -z "${MOTION_TOKEN:-}" ] && [ -f "$REPO_DIR/.env" ]; then
  MOTION_TOKEN=$(sed -n 's/^MOTION_TOKEN=//p' "$REPO_DIR/.env" | head -n 1 | tr -d '"' | tr -d "'")
fi

if [ -f "$REPO_DIR/claude-code/mcp.json.template" ]; then
  if [ -z "${MOTION_TOKEN:-}" ]; then
    read -rp "  Enter MOTION_TOKEN (or leave blank to skip Motion MCP): " MOTION_TOKEN
  fi
  if [ -n "$MOTION_TOKEN" ] && command -v jq >/dev/null 2>&1; then
    CLAUDE_MCP_RENDERED=$(mktemp)
    CLAUDE_CONFIG_MERGED=$(mktemp)
    sed "s|\${MOTION_TOKEN}|$MOTION_TOKEN|g" \
      "$REPO_DIR/claude-code/mcp.json.template" > "$CLAUDE_MCP_RENDERED"
    if [ -f "$HOME/.claude.json" ]; then
      jq -s '.[0] * {mcpServers: ((.[0].mcpServers // {}) * .[1].mcpServers)}' \
        "$HOME/.claude.json" "$CLAUDE_MCP_RENDERED" > "$CLAUDE_CONFIG_MERGED"
    else
      cp "$CLAUDE_MCP_RENDERED" "$CLAUDE_CONFIG_MERGED"
    fi
    safe_copy "$CLAUDE_CONFIG_MERGED" "$HOME/.claude.json"
    rm -f "$CLAUDE_MCP_RENDERED" "$CLAUDE_CONFIG_MERGED"
  else
    echo "  skip: Claude Motion MCP (missing MOTION_TOKEN or jq)"
  fi
fi

# Codex
safe_copy "$REPO_DIR/codex/AGENTS.md" "$HOME/.codex/AGENTS.md"
if [ -f "$REPO_DIR/codex/config.toml.template" ]; then
  # Load API key from .env or environment
  if [ -z "${CONTEXT7_API_KEY:-}" ] && [ -f "$REPO_DIR/.env" ]; then
    CONTEXT7_API_KEY=$(sed -n 's/^CONTEXT7_API_KEY=//p' "$REPO_DIR/.env" | head -n 1 | tr -d '"' | tr -d "'")
  fi
  if [ -z "${CONTEXT7_API_KEY:-}" ]; then
    read -rp "  Enter CONTEXT7_API_KEY (or leave blank to use placeholder): " CONTEXT7_API_KEY
  fi
  if [ -z "${MOTION_TOKEN:-}" ]; then
    read -rp "  Enter MOTION_TOKEN (or leave blank to skip codex config): " MOTION_TOKEN
  fi
  if [ -n "$CONTEXT7_API_KEY" ] && [ -n "$MOTION_TOKEN" ]; then
    CODEX_CONFIG_RENDERED=$(mktemp)
    sed \
      -e "s|\${CONTEXT7_API_KEY}|$CONTEXT7_API_KEY|g" \
      -e "s|\${MOTION_TOKEN}|$MOTION_TOKEN|g" \
      "$REPO_DIR/codex/config.toml.template" > "$CODEX_CONFIG_RENDERED"
    safe_copy "$CODEX_CONFIG_RENDERED" "$HOME/.codex/config.toml"
    rm -f "$CODEX_CONFIG_RENDERED"
  else
    echo "  skip: codex config.toml (missing API key)"
  fi
fi

# Claude Desktop
CLAUDE_DESKTOP="$HOME/Library/Application Support/Claude"
safe_copy "$REPO_DIR/claude-desktop/claude_desktop_config.json" "$CLAUDE_DESKTOP/claude_desktop_config.json"

# Cursor
safe_copy "$REPO_DIR/cursor/mcp.json" "$HOME/.cursor/mcp.json"

# OpenCode
if [ -f "$REPO_DIR/opencode/opencode.jsonc.template" ]; then
  if [ -z "${MOTION_TOKEN:-}" ]; then
    read -rp "  Enter MOTION_TOKEN (or leave blank to skip OpenCode config): " MOTION_TOKEN
  fi
  if [ -n "$MOTION_TOKEN" ]; then
    OPENCODE_CONFIG_RENDERED=$(mktemp)
    sed "s|\${MOTION_TOKEN}|$MOTION_TOKEN|g" \
      "$REPO_DIR/opencode/opencode.jsonc.template" > "$OPENCODE_CONFIG_RENDERED"
    safe_copy "$OPENCODE_CONFIG_RENDERED" "$HOME/.config/opencode/opencode.jsonc"
    rm -f "$OPENCODE_CONFIG_RENDERED"
  else
    echo "  skip: OpenCode config (missing MOTION_TOKEN)"
  fi
fi

# Zed
mkdir -p "$HOME/.config/zed/themes"
safe_copy "$REPO_DIR/zed/settings.json" "$HOME/.config/zed/settings.json"
safe_copy "$REPO_DIR/zed/keymap.json" "$HOME/.config/zed/keymap.json"
safe_copy "$REPO_DIR/zed/themes/dark-modern.json" "$HOME/.config/zed/themes/dark-modern.json"

echo ""
echo "==> Restore complete."
