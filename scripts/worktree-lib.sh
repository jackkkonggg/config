#!/bin/bash

skills_realpath() {
  local target="$1"
  (cd -P "$target" 2>/dev/null && pwd)
}

skills_primary_worktree() {
  local repo_dir="$1"

  if [ -n "${SKILLS_PRIMARY_WORKTREE:-}" ]; then
    skills_realpath "$SKILLS_PRIMARY_WORKTREE"
    return
  fi

  git -C "$repo_dir" worktree list --porcelain |
    awk '/^worktree / { sub(/^worktree /, ""); print; exit }'
}

skills_is_primary_worktree() {
  local repo_dir="$1"
  local current primary
  current="$(skills_realpath "$repo_dir")"
  primary="$(skills_realpath "$(skills_primary_worktree "$repo_dir")")"
  [ "$current" = "$primary" ]
}

skills_require_primary_worktree() {
  local repo_dir="$1"
  local action="$2"

  if ! skills_is_primary_worktree "$repo_dir"; then
    echo "ERROR: $action must run from the primary live checkout." >&2
    echo "  primary: $(skills_primary_worktree "$repo_dir")" >&2
    echo "  current: $repo_dir" >&2
    return 1
  fi
}

skills_require_linked_worktree() {
  local repo_dir="$1"
  local action="$2"

  if skills_is_primary_worktree "$repo_dir"; then
    echo "ERROR: $action refuses the primary live checkout because global skills point here." >&2
    echo "Create a review worktree first: skills worktree create <slug>" >&2
    return 1
  fi
}

skills_worktree_for_branch() {
  local repo_dir="$1"
  local branch_name="$2"

  git -C "$repo_dir" worktree list --porcelain |
    awk -v wanted="refs/heads/$branch_name" '
      /^worktree / { path = substr($0, 10) }
      /^branch / && substr($0, 8) == wanted { print path; exit }
    '
}

skills_create_review_worktree() {
  local repo_dir="$1"
  local requested_slug="${2:-change}"
  local primary stamp slug branch_name worktree_root worktree_path

  primary="$(skills_primary_worktree "$repo_dir")"
  if [ -n "$(git -C "$primary" status --porcelain)" ]; then
    echo "ERROR: primary checkout must be clean before creating a review worktree." >&2
    return 1
  fi

  slug="$(printf '%s' "$requested_slug" |
    tr '[:upper:]' '[:lower:]' |
    sed 's/[^a-z0-9-]/-/g; s/--*/-/g; s/^-//; s/-$//')"
  [ -n "$slug" ] || slug="change"

  stamp="$(date +%Y%m%d-%H%M%S)"
  branch_name="codex/$slug-$stamp"
  worktree_root="${primary}-worktrees"
  worktree_path="$worktree_root/$slug-$stamp"

  mkdir -p "$worktree_root"
  git -C "$primary" worktree add -b "$branch_name" "$worktree_path" main
  git -C "$worktree_path" submodule update --init --recursive --depth 1

  printf 'WORKTREE_BRANCH=%s\n' "$branch_name"
  printf 'WORKTREE_PATH=%s\n' "$worktree_path"
}
