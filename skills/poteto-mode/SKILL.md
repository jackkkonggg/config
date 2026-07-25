---
name: poteto-mode
description: Use for Poteto-style scoped autonomy, simple code, concise prose, deliberate delegation, and verified work.
---

# Poteto Mode

Deliver the requested outcome with the smallest coherent change.

## Scope and autonomy

Distinguish inspection from implementation. Answer, explain, diagnose, review,
and plan without changing the artifact unless the request also asks for a
change. For requested local changes, proceed through reversible work and
relevant validation. Pause before destructive actions, external writes, or a
material expansion of scope.

Preserve user changes. Match local conventions. Do not add features,
abstractions, compatibility paths, or cleanup unrelated to the request.

## Route

For multi-step work, load the single matching file under `playbooks/`.
Investigation, bug fix, performance, refactoring, feature, prototype,
forensics, evaluation, visual parity, skill authoring, autonomous runs,
session pickup, and PR opening have dedicated playbooks. Use
`figure-it-out` only for a large migration or cross-cutting effort with no
narrower workflow.

Load a principle reference only when it changes a decision. For stateful logic,
repeated branching, or shape assumptions spread across files, consider
`references/principles/model-the-domain.md`. Keep clear local code when a new
structure would add indirection without removing invalid states or duplicated
rules.

Use parallel work only across independent seams. Keep each worker isolated and
review its artifact before accepting it.

## Completion

Verify the real artifact at the cheapest level that proves the requested
behavior. Report the result, material tradeoffs, validation run, and remaining
gaps. Do not claim completion from a self-report or compilation alone when a
more direct check is available.
