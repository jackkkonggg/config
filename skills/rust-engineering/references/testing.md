# Testing and verification

- Test observable behavior at the cheapest useful layer: unit tests for local
  invariants, integration tests for public contracts, and doctests for public
  examples.
- Exercise success, error, and boundary paths. Use table-driven cases when
  they clarify a shared rule; use property tests for true invariants such as
  round trips or ordering, not as a substitute for examples.
- Introduce mocks at an owned trait boundary when they isolate a costly or
  nondeterministic dependency. Prefer a real lightweight implementation when
  it gives more confidence with less coupling.
- Keep tests independent. Use temporary resources with cleanup, deterministic
  clocks or synchronization for concurrency, and explicit fixtures rather
  than shared mutable state.
- Treat coverage as a diagnostic, not a target that proves correctness. Raise
  a threshold only when the project can maintain it and exclude generated or
  untestable code deliberately.

Run focused tests while iterating, then the crate or workspace suite before
handoff. Add benchmarks only for a stated decision; benchmark release builds,
use realistic inputs, and prevent dead-code elimination.
