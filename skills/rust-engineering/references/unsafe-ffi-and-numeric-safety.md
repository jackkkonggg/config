# Unsafe, FFI, and Numeric Safety

## Contents

- Minimize the unsafe surface
- Write and enforce safety invariants
- Design FFI boundaries
- Make numeric behavior explicit
- Verify low-level claims

## Minimize the unsafe surface

Unsafe code is justified by a capability safe Rust cannot express, not by a
desire to silence the compiler or force a micro-optimization. First consider a
safe standard-library API, a proven crate already used by the project, a
different representation, or a smaller local abstraction. Keep any necessary
unsafe block close to the invariant it depends on and expose a safe wrapper
whenever possible.

Rust 2024 requires explicit unsafe blocks even inside unsafe functions; earlier
editions can opt into the same lint. Use that boundary to explain the operation
and its proof. Do not create a broad unsafe helper that merely relocates
unchecked assumptions; narrow functions make callers and reviewers see exactly
what they must uphold.

An unsafe abstraction has two contracts:

1. The caller contract: conditions an unsafe caller must establish.
2. The implementation contract: conditions the implementation must enforce
   internally, including cleanup on every path.

Document both. If a function can be safe because it validates an index,
alignment, length, discriminant, or lifetime relationship itself, make it safe.

## Write and enforce safety invariants

A safety comment should name the concrete facts that make an operation valid:
pointer provenance, alignment, initialization, bounds, aliasing, lifetime,
thread access, layout, or foreign-library protocol. Do not write only that an
operation is safe because the caller guarantees safety; that restates the
question.

For raw slices, prove length and initialization before forming a reference. For
pointer casts, prove alignment, valid representation, and aliasing conditions.
For shared mutable data, prove exclusive access or the synchronization protocol.
For manually managed memory, state ownership transfer and deallocation
allocator. For pinned data, state why the value cannot move and who maintains
that promise.

Use a short safe wrapper to centralize checks. It is often easier to audit a
small proof next to one unsafe operation than a scattered set of unchecked
indexing and casts. Avoid exposing references with a lifetime that is not tied
to the actual allocation or protocol owner.

## Design FFI boundaries

FFI needs an ABI, representation, ownership, error, and panic policy. Match
foreign functions with the ABI required by the target platform and use
representation attributes deliberately for data crossing the boundary. Do not
assume Rust enum, bool, string, trait-object, or generic layout is a stable C
interface.

Define who allocates and frees every pointer, which side owns buffers after a
call, whether null is allowed, how lengths are measured, and what happens on
partial failure. A common robust boundary uses an opaque handle, explicit
constructor and destructor functions, byte pointers plus lengths, and integer
status values or an out-parameter for errors. The exact shape depends on the
consumer language and project conventions.

Do not unwind across a foreign boundary unless the ABI and both sides explicitly
support it. Catch or translate panics at the boundary according to the crate
policy, and keep callbacks alive only as long as the foreign library contract
permits. Treat callbacks as re-entrant unless the foreign API proves otherwise.

Generated bindings and bindgen-like output can be correct yet still require a
safe domain wrapper. Keep generated code separate from hand-written policy and
test the wrapper against the real ABI on each supported target.

## Make numeric behavior explicit

Numeric conversions, overflow, rounding, and sentinel values are domain
decisions. Use fallible conversions when a narrowing conversion can lose data.
Choose checked, saturating, wrapping, or overflowing arithmetic based on the
required result; do not rely on build-profile overflow behavior for a business
rule.

Float equality is appropriate for values with an exact representational contract
such as sentinels, protocol values, or values produced by the same exact
operation. For measured or computed quantities, compare with a tolerance whose
units and scale are documented. Handle NaN, infinity, signed zero, and
conversion failure when they are meaningful to the domain.

Use non-zero integer types, bounded newtypes, or enums when they encode a
real invariant such as a valid divisor, identifier, or protocol tag. Do not
choose smaller integers as a micro-optimization without checking range,
alignment, layout, and the measured bottleneck.

## Verify low-level claims

Before handoff, require evidence for each unsafe or FFI change:

1. Every unsafe block has a nearby invariant explanation and a testable proof.
2. Safe APIs reject invalid values before forming references or calling foreign
   code.
3. Ownership, allocation, nullability, and panic behavior are documented at the
   foreign boundary.
4. Numeric boundary cases include minimum, maximum, zero, overflow, invalid
   conversion, and relevant floating values.
5. Tests run under Miri, sanitizers, platform CI, or fuzzing where the project
   supports them.

A successful compile is not proof of memory safety. Keep the unsafe diff small,
run the strongest available dynamic tools, and ask for an additional review when
the invariant is subtle or security-sensitive.
