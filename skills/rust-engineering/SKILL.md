---
name: rust-engineering
description: Use for Rust implementation or review involving APIs, ownership, async, unsafe code, performance, testing, or compatibility.
---

# Rust Engineering

Inspect edition, MSRV, targets, `no_std`, features, public API, dependencies,
and local conventions. Keep the smallest design that preserves invariants.

Load matching references:

- [Workflow and compatibility](references/workflow-and-compatibility.md) for Cargo, MSRV, features, targets, or validation.
- [Ownership, lifetimes, and memory](references/ownership-lifetimes-and-memory.md) for borrowing, smart pointers, pinning, or interior mutability.
- [Types, traits, and domain modeling](references/types-traits-and-domain-modeling.md) for enums, generics, conversions, closures, or dispatch.
- [Public APIs and semver](references/public-apis-and-semver.md) for exported interfaces, builders, extension traits, or compatibility.
- [Errors, panics, and documentation](references/errors-panics-and-documentation.md) for failure boundaries, contracts, or rustdoc.
- [Collections, iterators, and serialization](references/collections-iterators-and-serialization.md) for data structures, parsing, or Serde.
- [Async and concurrency](references/async-and-concurrency.md) for tasks, cancellation, channels, locks, or parallel work.
- [Unsafe, FFI, and numeric safety](references/unsafe-ffi-and-numeric-safety.md) for invariants, ABI, pointers, casts, or overflow.
- [Testing and verification](references/testing-and-verification.md) for test layers, properties, fuzzing, async, or feature matrices.
- [Performance and observability](references/performance-and-observability.md) for profiling, benchmarks, allocation, tracing, or metrics.
- [Macros, const, and metaprogramming](references/macros-const-and-metaprogramming.md) for macros, generated APIs, or const evaluation.

Measure before optimizing. Use repository evidence and documentation for
dependencies, patterns, and version-sensitive APIs. State every `unsafe`
contract and make a compatibility decision for public changes.

Start with the narrowest useful `cargo check` or test. Before handoff, run the
applicable formatting, lint, documentation, test, and feature/target checks;
record combinations intentionally unsupported by the crate.
