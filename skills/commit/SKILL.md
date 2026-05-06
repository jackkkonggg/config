---
name: commit
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Use when the user asks to create one or more git commits from the current worktree changes.
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, group related changes together and create separate commits for each logical group. If all changes are related, a single commit is fine.

Use Conventional Commits for every commit message:

- Format: `type(scope): subject`
- Use a clear conventional type such as `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`.
- Include a scope when it clarifies the changed area.
- Keep the subject concise, imperative, and lowercase unless it contains a proper noun.

Do NOT add any `Co-Authored-By` lines or co-author trailers to commit messages.

You have the capability to call multiple tools in a single response. Stage and create the commits using a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.
