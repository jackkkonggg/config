# Async and Concurrency

## Contents

- Separate concurrency models
- Own task lifetime and cancellation
- Choose channels and synchronization
- Keep blocking work off the executor
- Verify concurrent behavior

## Separate concurrency models

Async concurrency overlaps I/O while work waits; parallelism runs independent
CPU work at the same time. Threads, async tasks, work-stealing pools, and
operating-system processes have different ownership, cancellation, scheduling,
and blocking behavior. Select the smallest model that matches the work rather
than adding a runtime or task boundary by default.

Before spawning anything, answer:

- Who owns the task and retains its handle?
- What event asks it to stop, and when is it joined?
- What result, panic, timeout, or cancellation reaches the caller?
- Which state crosses the boundary, and must it be Send?
- Can a bounded queue or semaphore express the required backpressure?

A detached task is a deliberate background service decision, not the default
for convenience. If its error is meaningful, report or observe it. If its
lifetime follows a request, connection, or parent operation, structure the code
so the parent awaits or cancels it.

## Own task lifetime and cancellation

Use structured task management where possible. A task set or retained join
handles let the owner collect results, surface panics, impose concurrency limits,
and shut down predictably. Joining independent fallible tasks requires a policy:
fail fast, collect all results, or cancel the remaining work. State which one
the user-visible operation needs.

Cancellation is not rollback. Dropping a future or task can occur at any await
point, so make externally visible state transitions atomic or recoverable.
Acquire a permit, read a message, mutate durable state, and acknowledge it in an
order that does not silently lose or duplicate work when interruption happens.
When an operation is not cancellation-safe, isolate it behind an explicit
critical section, transaction, or resumable state machine.

Use a cancellation token, channel close, or owned shutdown signal when the
system has a lifecycle. Give shutdown a bounded, observable sequence: stop
accepting work, notify workers, await completion, then release resources.
Arbitrary sleep delays are timing guesses, not a shutdown protocol.

Select is useful for racing meaningful events, such as a request, timeout,
shutdown, or stream item. Treat each selected branch as a cancellation point.
If one branch consumes state before yielding, verify whether losing the race can
corrupt a protocol.

## Choose channels and synchronization

Channels express ownership transfer and backpressure. Pick the shape from the
message contract:

| Requirement | Useful shape | Important question |
| --- | --- | --- |
| Work queue | bounded multi-producer queue | What capacity limits memory and latency? |
| One response | one-shot channel | What happens if sender or receiver drops? |
| Latest configuration | watch-like channel | Can consumers safely skip intermediate values? |
| Fan-out events | broadcast-like channel | What happens to a slow receiver? |
| Shared queryable state | lock or immutable snapshot | Is a single owner and message protocol clearer? |

Bounded queues make overload visible. An unbounded queue can be appropriate only
when memory growth, producer behavior, and shutdown are consciously bounded
elsewhere. Do not pick capacity from folklore; derive it from concurrency,
payload size, latency, and failure policy, then measure it under load.

Use a synchronous mutex for short, non-awaiting critical sections. Use an
async-aware mutex when a guard genuinely must cross await, and minimize that
scope because it serializes tasks and can amplify latency. Avoid holding locks
while invoking untrusted callbacks, performing slow I/O, or awaiting unrelated
work. Establish a lock order when more than one lock can be acquired.

Atomics need a documented invariant and ordering rationale. Start with a
higher-level primitive when it states the protocol more clearly. If atomics are
necessary, test the state machine with a model checker where feasible rather
than relying on one successful stress run.

## Keep blocking work off the executor

Do not run CPU-heavy loops, blocking filesystem calls, synchronous network I/O,
or long lock waits on an executor worker without checking the runtime guidance.
Use a dedicated blocking mechanism or a CPU-parallel pool when appropriate,
bound submission, and propagate its result. Creating a blocking pool does not
make work free: it still needs backpressure, cancellation semantics, and
resource ownership.

Libraries should avoid assuming a particular runtime unless that is part of
their advertised contract. Consider exposing futures and traits that callers can
drive, or make runtime integration an optional feature. Check current runtime
documentation for API names and behavior rather than embedding a version pin.

## Verify

Test the behavior, not schedule luck:

1. A task result, panic, and cancellation reach the owning operation as designed.
2. Shutdown stops new work and joins or accounts for existing work.
3. A full queue, dropped peer, slow receiver, and timeout have defined behavior.
4. Shared-state invariants hold under interleavings, not only a single run.
5. Blocking work cannot starve latency-sensitive executor tasks.

Use deterministic time controls or explicit synchronization in async tests.
Use a concurrency model checker for small synchronization algorithms, and add
tracing around task lifecycle, queue depth, and cancellation when production
diagnosis will matter.
