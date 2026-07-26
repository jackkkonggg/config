# Decision-trail rules

## Schema

Use one single-line row per decision:

- `ts`: ISO 8601 timestamp.
- `phase`: phase or workstream.
- `decision`: concrete choice or completed action.
- `why`: plain-language reason.
- `evidence`: resolvable pointer, never a paragraph.
- `result`: observed state such as `tests green`, `reverted`, `INCONCLUSIVE`,
  or `open`.

The helper sanitizes tabs and newlines and prefixes spreadsheet formula bytes.
Apply the same protection to manually generated rows.

## Placement

Use `decisions.tsv` for one effort or `.audit/<task-slug>.tsv` for concurrent
efforts. Leave it uncommitted unless the work’s size or risk makes the trail a
review artifact.

## Integrity

- Append corrections; never rewrite prior history.
- Remove aspirational rows that do not map to real actions.
- Confirm every evidence pointer supports the row.
- Add omitted forks, pivots, and abandoned approaches when they affected the
  outcome.
- Remove padding that no reviewer would audit.

When an independent review is warranted, ask it to find weak evidence, skipped
verification, risky choices, and gaps. Report findings without forcing a model
name or cross-model ceremony into the trail.
