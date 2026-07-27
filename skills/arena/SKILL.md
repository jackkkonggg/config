---
name: arena
description: Use to compare parallel candidates, choose a base, and synthesize the strongest result.
---

# Arena

Use parallel candidates when one early shape would unduly constrain the result.

1. Define the artifact and 3–6 task-specific, gradeable criteria.
2. Choose runners through agent configuration. Prefer diverse perspectives for
   judgment-sensitive work; repeated runs are fine for generation-heavy work.
3. Give every candidate the same task and grounding, but a separate output
   location or worktree. Ask for the artifact and a short rationale.
4. Wait for all candidates before judging. A failed candidate may be recorded
   as a dropout rather than retried automatically.
5. Read every result end to end and score it criterion by criterion. For
   substantial implementation or consequential design, spawn one blind,
   read-only cross-judge. Agent configuration selects the runner. Record your
   scores before reading its verdict, then compare the two assessments. If the
   runtime lacks subagents, report that gap instead of silently skipping review.
6. Choose the most maintainable base. Graft only improvements that preserve its
   coherence; do not average incompatible designs.
7. Verify the synthesized artifact against the original task and record the
   base, useful grafts, rejected ideas, and evidence.

Parallel candidates must never write to shared mutable state.
