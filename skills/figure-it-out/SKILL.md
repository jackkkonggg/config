---
name: figure-it-out
description: Use to design an auditable execution playbook for a large migration or cross-cutting change.
---

# Figure It Out

Design the execution playbook; do not execute it.

Use this only when no narrower workflow covers a large migration, multi-part
change, or review-after-the-fact effort. Load
[references/playbook-design.md](references/playbook-design.md) for the full
method.

1. Ground the current system and quantify the units of work.
2. Define a falsifiable completion predicate and choose rigor proportional to
   reversibility and blast radius.
3. Decompose the work into independently verifiable, landable units. Sequence
   the riskiest unknowns and shared foundations first.
4. Specify the baseline, verification harness, isolation strategy, rollback
   points, and evidence each unit must produce.
5. Use `architect` for unresolved one-way design choices and
   `show-me-your-work` when execution needs a durable decision trail.

Do not create implementation commits, mutate the product, or start the designed
run. Hand back the phased playbook, dependencies, ownership, checkpoints,
verification commands or artifacts, failure handling, and remaining decisions.
The user or a matching implementation workflow starts execution separately.
