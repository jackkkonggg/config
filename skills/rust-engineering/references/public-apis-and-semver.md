# Public APIs and Semver

## Contents

- Define the intended surface
- Design for evolution
- Choose construction and extension shapes
- Name and document public behavior
- Review compatibility deliberately

## Define the intended surface

A public API includes more than public functions. Modules, re-exports, trait
implementations, feature names, defaults, error variants, serialized forms,
examples, macro output, and behavior visible through callbacks can all become
downstream contracts. List the intended caller entry points before exposing
internal structure.

Prefer a small, coherent public surface over a convenient re-export of every
internal type. Keep implementation modules private where possible, expose
domain types and operations that callers need, and make constructors reflect
the values that define a valid instance. A public field is an especially strong
commitment because it fixes both construction and representation.

| Goal | Useful shape | Tradeoff to state |
| --- | --- | --- |
| Required data and validation | constructor or fallible conversion | Constructor changes can still be breaking. |
| Optional named configuration | builder | Decide what can be changed after build and how errors surface. |
| Read-only protocol capability | trait | Decide whether external implementation is supported. |
| Optional helper on a foreign-looking type | extension trait | Discoverability versus future method-name conflict. |
| Stable return abstraction | owned domain type or opaque iterator | Do not hide errors or allocation behavior that callers need to control. |

Keep behavior close to the API that owns it. A method is often clearer when the
operation is intrinsic to the type; a free function can be better for symmetric
operations, constructors, or transformations without a privileged receiver.
Choose consistency with the surrounding crate over a universal rule.

## Design for evolution

Assume an exported shape will need refinement. Preserve room only where it
helps a plausible evolution; over-engineering every type makes APIs harder to
use today.

- Use private fields and constructors when representation may change.
- Use a non-exhaustive enum or struct when external exhaustive construction or
  matching would prevent a compatible future addition.
- Prefer explicit option structs or builders to a long positional parameter
  list that will grow.
- Avoid adding broad blanket implementations without checking coherence and
  surprising downstream method resolution.
- Keep features additive when practical; removing a default capability or
  changing a feature implication is a compatibility event.
- Document ownership, blocking, allocation, ordering, and error guarantees when
  callers reasonably depend on them.

Adding a method to a publicly implementable trait can be breaking. A default
method reduces the immediate source break but can still impose unsound,
expensive, or semantically wrong behavior on implementors. Sealed traits are
appropriate when a crate owns the implementation set; they are not a substitute
for explaining a protocol intended for extension.

Semver is not only compilation compatibility. A new panic, changed iteration
order, slower hot path, altered retry behavior, or different serialized output
can break a caller's expectations. Treat observable behavior as part of the
review even when a semver checker reports no signature change.

## Construction, conversions, and extension

Use a fallible constructor or TryFrom to create validated domain values.
Implement From only for lossless, unsurprising conversions. Do not accept a
maximally generic input just to make one call site shorter: public type
inference and error messages are part of the user experience.

Builders should have a clear terminal operation and establish the same
invariants as constructors. Make an invalid partial configuration impossible to
use or produce a useful error at build time. A fluent chain that silently drops
a meaningful result should be marked must-use where that warning helps.

Extension traits can add methods without wrapping a type, but only when the
method belongs to a stable capability and name conflicts are acceptable.
Namespace them intentionally and document the import needed for method
resolution. Prefer a newtype when the operation depends on a distinct domain
invariant or must prevent accidental mixing with the wrapped type.

## Naming and documentation

Follow Rust naming conventions unless the local domain has a strong reason not
to. Names should say whether a method borrows, mutates, consumes, allocates,
performs I/O, blocks, or can fail when that property is not obvious. Avoid
inventing abbreviations that make search and error messages opaque.

Document public items in proportion to their complexity. Explain the contract,
not the implementation: accepted inputs, returned values, error conditions,
panic and safety requirements, ordering, ownership, and important complexity
or blocking characteristics. Provide a small example when it proves the common
path or a non-obvious invariant. Keep doctests representative and compile them
as part of the documentation suite.

Use intra-doc links for stable local concepts, then run documentation checks to
catch stale names. Do not turn every noun into a link; a link should help the
reader navigate a real relationship.

## Review compatibility deliberately

Before publishing a public change, answer:

1. Which callers can construct, match, implement, serialize, or feature-gate
   this item today?
2. Does the change alter type inference, trait coherence, object safety,
   ownership, ordering, allocation, or error behavior?
3. Is the desired extension point truly open to downstream implementations?
4. Can a compatible new API coexist with the old behavior for a release cycle?
5. Do examples, docs, feature descriptions, and re-exports describe the same
   contract?

Test a small external-caller example when the change is subtle. For released
libraries, use the repository's semver or API-diff tooling where available, but
treat its result as input to review rather than proof of behavioral safety.
