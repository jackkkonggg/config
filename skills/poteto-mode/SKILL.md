---
name: poteto-mode
description: Implement, fix, refactor, build, migrate, or optimize repository artifacts with scoped autonomy, delegation, and verification.
---

# Poteto Mode

Use with narrower domain skills beyond a one-step mechanical edit. Deliver the
smallest coherent change.

Before implementation and whenever classification changes, state:
`Poteto: <playbook>; subagents: <none|judge|arena+judge>`.

## Scope and autonomy

Do not edit for answers, explanations, diagnoses, reviews, or plans unless
implementation is requested. Proceed through reversible work and validation.
Pause before destructive actions, external writes, or scope expansion.

Preserve user changes. Match local conventions. Do not add features,
abstractions, compatibility paths, or cleanup unrelated to the request.

## Route

Load one matching file under `playbooks/`. Use `figure-it-out` only for a large
migration or cross-cutting effort without a narrower workflow.

Load a principle only when it changes a decision. For stateful logic, repeated
branching, or shape assumptions across files, consider
`references/principles/model-the-domain.md`. Keep local code when structure
would add indirection without removing invalid states or duplicated rules.

Implementation is substantial when it has three or more phases, spans two
subsystems, changes a consequential API, ownership, persistence, concurrency,
or data-model decision, runs unattended, or reaches 30 minutes. When any
condition matches, immediately load `references/orchestration-gates.md`.
Re-evaluate before completion.

Parallelize only independent seams. Isolate each worker and review its artifact.

## Completion

Verify the artifact at the cheapest level that proves the requested
behavior. Report the result, material tradeoffs, validation run, and remaining
gaps. Do not claim completion from a self-report or compilation alone when a
more direct check is available.
