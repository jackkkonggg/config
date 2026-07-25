### Hillclimb

Improve one measured outcome through controlled iterations.

1. Choose a realistic workload, one metric, its direction, a regression gate,
   and a checkable stop predicate.
2. Prove the harness is sensitive before freezing it: contrasting workloads
   should separate as expected, and repeated samples should expose noise.
3. Record the baseline. Use `show-me-your-work` when the run needs an auditable
   attempt log.
4. Test one mechanism-based hypothesis at a time. Measure before and after with
   the frozen harness, then run the regression gate.
5. Keep a change only when the result clears noise and correctness remains
   intact. Revert rejected attempts completely.
6. At a plateau, change strategy rather than relaxing the target. Independent
   attempts may run in isolated worktrees.
7. Stop at the predicate or when remaining ideas are demonstrably marginal.

Changing the workload, metric, sampling method, or harness invalidates earlier
comparisons and requires a new baseline.

**Reply:** metric and target, baseline and final result, attempts kept/reverted,
accepted changes, and the strongest remaining hypothesis.
