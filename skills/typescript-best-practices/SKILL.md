---
name: typescript-best-practices
description: Use for TypeScript type design, boundary parsing, public APIs, unsafe narrowing, or type-safety review.
---

# TypeScript Best Practices

Follow project conventions. Load
[Type System Discipline](../poteto-mode/references/principles/type-system-discipline.md)
when invalid states or unsafe boundaries drive the task.

- Model meaningful variants with discriminated unions and exhaustiveness checks.
- Treat external data as `unknown`; validate it once at the boundary.
- Prefer narrowing, `satisfies`, and schema-derived types over unchecked casts.
  A justified local cast is acceptable when the runtime invariant is already
  established.
- Consider branded primitives when otherwise identical values are easy to mix
  up at an important boundary. Avoid brands for clear local values.
- Make type guards verify the claim they advertise.
- Derive related shapes with `Pick`, `Omit`, `Parameters`, `ReturnType`,
  `Awaited`, or `typeof` when that prevents drift.
- Prefer object parameters when several same-shaped positional arguments are
  confusing; keep simple positional APIs when clearer.

Use [references/patterns.md](references/patterns.md) for examples. Do not apply
these patterns mechanically when they add ceremony without removing an invalid
state or unsafe boundary. Verify with the project’s type checker and relevant
tests.
