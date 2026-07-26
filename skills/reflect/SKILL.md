---
name: reflect
description: Use to review the active transcript, extract lessons, and route them into concrete skill improvements.
---

# Reflect

Review the active task trail for lessons that should change future behavior.

1. Use only the current environment's active transcript or a user-provided
   digest. Do not search unrelated task histories.
2. Run the configured judgment, tooling, and divergent review lenses in
   parallel. Use:
   - `references/judgment-reviewer.md`
   - `references/tooling-reviewer.md`
   - `references/divergent-reviewer.md`
3. Synthesize with `references/synthesizer.md`. Require evidence for each
   proposed lesson and classify it as Accepted, Rejected, or Backlog.
4. Prefer structural enforcement—tests, lint rules, scripts, metadata, or
   runtime guards—over prompt prose.
5. Present the complete classification before changing shared skills. Apply
   only the user-approved subset through the environment's skill-authoring
   workflow.

Return applied edits, created skills, backlog items, and rejected findings with
their reasons.
