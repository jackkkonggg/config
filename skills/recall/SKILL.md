---
name: recall
description: Use to reconstruct recent work from available task history, live repository state, and connected evidence.
---

# Recall

Reconstruct working context without assuming a product-specific transcript
path.

1. Fix the scope: workspace, topic, and time window. Default “recent” to seven
   days and never search another workspace without permission.
2. Use the current environment’s task-history interface when available. If it
   is unavailable, use a user-provided digest and say which history could not
   be inspected.
3. Search only likely matching tasks, then retain reduced findings: goal,
   decisions, corrections, artifacts, open threads, and stable task IDs.
4. For a named subsystem or bug, use `explain-codebase` Why mode and available
   source control, issue, documentation, chat, or error-tracking evidence.
   Skip unavailable sources and record null results.
5. Verify branches, commits, PRs, and current files against live state; history
   is not current truth.

Load [references/workflow.md](references/workflow.md) for multi-source or
multi-task recall. Delegate only when the corpus is large and independent
slices can be isolated; agent configuration chooses the runner.

Return a five-bullet capsule, status-tagged threads, up to five recurring
problems, and one concrete next move. Cite task IDs and external records, keep
adjacent work out, and sanitize private context before public output.
