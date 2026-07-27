---
name: poteto-mode
description: Implement, fix, refactor, build, migrate, or optimize repository artifacts with scoped autonomy, delegation, and verification.
---

# Poteto Mode

Use with narrower skills for non-mechanical implementation. Deliver the smallest
change.

## Scope and autonomy

Do not edit unless implementation is requested. Proceed through reversible work
and validation.
Pause before destructive actions, external writes, or scope expansion.

Preserve user changes. Match local conventions. Do not add features,
abstractions, compatibility paths, or cleanup unrelated to the request.

## Route

Classify before the first edit. Re-evaluate before a new phase, when scope,
design, verification, or subsystem coverage changes, and before completion.
State:
`Poteto: <playbook>; class: <implementation|substantial>; Arena: <not-required|used|skipped:reason>; judge: <not-required|pending|passed|blocked|unavailable>`.

Load one matching file under `playbooks/`. Use `figure-it-out` only for a large
cross-cutting effort without a narrower workflow.

Implementation is substantial when any condition matches:

- three or more planned phases;
- two or more subsystems;
- changes to a public contract, persisted data, ownership, security,
  concurrency, rollout, or rollback behavior;
- migration, compatibility, or coordinated caller changes;
- unattended execution.

Immediately load `references/orchestration-gates.md` for substantial work.

Load a principle only when it changes a decision. Consider
`references/principles/model-the-domain.md` for stateful logic, repeated
branching, or shape assumptions across files. Keep local code when structure
would only add indirection.

## Completion

Verify the artifact at the cheapest level that proves the requested
behavior. Report the result, material tradeoffs, validation run, and remaining
gaps. Do not claim completion from a self-report or compilation alone when a
more direct check is available.
