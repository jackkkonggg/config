# Macros, Const, and Metaprogramming

## Contents

- Prefer the simplest abstraction
- Design declarative macros for readable call sites
- Build proc macros as compiler-facing tools
- Use const evaluation with an explicit MSRV
- Verify generated behavior and diagnostics

## Prefer the simplest abstraction

A function, type, trait, module, or build-time data file is often easier to
understand and diagnose than a macro. Introduce a macro when syntax repetition,
declarative language integration, or compile-time generation materially improves
the caller experience. A macro should remove a repeated semantic pattern, not
hide ordinary control flow or make type errors harder to read.

Before selecting a macro, ask:

- Does the caller need new syntax, or only a reusable operation?
- Can a generic function, builder, trait, or iterator express the behavior?
- Is the generated code stable across targets, editions, and supported MSRV?
- Will errors point to the user input with an actionable message?
- Does the macro need to preserve a public API or serialized contract?

Keep macro scope small. Avoid a language-within-a-language configuration format
when a typed Rust API would expose defaults, validation, IDE navigation, and
compiler diagnostics more clearly.

## Design declarative macros for readable call sites

Use macro_rules when token matching and expansion can remain local and
predictable. Select fragment specifiers that express the accepted syntax and
avoid accepting arbitrary tokens merely to defer errors into generated code.
Hygiene protects local names, but exported macros still need deliberate paths
for items from their defining crate.

Keep an exported macro's public syntax documented with examples, including its
required imports and feature gates. Refer to the defining crate through a stable
crate path mechanism when a macro can be renamed by a downstream dependency.
Hide helper macros unless callers are intended to invoke them. Avoid generating
large repeated expressions that evaluate an input more than once.

When a macro forwards user expressions, preserve evaluation order and ownership
semantics. A convenience macro that double-evaluates a fallible or mutating
expression is a correctness bug, not merely an ergonomic issue.

## Build proc macros as compiler-facing tools

Proc macros run during compilation and must be treated as compiler-facing tools:
fast, deterministic, target-independent where possible, and careful with
diagnostics. Use standard parsing and token-generation libraries chosen by the
repository; keep parsing, validation, and emission separated so each has a
testable contract.

Generate errors at the most relevant input span. Report unsupported forms,
conflicting attributes, missing fields, and invalid values before emitting code
that causes a cascade of obscure type errors. Do not panic on user input. If a
macro expands to unsafe code, make the generated invariant inspectable and
document what the user-supplied input must guarantee.

A separate proc-macro crate is a normal packaging boundary because procedural
macros use a distinct crate type. Keep runtime support code in the ordinary
library crate, keep the macro crate thin, and avoid cyclic dependency shapes.
Avoid reading arbitrary files, environment variables, or network resources at
expansion time unless the build contract makes the dependency reproducible and
rerun-safe.

## Use const evaluation deliberately

Const values, const functions, const generics, and static storage solve distinct
problems. Use const evaluation when a value is inherently compile-time and the
supported MSRV provides the required operation. Use static storage when there
must be one addressable global object, then account for synchronization and
initialization behavior.

Do not force runtime data, I/O, allocation, or complicated error reporting into
const code just to make it look more rigorous. A checked runtime constructor can
give better diagnostics and wider compatibility. If const and runtime paths
must agree, test both against the same table of cases.

Const generics are valuable for dimensions, capacities, protocol widths, and
other type-level quantities with a real caller benefit. Keep error messages
readable and avoid adding a generic parameter that callers must thread through
without understanding its domain meaning.

## Verify generated behavior and diagnostics

Test a macro at its public call site, not only by inspecting expansion text.
Cover successful common use, invalid syntax or attributes, path renaming,
feature-gated behavior, ownership-sensitive expressions, and public doctests.
Compile failures are part of the API for a macro; use the repository's UI or
compile-test approach when diagnostics are central.

For proc macros, keep a small corpus of expected errors and avoid snapshots
that make review of every token expansion impractical. Run formatting and docs
on generated public APIs where possible. Check MSRV explicitly when a macro or
const feature depends on a newer language stabilization.

Before handoff, confirm that the macro improves the caller surface enough to
justify its diagnostic, compile-time, and maintenance cost. If the answer is
unclear, prefer the simpler typed API.
