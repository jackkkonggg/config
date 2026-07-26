# Orchestration Gates

Treat implementation as substantial when any condition matches:

- the plan has three or more phases;
- the change spans two or more subsystems;
- it makes a consequential API, ownership, persistence, concurrency, or
  data-model decision;
- it is unattended or has run for 30 minutes.

Before implementation, use `arena` when two materially different designs are
viable. Spawn two or three isolated candidates with the same artifact,
grounding, and gradeable criteria. Do not run Arena when there is no real
design fork.

Before completing any substantial implementation, spawn one independent,
read-only judge. Give it the request, scoped diff, verification evidence, and
material risks without the intended verdict. Inspect the artifact yourself,
resolve the judge's findings by evidence, and rerun review only after a material
change. An earlier design judge does not replace review of the implemented
artifact.

Fan implementation out only across independent seams with separate worktrees or
output paths. Keep integration decisions and final verification in the parent.
Do not delegate mechanical work merely for throughput.
