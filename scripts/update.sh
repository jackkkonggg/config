#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "WARNING: scripts/update.sh is deprecated; preparing reviewed skill updates." >&2
exec "$REPO_DIR/scripts/skill-updates.sh" prepare --all
