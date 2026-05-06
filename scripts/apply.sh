#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

copy_file() {
  local src="$1" dst="$2"
  if [ ! -f "$src" ]; then
    echo "  skip: $src (not in repo)"
    return
  fi

  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
  echo "  copied: $dst"
}

render_codex_config() {
  local src="$REPO_DIR/codex/config.toml.template"
  local dst="$HOME/.codex/config.toml"

  if [ ! -f "$src" ]; then
    echo "  skip: $src (not in repo)"
    return
  fi

  local rendered
  rendered="$(mktemp)"

  if grep -q '\${CONTEXT7_API_KEY}' "$src"; then
    if [ -z "${CONTEXT7_API_KEY:-}" ] && [ -f "$REPO_DIR/.env" ]; then
      CONTEXT7_API_KEY=$(grep -E '^CONTEXT7_API_KEY=' "$REPO_DIR/.env" | cut -d= -f2- | tr -d '"' | tr -d "'" || true)
    fi

    if [ -z "${CONTEXT7_API_KEY:-}" ]; then
      rm -f "$rendered"
      echo "  skip: $dst (CONTEXT7_API_KEY is required by template)"
      return
    fi

    sed "s|\${CONTEXT7_API_KEY}|$CONTEXT7_API_KEY|g" "$src" > "$rendered"
  else
    cp "$src" "$rendered"
  fi

  copy_file "$rendered" "$dst"
  rm -f "$rendered"
}

echo "==> Applying configs from $REPO_DIR"

echo ""
echo "==> Claude Code"
copy_file "$REPO_DIR/claude-code/settings.json" "$HOME/.claude/settings.json"
copy_file "$REPO_DIR/claude-code/CLAUDE.md" "$HOME/.claude/CLAUDE.md"
copy_file "$REPO_DIR/claude-code/notify.sh" "$HOME/.claude/notify.sh"
copy_file "$REPO_DIR/claude-code/statusline.sh" "$HOME/.claude/statusline.sh"
chmod +x "$HOME/.claude/notify.sh" "$HOME/.claude/statusline.sh" 2>/dev/null || true

echo ""
echo "==> Claude Desktop"
copy_file "$REPO_DIR/claude-desktop/claude_desktop_config.json" "$HOME/Library/Application Support/Claude/claude_desktop_config.json"

echo ""
echo "==> Codex"
copy_file "$REPO_DIR/codex/AGENTS.md" "$HOME/.codex/AGENTS.md"
render_codex_config

echo ""
echo "==> Zed"
copy_file "$REPO_DIR/zed/settings.json" "$HOME/.config/zed/settings.json"
copy_file "$REPO_DIR/zed/keymap.json" "$HOME/.config/zed/keymap.json"
copy_file "$REPO_DIR/zed/themes/dark-modern.json" "$HOME/.config/zed/themes/dark-modern.json"

echo ""
echo "==> Skills"
"$REPO_DIR/bin/skills" install --all

echo ""
echo "==> Apply complete."
