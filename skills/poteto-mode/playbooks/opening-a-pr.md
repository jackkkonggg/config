### Opening a PR

Use only when the user explicitly requests a PR or an authorized implementation
workflow includes one. If the user asks how to prepare a PR, explain the steps
without acting.

This playbook packages an existing scoped change. It does not authorize fixing,
committing, or mentioning adjacent issues merely because they are visible.

**Worktree.** Inspect repository instructions and current status first. Use a
dedicated worktree or branch when the repository requires isolation. Never
discard unrelated changes. If the current branch is dirty or diverged, create a
clean worktree from the intended base and carry over only the scoped changes
through a reviewable commit or patch.

**Commits.** Commit only the authorized change. Rebase it into small, ordered,
landable commits before opening the PR. Amend when a correction belongs in a
just-made commit; use a new commit when it is independently reviewable.

**PRs.** Review the diff before committing. Prefer narrow, ordered changes with
stack relationships visible to reviewers. Check live PR state before describing
it. Follow repository conventions for rebasing, descriptions, and review
monitoring; push back when feedback drifts from the requested outcome.

Before opening the PR, run relevant validation and use `interrogate` only when
the change warrants adversarial review. Return the PR URL and unresolved checks.
