### Autonomous run

**You own the exit condition. Define done, then drive to it without stopping.**
Use when the user asks for an unattended run or persistence until a stated
condition.

1. State the exit condition as a checkable predicate before the first iteration (tests green, repro fixed, all N PRs merged, pixel-diff zero). A vague goal stalls; a predicate lets you stop.
2. Pick the environment's event watcher or recurring wake mechanism. Watch CI,
   merges, or reference changes directly when possible; otherwise choose a
   useful fixed interval.
3. Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, commits if it advanced, discards changes that didn't help. Belt-and-suspenders that "might help" gets reverted, not left to ride.
   Load [Sequence Work into Verifiable Units](../references/principles/sequence-verifiable-units.md)
   and verify each unit before the next.
4. Checkpoint every iteration via the **show-me-your-work** skill, a row for what changed and whether the predicate moved. A run with no trail can't be audited or resumed.
5. Stop when the predicate is met. A plateau is not a stop, so keep going and pivot your approach to push past it. Surface a genuine dead end rather than spinning, and never relax the predicate to declare victory.

**Reply:** the exit condition, iterations run, what landed, what was discarded, final predicate state.
