# TDD workflow details

Prefer no new test over one that mostly tests mocks, mirrors current
implementation, depends on unrelated global state, or would be deleted
immediately after the fix.

For a flaky bug, isolate time, randomness, concurrency, and external state
before locking the signal down. Document what made the reproduction
deterministic.

If a focused bug exposes a wider failure class, land the narrow regression
first. Add sibling coverage only when it protects a distinct contract and does
not obscure the original evidence.

If failing-before evidence cannot be retained, record the exact command or
observation used and why a normal test was disproportionate.
