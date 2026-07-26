# Recall workflow

## Task history

Search by topic before reading full tasks. Order candidates by actual recency,
exclude the active task and obvious evaluation noise, and read only relevant
regions. Preserve stable task identifiers with each finding.

If the corpus is large, partition it into non-overlapping slices. Each worker
returns the same reduced schema: topic, user goal, decisions, corrections,
artifacts, and open threads. Raw transcripts remain outside the main context.

## Shared evidence

For a named feature, file, subsystem, or bug, inspect available source control,
issues, documentation, team discussion, and error tracking. Use
`explain-codebase` Why mode to ask what is current, what was tried, what failed,
and what users still report. A source that is unavailable or has no result is
part of the evidence.

## Reconciliation

Resolve surfaced PRs, branches, tickets, and files against live state. Separate
historical intent from current behavior. Prefer authoritative recent evidence
when records conflict and name the conflict.

Use these status tags where applicable: merged, open PR, in flight, verified
uncommitted, reverted, and planned.
