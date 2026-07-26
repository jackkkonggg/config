---
name: architect
description: Use to design types, signatures, module boundaries, and alternative shapes before implementation.
---

# Architect

Produce a design artifact, not implementation.

1. Ground the relevant runtime flow with `explain-codebase` How mode. Add Why
   mode when existing rationale constrains the design.
2. Sketch callers first, then types, signatures, ownership, module seams, and
   pseudocode or `not implemented` bodies.
3. For a consequential or one-way decision, produce at least two equally
   concrete caller, type, and module sketches before choosing. Use `arena` with
   [references/runner-prompt.md](references/runner-prompt.md) when independent
   perspectives would improve them.
4. Synthesize the choice with
   [references/rationale-template.md](references/rationale-template.md).
5. Pressure-test assumptions, failure modes, migration cost, and verification.
   Use `interrogate` only when adversarial review would change the decision.

Do not edit production code, fill in bodies, or commit an implementation under
this skill. If implementation evidence invalidates a prior sketch, return here
with that evidence and redesign.

Hand back the recommended design, rejected alternative, caller-facing usage,
type and signature sketch, module map, risks, unresolved decisions, and a
verification strategy. Route accepted implementation to the matching Poteto
playbook or another focused implementation skill.
