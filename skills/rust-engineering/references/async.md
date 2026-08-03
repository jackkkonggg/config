# Async and concurrency

- Use non-blocking I/O in async tasks. Move unavoidable blocking or CPU-heavy
  work to `spawn_blocking` or a bounded worker pool, and account for its
  shutdown behavior.
- Structure related work with joins or a `JoinSet`; retain task handles and
  observe each task's result. Do not use detached, unbounded spawning as a
  concurrency strategy.
- Keep lock guards out of `.await` regions. Reduce the critical section,
  transfer an owned value, or redesign message flow before adding a broader
  lock.
- Prefer bounded channels when producers can outpace consumers. Choose the
  channel for its semantics: queue, latest value, one response, or broadcast;
  document the overload behavior.
- Make cancellation and timeouts explicit at operation boundaries. Use
  `tokio_util::sync::CancellationToken` only after adding the `tokio-util`
  dependency; cancellation safety remains a property of the awaited operation.
- Let binaries own runtime setup. Libraries should normally expose futures or
  async functions rather than create a hidden Tokio runtime.

For async tests, synchronize on events, channels, or controlled time rather
than wall-clock sleeps. `tokio::time::pause` requires Tokio's `test-util`
feature.
