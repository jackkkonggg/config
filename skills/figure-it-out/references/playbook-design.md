# Playbook design

## Frame

State a completion predicate that can be checked against the real artifact.
Estimate the number of units, identify blockers, and set rigor according to
reversibility and blast radius. Surface material tradeoffs before proposing a
long run.

## Decompose

Make each unit independently landable and verifiable. Put foundations and
shared types before dependents, but test risky assumptions before investing in
wide migration work. Assign independent writers separate worktrees or branches.
Name dependencies explicitly.

For a one-way design choice, route to `architect`. Avoid a second design contest
after the shape is settled unless new evidence invalidates it.

## Define the experiment loop

For each unit specify:

- the hypothesis;
- the smallest intended change;
- the pre-change baseline;
- the executable observation;
- keep, revert, and inconclusive criteria;
- the evidence retained for review.

Verification must inspect the artifact rather than rely on an agent report.
Treat an inconclusive result as unresolved.

## Design the trail

Use `show-me-your-work` when confidence must be reconstructed later. Log
decisions, completed units, pivots, reverts, and blockers—not every command.
Prefer rerunnable evidence such as committed scripts, test output, traces, or
screenshots.

## Hand-off contract

Return phases, dependencies, owners, gates, rollback points, checkpoints,
verification, and open decisions. Identify the focused implementation workflow
that should execute each phase.
