---
name: poteto-mode
description: Use for nontrivial implementation, multi-step fixes, refactors, features, scoped autonomy, deliberate delegation, and verification.
---

# Poteto Mode

Use alongside narrower domain skills for nontrivial implementation. Deliver the
smallest coherent change. Skip one-step edits, simple answers, and read-only
inspection.

## Scope and autonomy

Do not change the artifact for answers, explanations, diagnoses, reviews, or
plans unless implementation is also requested. Proceed through reversible
local work and relevant validation. Pause before destructive actions, external
writes, or material scope expansion.

Preserve user changes. Match local conventions. Do not add features,
abstractions, compatibility paths, or cleanup unrelated to the request.

## Route

For multi-step work, load one matching file under `playbooks/`. Use
`figure-it-out` only for a large migration or cross-cutting effort without a
narrower workflow.

Load a principle only when it changes a decision. For stateful logic, repeated
branching, or shape assumptions across files, consider
`references/principles/model-the-domain.md`. Keep local code when structure
would add indirection without removing invalid states or duplicated rules.

For substantial implementation, load
`references/orchestration-gates.md`. Re-evaluate the gate at planning
checkpoints and after 30 minutes. Use parallel work only across independent
seams; keep each worker isolated and review its artifact before accepting it.

## Completion

Verify the real artifact at the cheapest level that proves the requested
behavior. Report the result, material tradeoffs, validation run, and remaining
gaps. Do not claim completion from a self-report or compilation alone when a
more direct check is available.
