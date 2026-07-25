---
name: explain-codebase
description: Use for codebase walkthroughs, runtime flow, ownership, layering, design rationale, and historical intent.
---

# Explain Codebase

Choose the mode from the user’s question:

- **How** — what runs, where it lives, how data flows, or which layer owns it.
  Load `references/runtime.md`.
- **Why** — motivation, tradeoffs, regressions, thresholds, or historical
  intent. Load `references/rationale.md` and
  `references/epistemics.md`.

For mixed questions, establish the runtime flow first, then investigate only the
rationale that remains unknown. Do not infer historical intent from code shape.

Ground the answer in repository evidence. State a reasonable scope assumption
instead of blocking on reversible ambiguity. Cite concrete files and symbols;
for rationale, distinguish direct evidence, inference, competing hypotheses,
and gaps. Use connected evidence sources only when they can materially answer
the question, and report searched sources that returned nothing.

This skill explains. If the user also asks for a change, finish the explanation
before handing the evidence to the relevant implementation workflow.
