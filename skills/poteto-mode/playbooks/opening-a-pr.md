### Opening a PR

Invoked at the end of every other playbook.

**Worktree.** Work from a git worktree off main; subagents inherit it. Multiple `Task` calls on the same branch each get their own worktree, or `git fetch && git reset --hard origin/<branch>` between them. Dirty branch with unrelated work: patch out, fresh worktree, apply. Snarled worktree: reset from main, redo minimally.

**Commits.** Commit liberally; rebase into small, ordered commits before opening PRs. Each commit is a future PR: landable, ordered to tell the story. Amend when the fix belongs in a just-made commit; new commit when separable.

**PRs.** Review the diff before committing. Prefer narrow, ordered changes with
stack relationships visible to reviewers. Check live PR state before describing
it. Follow repository conventions for rebasing, descriptions, and review
monitoring; push back when feedback drifts from the requested outcome.

A subagent that opens a PR runs `interrogate` and `/deslop`, returns the URL, and does NOT babysit. Return to the parent.
