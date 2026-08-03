# Workflow and Compatibility

## Contents

- Establish constraints
- Change in small, observable steps
- Validate the supported matrix
- Avoid compatibility traps

## Establish constraints before design

Read the root and member Cargo.toml files, CI configuration, rust-toolchain files,
build scripts, and crate-level attributes before selecting an API or dependency.
Record the facts that constrain the change.

| Concern | Inspect | Design consequence |
| --- | --- | --- |
| Edition and MSRV | package metadata, CI toolchains, support policy | Do not use language or library APIs that the declared MSRV cannot compile. |
| Targets | cfg branches, CI targets, linker settings | Keep platform code behind precise conditions and test the affected target when practical. |
| Runtime model | dependencies, feature flags, public traits | Do not introduce a runtime, allocator, or executor into a library without an explicit compatibility decision. |
| no_std and allocation | crate attributes and dependency features | Keep std APIs and allocation-dependent types out of the baseline unless the crate opts in. |
| Features | feature declarations and cfg_attr | Make features additive when practical and identify combinations deliberately unsupported. |
| Public surface | public modules, re-exports, examples, semver policy | Treat signatures, trait impls, feature defaults, and serialized formats as commitments. |

Use cargo metadata to understand workspace membership and resolved features; do
not infer the active graph from one manifest alone. For unfamiliar Cargo
behavior, verify it against the current [Cargo reference](https://doc.rust-lang.org/cargo/reference/).

## Change in small, observable steps

Start from the smallest behavior-preserving change that proves the intended
direction. Add a focused regression test before broad cleanup when a defect or
invariant is concrete. For a public change, state the caller-visible before and
after behavior, including errors and feature availability. Prefer a new,
documented entry point over silently changing established semantics.

Keep module boundaries aligned with ownership and behavior. A small crate can
remain flat; split a module when it creates a useful boundary for visibility,
tests, platform code, or a distinct domain. Avoid moving files merely to match
a generic folder pattern. Re-export a stable public item deliberately rather
than leaking an internal module hierarchy by accident.

When adding a dependency, first check whether the crate already carries a
suitable abstraction. Evaluate its MSRV, target and no_std support, license,
maintenance, feature footprint, and public-type exposure. A new dependency can
be justified, but it should solve a demonstrated problem rather than replace a
few clear lines with a transitive graph.

Build scripts, proc macros, generated bindings, and environment-dependent
configuration deserve an input/output contract. State which files, environment
variables, tools, and platform assumptions affect the build, then emit precise
rerun directives or documentation. Avoid hidden host-machine assumptions in a
crate intended for cross compilation.

## Validate the supported matrix

Run the narrowest command that answers the immediate question, then expand to
the supported matrix before handoff. A typical baseline is:

~~~text
cargo fmt --check
cargo check
cargo clippy --all-targets -- -D warnings
cargo test
cargo doc --no-deps
~~~

Adapt flags to the repository rather than treating that list as universal. For
example, all-features is useful only when every feature is intended to compose;
no-default-features matters only when the crate claims that configuration works;
examples, benches, doctests, workspace members, and cross targets can require
separate commands. Run CI-equivalent commands when available and affordable.

For a library with an MSRV policy, test the declared minimum toolchain as well
as current stable. If the project does not define an MSRV, do not invent one:
use current stable for the change and flag any new stabilization dependency for
maintainers. For public crates, consider an API or semver diff tool when a
change could alter downstream compilation, trait coherence, or generated docs.

Classify results explicitly:

- Supported and passed: the repository claims the combination and it was run.
- Supported but not run: state why and do not imply coverage.
- Intentionally unsupported: document the incompatible feature, target, or
  runtime pairing near its definition.
- Unknown: investigate before relying on the combination in a release.

## Compatibility traps

Adding a trait method, variant, field, generic bound, feature default, or
blanket implementation can break downstream code even if local tests pass.
Review both source and behavior compatibility. Non-exhaustive types, private
fields, sealed extension traits, constructors, and builders can preserve future
room, but only when they match the library's ergonomics and existing policy.

Feature flags are part of the public contract. Avoid using one feature to turn
off unrelated capabilities, changing defaults without a migration path, or
assuming resolver behavior without checking the workspace. Keep cfg branches
small enough to test and give unsupported target code a clear compile-time
message where possible.

Do not raise MSRV incidentally through a transitive dependency, build tool, or
copied example. Lockfile policy depends on whether the project is an
application or library and on its existing convention.

## Verify

Before handoff, answer with repository evidence:

1. Which toolchains, targets, and feature combinations does this crate claim?
2. Did the change alter a public signature, impl set, serialization format, or
   default feature?
3. What is the narrow regression test, and which broader matrix checks passed?
4. Does the build depend on a host tool, environment variable, generated file,
   or network resource that needs documenting?
5. Which compatibility question remains untested, if any?


## Release and migration discipline

Treat a behavior change as a migration when it can affect stored data,
downstream callers, build environments, or operators. Identify the old state,
the new state, the transition, and the rollback story before changing a default
or deleting an entry point. A library might retain a deprecated adapter for a
documented release window; an application might write a backward-compatible
format before readers begin emitting the new one. The correct sequence depends
on the repository release policy, but compatibility should be intentional.

For configuration, parse external input into a versioned transport shape and
then convert it to the current domain model. This gives the program a single
place to recognize a legacy spelling, issue a warning, supply a safe historical
default, or reject a format that cannot be migrated. Do not scatter migration
rules through call sites where they become impossible to remove.
