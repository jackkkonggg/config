#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

if "$REPO_DIR/bin/skills" install --all >/tmp/skills-install-test.out 2>&1; then
  echo "ERROR: linked worktree unexpectedly allowed live skill installation" >&2
  exit 1
fi
grep -q "must run from the primary live checkout" /tmp/skills-install-test.out

primary="$(git -C "$REPO_DIR" worktree list --porcelain | awk '/^worktree / { sub(/^worktree /, ""); print; exit }')"
for root in "$HOME/.agents/skills" "$HOME/.claude/skills" "$HOME/.codex/skills"; do
  [ -d "$root" ] || continue
  while IFS= read -r link; do
    target="$(cd -P "$(readlink "$link")" 2>/dev/null && pwd || true)"
    case "$target" in
      "$primary"/skills/*) ;;
      *)
        if [ -f "$link/SKILL.md" ] && [ -f "$REPO_DIR/skills/$(basename "$link")/SKILL.md" ]; then
          echo "ERROR: repo skill link does not target primary checkout: $link" >&2
          exit 1
        fi
        ;;
    esac
  done < <(find "$root" -maxdepth 1 -type l -print)
done

echo "Worktree safety checks passed."
