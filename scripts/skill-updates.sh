#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
source "$REPO_DIR/scripts/worktree-lib.sh"

command_name="${1:-}"

case "$command_name" in
  check)
    exec node "$REPO_DIR/scripts/skill-updates.mjs" "$@"
    ;;
  prepare)
    if skills_is_primary_worktree "$REPO_DIR"; then
      created="$(skills_create_review_worktree "$REPO_DIR" "skill-updates")"
      worktree_path="$(printf '%s\n' "$created" | sed -n 's/^WORKTREE_PATH=//p')"
      branch_name="$(printf '%s\n' "$created" | sed -n 's/^WORKTREE_BRANCH=//p')"
      printf '%s\n' "$created"
      (
        cd "$worktree_path"
        exec ./scripts/skill-updates.sh "$@"
      )
      echo "Review the update in $worktree_path on $branch_name."
    else
      exec node "$REPO_DIR/scripts/skill-updates.mjs" "$@"
    fi
    ;;
  verify)
    skills_require_linked_worktree "$REPO_DIR" "skills updates verify"
    exec node "$REPO_DIR/scripts/skill-updates.mjs" verify
    ;;
  promote)
    shift
    branch_name="${1:-}"
    [ -n "$branch_name" ] || {
      echo "Usage: skills updates promote <branch>" >&2
      exit 1
    }
    caller_repo="$(git -C "$PWD" rev-parse --show-toplevel 2>/dev/null || true)"
    [ -n "$caller_repo" ] || {
      echo "ERROR: run promotion from the primary repository checkout" >&2
      exit 1
    }
    skills_require_primary_worktree "$caller_repo" "skills updates promote"
    primary="$(skills_primary_worktree "$caller_repo")"
    worktree_path="$(skills_worktree_for_branch "$caller_repo" "$branch_name")"
    [ -n "$worktree_path" ] || {
      echo "ERROR: no linked worktree for $branch_name" >&2
      exit 1
    }
    [ -z "$(git -C "$primary" status --porcelain)" ] || {
      echo "ERROR: primary checkout is dirty" >&2
      exit 1
    }
    [ -z "$(git -C "$worktree_path" status --porcelain)" ] || {
      echo "ERROR: update worktree must be committed before promotion" >&2
      exit 1
    }
    "$worktree_path/scripts/skill-updates.sh" verify
    git -C "$primary" merge --ff-only "$branch_name"
    "$primary/bin/skills" install --all
    git -C "$primary" worktree remove --force "$worktree_path"
    git -C "$primary" branch -d "$branch_name"
    echo "Promoted $branch_name and refreshed live skill symlinks."
    ;;
  *)
    echo "Usage: skills updates <check|prepare|verify|promote> ..." >&2
    exit 1
    ;;
esac
