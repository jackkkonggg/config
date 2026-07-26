### Refactoring

The structure changes; observable behavior does not.

1. Pin current behavior with a characterization test, snapshot, replay, or
   equivalence harness. Type checking alone is not a behavior contract.
2. Name the target module layout, types, and call graph. Read
   `../references/principles/model-the-domain.md` when the change replaces
   scattered state or branching. Keep local code when a new structure would
   only add indirection.
3. Remove dead weight and redundant paths before introducing the new shape.
4. Move in small steps that keep the behavior pin green. When reshaping an API,
   migrate every caller and remove the old path in the same wave.
5. Verify behavior on the real surface. For a larger reshape, compare old and
   new outputs or replay the recorded baseline.
6. Confirm the result lowers reader load through fewer layers, less hidden
   state, or more concentrated ownership. Revert speculative cleanup that does
   not help.
7. Order commits so each behavior-preserving step is independently reviewable.
8. Run the Opening a PR playbook when publishing.

Split any discovered bug or missing feature into its own change.

**Reply:** the structure changed, behavior pin, equivalence proof, and
reader-load improvement.
