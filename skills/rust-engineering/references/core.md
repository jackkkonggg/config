# Core Rust design

## Ownership and data modeling

- Take `&T`, `&str`, or slices when a function only observes data; take owned
  values when it stores, transforms, or consumes them. Avoid `&Vec<T>` and
  `&String` in public parameters unless the concrete container is essential.
- Clone at a deliberate ownership boundary. Name or document non-obvious
  clones; do not clone merely to appease the borrow checker before examining
  lifetimes, scopes, and data flow.
- Model meaningful states with enums, newtypes, and validated constructors.
  Keep public APIs forward-compatible only when that compatibility is useful;
  use exhaustive matching within the owning crate.

## Errors and public APIs

- Return `Result` for expected failure. Attach context at I/O, parsing, and
  external-service boundaries without losing the underlying cause.
- Design typed errors for reusable library APIs. Use an application-level
  error wrapper only at the binary boundary, where callers do not need to
  branch on individual causes.
- Reserve panics for violated programmer invariants. Do not treat `unwrap`,
  `expect`, or a coverage target as an absolute rule: justify intentional uses
  in tests, prototypes, or proven invariants.
- Document public behavior, including errors, panics, and safety requirements
  where relevant. Run doctests when examples are part of the public contract.

## Unsafe and FFI

- Prefer safe abstractions. Introduce `unsafe` only when its benefit is
  measurable or required by an interface that cannot be expressed safely.
- Keep each `unsafe` block small and place its safety invariant immediately
  beside it. Validate the abstraction boundary, not just its happy path; add
  Miri or platform-specific checks when they exercise the risk.
- Make FFI layouts and ownership transfer explicit. Do not infer ABI, null,
  aliasing, or lifetime guarantees from a foreign caller.
