### Performance Issue

1. Capture a baseline trace on the reported surface and workload.
2. Trace the architecture around the dominant cost. Do not infer a performance
   ceiling from source alone.
3. Load `../references/performance-strategies.md` and choose only strategies
   supported by the trace.
4. Make the smallest change tied to the measured mechanism. Use `architect`
   only when the fix changes a consequential interface or module boundary.
5. Capture a post-change trace with the same workload and compare the
   artifacts. An inconclusive or wrong-surface result is not a pass.
6. Run regression checks and cite the measurement in the PR.

Use the Hillclimb playbook for sustained iteration against one metric.

**Reply:** baseline, post-change result, delta, trace paths, and regression
checks.
