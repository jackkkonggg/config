### Feature

1. Trace the affected subsystem and state the user-visible outcome.
2. Name the input, output, and persistent data shapes. If state or branching is
   spread across files, read `../references/principles/model-the-domain.md` and
   choose the smallest structure that removes duplicated rules.
3. Sketch types, signatures, and ownership before implementation when several
   shapes are plausible. Use `architect` for a consequential design decision,
   not for a local change with an obvious shape.
4. Identify blocking work, independent workstreams, and shared writes.
   Parallelize only disjoint work and give each worker isolated state.
5. Implement the smallest complete slice. Preserve local conventions and avoid
   unrelated cleanup or speculative flexibility.
6. Verify the requested behavior on the real surface. Run targeted tests and
   the cheapest relevant type, lint, build, or smoke checks.
7. Use `interrogate` when the design remains contested or high-risk.
8. Run the Opening a PR playbook when publishing.

**Reply:** the outcome, chosen shape, meaningful tradeoffs, validation, and
remaining gaps.
