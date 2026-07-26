---
name: show-me-your-work
description: Use to keep a TSV decision trail for long-running, unattended, or review-after-the-fact work.
---

# Show Me Your Work

Keep one append-only TSV trail for decisions and verifiable checkpoints. Load
[references/decision-trail.md](references/decision-trail.md) for the schema,
placement, review, and safety rules.

Start from
[references/decision-log-template.tsv](references/decision-log-template.tsv).
Append with:

```bash
scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>
```

Log choices, completed units, pivots, reverts, blockers, and gate changes—not
every command. Evidence must resolve to a commit, PR, `file:line`, test output,
trace, screenshot, or other inspectable artifact. Use `INCONCLUSIVE` rather
than converting missing proof into success.

Keep the trail uncommitted by default. Commit it only when the reviewer needs
the record to trust a large or long-running change.

Before handoff, reconcile rows against available task history and the real
artifacts. If task history is unavailable, audit the evidence directly and
state that limitation. Independent review is optional when risk warrants it;
agent configuration selects reviewers.

Return the trail path, verification status, unresolved rows, and material items
the reviewer should inspect.
