# Collections, Iterators, and Serialization

## Contents

- Select a data structure from operations
- Keep borrowing and iteration honest
- Parse at boundaries
- Design serialization contracts
- Verify data behavior

## Select a data structure from operations

Choose a collection from the operations, ordering, ownership, and performance
requirements that are actually present. Start with the standard library when it
expresses the need clearly.

| Need | Often suitable | Questions to answer |
| --- | --- | --- |
| Ordered sequence and indexed access | Vec | Is append-heavy growth, stable ordering, or contiguous storage useful? |
| FIFO work queue | VecDeque or a channel | Is this local buffering or cross-task backpressure? |
| Key lookup | HashMap or BTreeMap | Is deterministic ordering, range lookup, or adversarial input important? |
| Membership | HashSet or BTreeSet | Is ordering, reproducibility, or a custom key invariant needed? |
| Priority selection | BinaryHeap | Does the caller need only the best next item or arbitrary removal too? |
| Fixed small domain | enum, array, or dedicated struct | Would a map hide a closed invariant? |

Do not replace a clear collection with a specialized crate based on a generic
performance rule. Profile representative data and workload first. If a map
crosses a public boundary, document key equivalence, ordering guarantees,
duplicate handling, and ownership behavior.

Prefer accepting a slice or iterator-like input when callers do not need to
give up a specific collection. Prefer returning a concrete collection when the
caller needs ownership and predictable reuse. Returning an iterator can avoid
allocation and retain flexibility, but it makes lifetime, error, and
single-versus-multiple-pass behavior part of the API.

## Keep borrowing and iteration honest

Iterator adapters communicate transformations well when each stage has one
clear purpose. A loop is often clearer when it needs early exit, several mutable
accumulators, non-linear control flow, or error handling that would become a
dense chain. Neither form is inherently faster; inspect generated work only
after a measurement identifies the path.

Avoid collecting an iterator only to iterate it once unless collection creates a
needed ownership, sorting, grouping, replay, or boundary. Conversely, collect
when a lazy iterator would borrow data past its useful scope or hide a
meaningful allocation and evaluation point.

Use iterator naming conventions consistently: an iter method commonly borrows,
an iter_mut method gives mutable references, and an into_iter method consumes
ownership. Follow local conventions for associated iterator types and avoid
surprising a caller with a method that consumes a value under a read-like name.

For strings, remember that indices are byte offsets and not arbitrary character
positions. Slice only at known character boundaries; use chars, grapheme-aware
tools, or a domain-specific parser when user-visible text requires it. Avoid
assuming ASCII merely because an example input is ASCII.

## Parse at boundaries

Turn untrusted or loosely structured data into validated domain values close to
the boundary. A parser should preserve enough location and field context for a
caller to correct input, then leave the core domain free from repeated stringly
checks. Use a fallible conversion or deserializer to establish invariants once.

Distinguish transport shape from domain shape. A wire struct can use optional or
loosely typed fields where a domain type uses an enum, newtype, or validated
value. This separation gives a place to define defaults, compatibility policy,
and useful errors without leaking an external format through the program.

Avoid accepting arbitrary maps or JSON values deep in business logic when a
smaller typed interface is available. If extensibility demands unknown fields,
decide whether to reject, preserve, ignore, or log them and treat that choice as
a compatibility contract.

## Design serialization contracts

Serde derives are convenient, but a serialized type becomes an API to files,
network peers, caches, and other languages. Review field names, enum tagging,
defaults, omission rules, numeric ranges, and unknown-field policy before
shipping. Version a durable external format deliberately rather than assuming a
Rust struct rename is internal.

Use transport-specific attributes only when their behavior is tested and
documented. A default during deserialization is a compatibility promise; ensure
it represents a safe historical meaning rather than merely making old payloads
parse. Avoid serializing internal caches, secrets, handles, or derived state
unless the format explicitly requires them.

Use custom serialization or conversion layers when domain invariants need
enforcement, source locations need preservation, or a stable wire form differs
from the Rust representation. Keep the custom code small and test both
successful round trips and intentionally rejected inputs.

## Verify

For a collection or data-format change, verify:

1. The chosen structure supports the measured or stated operations.
2. Iteration order, duplicate policy, and ownership behavior match caller
   expectations.
3. Input validation occurs once at a clear boundary.
4. Serialized output remains compatible where the project promises it.
5. Malformed, unknown, missing, and overflow-prone inputs have explicit tests.

Use property tests where invariants such as round-trip preservation, ordering,
or uniqueness apply across many values. Keep fixtures representative of real
historical payloads, not only values created by the current serializer.
