---
name: rust-engineering
description: Use for Rust implementation or review involving ownership, public APIs, errors, async, unsafe code, performance, testing, or validation.
---

# Rust Engineering

Inspect the crate's edition, MSRV, feature model, public API, and existing
conventions before changing code. Keep the smallest design that preserves the
required invariants; do not introduce crates, `unsafe`, allocation, or dynamic
dispatch without a concrete need.

Load the relevant reference before deciding:

- [Core Rust design](references/core.md) for ownership, APIs, errors, docs, or `unsafe`.
- [Async and concurrency](references/async.md) for Tokio, tasks, channels, cancellation, or locking.
- [Testing](references/testing.md) for test design, async tests, properties, benchmarks, or coverage.
- [Performance and MCP](references/performance-and-mcp.md) for optimization or MCP servers.

Use the compiler as part of design: start with `cargo check` when practical,
then run the narrowest relevant tests. Before handoff, run applicable project
commands—normally `cargo fmt --check`, `cargo clippy --workspace --all-targets
--all-features -- -D warnings`, and `cargo test`. Respect a crate's documented
MSRV and feature combinations; do not make a passing default-feature build
look like complete validation.

Apply guidance conditionally. Explain meaningful tradeoffs, preserve error
context, and prefer evidence from the repository or current official Rust and
crate documentation over a memorized version or a blanket rule.
