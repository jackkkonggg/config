# Errors, Panics, and Documentation

## Contents

- Choose an error boundary
- Preserve context without leaking implementation detail
- Specify panic and safety contracts
- Write useful documentation and examples
- Verify failure behavior

## Choose an error boundary

Use Result for failures a caller can reasonably handle, report, retry, or
translate. Use Option when absence is an expected, self-explanatory state and
the caller does not need a reason. A panic fits a violated invariant, impossible
internal state, or unrecoverable programming error only when that contract is
clear and the panic does not turn ordinary external input into process failure.

Error design changes by boundary:

| Boundary | Good default | Why |
| --- | --- | --- |
| Low-level library operation | a specific public error type or stable category | Callers need to match, recover, or display meaningful failure. |
| Application or command boundary | a contextual error report | The final user or operator needs a causal chain and useful action. |
| Internal helper | propagate the local error or add context when the operation becomes ambiguous | Do not erase information before it reaches a meaningful boundary. |
| Parse and validation boundary | a domain error that identifies invalid input | The caller needs a fixable explanation, not only a boolean. |

Do not expose every dependency error as permanent public API unless callers need
its precise type. A library can wrap or classify causes while preserving source
information for diagnostics. An application can add operation context as errors
cross I/O, persistence, or service boundaries.

Use the question-mark operator when propagation is the intended control flow.
Map or convert an error where the abstraction changes, not merely to satisfy a
type signature. Error strings should add useful context and avoid duplicating a
lower-level message; put identifiers, paths, and operation names in structured
fields or context where they can be observed safely.

## Preserve context without leaking detail

Ask what a caller must know to decide what to do next. Keep that distinction in
the error type. A public error can expose categories such as invalid input,
conflict, unavailable dependency, or permission denial while an internal source
chain retains operational detail.

Avoid turning expected errors into logs at every layer. Repeated logging produces
duplicate noise and can leak data. Select one reporting boundary, preserve the
chain until it reaches that boundary, and attach structured diagnostic fields
there. The observability reference covers correlation and sensitive data.

Do not use unwrap or expect as a generic shortcut in production paths. They can
be correct when an invariant is locally obvious and a panic is truly the desired
failure mode, particularly in tests or fixed generated data. In that case make
the reason specific enough that a failure diagnoses the violated assumption.
For input, I/O, parsing, contention, and remote dependencies, return or handle
the error intentionally.

## Panic, safety, and cancellation contracts

A public function that can panic must state the condition. A fallible
alternative is often more composable when the condition can arise from caller
input. Do not document a panic after the fact while leaving a surprising path
that users cannot preflight.

Unsafe functions and unsafe trait methods require a Safety section that states
what callers must uphold. The contract should be concrete: alignment, validity,
aliasing, initialization, lifetime, thread, or protocol conditions as
appropriate. The implementation must enforce every other precondition itself.

Async functions also need cancellation thinking. If cancellation can leave a
queue item, file, transaction, permit, or state machine half-updated, document
the semantics and redesign toward atomic commits, rollback, or a recoverable
state. Cancellation safety is part of a failure contract, not merely runtime
behavior.

## Write documentation that earns its space

Start docs with what the item does and why a caller would use it. Then cover the
parts the type system cannot express:

- Preconditions, ownership transfer, blocking, allocation, and ordering.
- Error, panic, and safety behavior.
- Feature, target, or runtime requirements.
- Concurrency and cancellation guarantees.
- A compact example of the intended call path when it clarifies setup.

Use headings such as Errors, Panics, and Safety when they help rustdoc users
scan a contract. Link to related local types and modules with intra-doc links,
but run docs after renames to verify they resolve. Keep examples small enough to
read; hide setup only when it is incidental and the visible code still tells the
truth about required imports, runtime, and cleanup.

A README introduces the crate; API documentation defines item-level behavior.
Do not rely on a README alone to preserve a public contract. Conversely, avoid
copying a full conceptual guide into every item when a module-level overview can
link to it.

## Verify

Test failure behavior as carefully as success behavior:

1. Does each expected failure produce the right public category and useful
   context?
2. Can callers recover, retry, or display it without inspecting private types?
3. Are panic and Safety conditions explicit and reachable only as documented?
4. Do examples compile, and do doctests exercise the documented API?
5. Could a cancellation or partial failure leave externally visible state
   ambiguous?

Use focused assertions on error categories or structured properties rather than
brittle full-string snapshots unless the text itself is a user-facing contract.
