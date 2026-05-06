#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BIN_DIR="${HOME}/.local/bin"
TARGET="$BIN_DIR/skills"

mkdir -p "$BIN_DIR"

if [ -e "$TARGET" ] || [ -L "$TARGET" ]; then
  current="$(readlink "$TARGET" 2>/dev/null || true)"
  if [ "$current" != "$REPO_DIR/bin/skills" ]; then
    rm -rf "$TARGET"
  fi
fi

ln -sfn "$REPO_DIR/bin/skills" "$TARGET"
chmod +x "$REPO_DIR/bin/skills"

echo "Installed skills wrapper: $TARGET -> $REPO_DIR/bin/skills"

case ":$PATH:" in
  *":$BIN_DIR:"*) ;;
  *)
    echo "WARNING: $BIN_DIR is not on PATH for this shell."
    echo "Add this to your shell profile: export PATH=\"\$HOME/.local/bin:\$PATH\""
    ;;
esac
