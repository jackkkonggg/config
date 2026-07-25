### Bug fix

Ship only the smallest change supported by runtime evidence.

1. Reproduce the failure on the matching surface. Drive the available control
   surface yourself; ask the user only when access is genuinely unavailable.
2. Trace the mechanism. Form competing hypotheses, instrument unclear state,
   and eliminate candidates with evidence. Use `explain-codebase` when runtime
   ownership or regression history matters. Confirm the surviving mechanism
   before designing the fix.
3. Add a cheap regression test first when one is clear; otherwise preserve a
   repeatable runtime repro.
4. Design only as far as the fix requires. Use `architect` or `interrogate`
   when the change crosses meaningful seams or the mechanism remains risky.
5. Implement the narrow fix. Remove instrumentation and changes motivated by
   rejected hypotheses.
6. Run the regression test and the original repro on the same surface. A unit
   test alone does not prove an integration failure is gone.

**Reply:** symptom, proven mechanism, fix, and failing-then-passing evidence.
