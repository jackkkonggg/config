# Types, Traits, and Domain Modeling

## Contents

- Represent valid states directly
- Design traits for callers
- Choose dispatch and conversion boundaries
- Use patterns and closures deliberately
- Verify type-level APIs

## Represent valid states directly

Use types to make invalid states difficult to construct, but stop before the
type system obscures the domain. An enum is often clearest for a closed set of
states; a newtype gives a domain value validation, formatting, and a trait
surface; a struct groups fields that evolve together.

~~~rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AccountId(String);

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvalidAccountId;

impl TryFrom<String> for AccountId {
    type Error = InvalidAccountId;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        if value.trim().is_empty() {
            return Err(InvalidAccountId);
        }
        Ok(Self(value))
    }
}
~~~

The constructor establishes an invariant once. Keep direct field construction
private if callers must not bypass it, and expose read-only access in the form
callers need. Do not introduce a wrapper only to rename a primitive when it
adds no behavior, invariant, or safety boundary.

Use typestate when an operation genuinely requires a compile-time state
transition and the generic surface is easier to use than a runtime error. For
ordinary workflow data, an enum plus clear runtime validation can give better
diagnostics and simpler interoperability.

Exhaustive match expressions make state changes visible. Prefer them for domain
decisions; use if-let, let-else, or matches when only one variant matters and
the shorter shape remains readable. Avoid wildcard matches over important local
enums when handling each state would expose a missed case.

## Design traits for callers

Start with the caller's required capability, not an implementation hierarchy. A
small trait with one coherent responsibility is easier to implement, test, and
evolve. Associated types fit a trait when one implementation has a natural
related type; generic parameters fit when callers choose the type per use. Keep
bounds local so error messages and implementation freedom remain manageable.

Use a trait object when runtime-selected implementations, plugin boundaries, or
heterogeneous collections are fundamental. Use generics or an opaque return
type when static dispatch, monomorphization, or concrete type flow is natural.
This is an ergonomics, code-size, and extensibility decision; profile hot paths
rather than assuming either dispatch approach wins.

Public traits are difficult to change. Decide whether downstream
implementations are intended. If not, a sealed trait, private module boundary,
or concrete type may protect future evolution. If they are intended, document
required invariants, error behavior, object-safety expectations, and the semver
cost of adding methods. Add default methods only when their behavior is sound
for existing and future implementors.

Native async functions in traits have tradeoffs for public APIs,
dyn-compatibility, and auto-trait bounds. Check current Rust and ecosystem
documentation for the crate MSRV and caller needs before selecting native async
traits or an adapter. Do not default to a macro merely because an async trait
exists.

## Choose conversion and API boundaries

Implement From for infallible, unsurprising conversions and TryFrom for
validation or loss. Let callers use Into at call sites, but normally implement
From on the destination type. Add AsRef, Borrow, or similar traits only when
their precise semantic relationship is natural and useful to generic callers.

Parsing is a boundary: convert raw input into a validated domain type early,
preserve useful errors, and keep internal functions operating on meaningful
types. Avoid a separate validate-then-parse pass when one fallible constructor
can establish the invariant without duplicated logic.

Builders help when construction has optional fields, defaults, many parameters,
or validation that benefits from named methods. Keep required inputs explicit
when a builder would allow a meaningless half-state. Mark a builder or result
must-use when dropping it is plausibly a caller mistake; do not add that
attribute mechanically to values whose ignored result is normal.

## Patterns, const, and closures

Use const generics or const functions when a compile-time value is part of the
domain and the supported MSRV permits it. Do not force dynamic configuration
into const machinery just to move a check earlier. A static has one storage
location and synchronization implications, while a const is substituted at use.

Choose closure bounds from how the closure is called: Fn for repeated shared
calls, FnMut for mutation, and FnOnce for consumption. Capture by reference
until the closure must own data or outlive its defining scope, then use move
with a conscious ownership decision. Returning an opaque closure hides a
concrete type; storing heterogeneous callbacks generally needs a trait object.

## Verify

Ask whether a type makes an invalid state unrepresentable or merely moves
validation out of sight. Compile public examples and inspect inference and error
messages from a caller perspective. Test every fallible constructor, important
state transition, and default trait method. For a public trait or conversion
change, review downstream implementability and semver impact before shipping.
