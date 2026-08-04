# Ownership, Lifetimes, and Memory

## Contents

- Model ownership before indirection
- Borrowing and lifetime design
- Smart pointers and interior mutability
- Pinning, drop, and allocation
- Verify ownership-sensitive changes

## Model ownership before indirection

Start by naming who owns a value, how long it must live, and whether it is
shared or mutated. Most designs become simpler when data has one clear owner and
APIs borrow it for the shortest useful scope.

| Need | Prefer | Reconsider when |
| --- | --- | --- |
| Read without retaining | a shared reference or string slice | The callee must store or outlive the input. |
| Mutate under one owner | an exclusive reference | Aliasing or independent lifetimes are required. |
| Transfer responsibility | an owned value | The caller needs the value after the operation. |
| Shared immutable ownership | Rc or Arc | A borrow or owned clone communicates intent more directly. |
| Shared mutation | a synchronization or interior-mutability primitive | Ownership can be reorganized to avoid shared mutable state. |

Use slices and string slices for read-only inputs when the operation does not
need ownership. Add a conversion abstraction only when it makes multiple input
forms genuinely useful; a concrete path, string slice, or owned value is often
easier to read and infer.

Clone is not a failure. Make consequential clones visible, understand whether
they duplicate data or merely a handle, and avoid introducing one solely to
silence a borrow-checker error without understanding the lifetime boundary.
Copy is a semantic promise that implicit duplication is cheap and unsurprising,
not a numeric size rule.

## Borrowing and lifetime design

Prefer lifetime elision when the relationship is obvious. Add named lifetimes
only to express a real relationship between inputs and outputs; a named
lifetime documents a constraint and cannot make a value live longer. If a
returned reference survives because it points into input data, make that source
relationship clear in the signature.

Avoid self-referential structs in ordinary application design. They interact
poorly with moves and often signal that an index, key, arena, ownership split,
or owned allocation is a better representation. If one is necessary, isolate
it behind a small API and document the invariants before using unsafe code.

Use Cow when an API can naturally return borrowed data in the common case and
owned data only after a meaningful transformation. Do not use it as a default
for uncertainty about ownership; an enum, borrowed result, or owned result may
show the state transition more clearly.

Borrowing across await can be valid, but it affects a future's lifetime,
movability, and Send properties. Design async ownership explicitly instead of
sprinkling clones at await boundaries. Move owned data into a task when the task
must outlive its caller; borrow only when the task lifetime is structurally tied
to that caller.

## Smart pointers and interior mutability

Choose the smallest primitive that states the concurrency and mutation model:

- Box gives a stable heap allocation or breaks recursive-size cycles; it is not
  automatically a performance optimization.
- Rc is single-threaded shared ownership; Arc is for ownership shared across
  threads or tasks that require Send and Sync semantics.
- Cell supports replacement without runtime borrow checks.
- RefCell enforces Rust borrowing rules at runtime and fits only where that
  runtime failure mode is acceptable and contained.
- Mutex and RwLock coordinate access; select synchronous versus async forms
  from the work performed while holding the guard.

An async-aware mutex can legitimately hold a guard across await when the
critical section must include asynchronous work, but that should be bounded and
scrutinized for contention. A synchronous mutex is often simpler when the
guarded operation is brief and no await occurs. A lock cannot repair an unclear
ownership model.

Arc plus Mutex is a tool, not a default architecture. Prefer message passing,
partitioned state, immutable snapshots, or a single owner when they clarify the
state machine and reduce lock ordering concerns.

## Pinning, drop, and allocation

Pin constrains movement only when a type relies on that promise. Do not add it
because a future or async API looks advanced; use safe APIs supplied by the
type unless implementing a pinned abstraction. Manual projection, Unpin
assumptions, and unsafe pinning code require a written movement invariant.

Drop runs during unwinding as well as normal scope exit. Keep destructors quick,
non-blocking, and resilient: release owned resources, but do not perform
asynchronous work, contact external services, or panic. Define field order
intentionally when one destructor relies on another. Use explicit shutdown or
close operations for fallible, asynchronous, or observable cleanup.

Allocation choices follow a measured lifetime and access pattern. Reserve
capacity when a credible size bound exists; reuse buffers when profiling shows
allocation churn; box a large enum variant only when layout measurements and
branch distribution justify it. Avoid exposing a collection type publicly when
callers only need a slice or iterator-like behavior.

## Verify

Review each ownership-sensitive change:

1. Can each value's owner, mutation authority, and shutdown path be named?
2. Does every returned borrow point to data that outlives it by construction?
3. Is shared ownership essential, and does the pointer match the thread and
   mutation model?
4. Does a destructor perform only reliable local cleanup?
5. Did profiling justify any allocation, clone, pointer, or layout complexity?

Use compiler errors as design feedback, then add a focused behavior or
concurrency test. Run Miri or a concurrency model checker when the code uses
unsafe aliasing assumptions or subtle shared-state protocols.
