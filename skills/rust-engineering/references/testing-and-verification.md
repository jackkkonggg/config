# Testing and Verification

## Contents

- Select a test layer from the risk
- Make tests deterministic
- Use generative techniques for invariants
- Validate features and public examples
- Report evidence honestly

## Select a test layer from the risk

Test observable behavior at the cheapest layer that can falsify the intended
claim. Unit tests are useful for focused invariants and edge cases; integration
tests prove public composition; doctests keep examples live; property tests and
fuzzing explore a space; concurrency tests examine synchronization claims;
benchmarks measure a specific performance question.

| Risk | Useful proof | Avoid |
| --- | --- | --- |
| Small deterministic rule | unit test | Reconstructing the whole application to test one branch. |
| Public caller workflow | integration test or example | Testing private implementation details only. |
| Parser or conversion invariant | property test plus fixtures | A few happy-path literals as the sole proof. |
| Crash-prone input boundary | fuzz target or adversarial cases | Treating a random smoke run as exhaustive. |
| Locking or atomic protocol | model checking and explicit interleavings | Sleep-based tests that pass by schedule luck. |
| User-facing rendering or format | focused snapshot with review | Snapshots that hide every semantic assertion. |
| Claimed speedup | benchmark and profile | Timing one debug run on an idle laptop. |

Do not mandate test-driven development, a mocking library, or a percentage
threshold. Select techniques from the behavior, repository conventions, and
cost of failure. A short regression test is valuable when it establishes the
bug contract even if implementation work begins first.

## Make tests deterministic

Control inputs, clocks, randomness, filesystem paths, network boundaries, and
concurrency coordination. Prefer explicit barriers, channels, test clocks, or
owned temporary directories to wall-clock sleeps. If a real timeout is
necessary, keep it as a failure guard rather than the mechanism that makes the
test correct.

Test errors by category, source, structured field, or caller-visible behavior.
Avoid asserting an entire incidental error string unless it is a stable
user-facing contract. Test panics only when panic behavior is intentional;
otherwise test the fallible path that callers should use.

Build test fixtures through public constructors where practical so they model
real usage. Use private helpers for complex internal state when the test needs
to isolate a local invariant. Keep fixtures minimal and name the behavior they
represent rather than the implementation mechanism.

Async tests need the same lifecycle discipline as production code. Await owned
tasks, close senders deliberately, drive time deterministically where the
runtime supports it, and assert shutdown behavior. Do not let failed spawned
tasks disappear because their handles were dropped.

## Use generative techniques for invariants

Property tests are especially useful when a relationship should hold across
many values: parsing then formatting preserves a value, a sort remains ordered
and preserves elements, serialization round-trips valid input, or a state
transition never escapes its allowed states. Constrain generators to meaningful
domains and save minimized counterexamples as regressions.

Fuzzing is useful for parsers, decoders, protocol handlers, unsafe boundaries,
and stateful input processing. Define no-panic, no-hang, bounded-resource, and
semantic properties where possible. Keep a corpus of real historical failures
and run it in CI or scheduled jobs according to project resources.

Concurrency model checking explores small interleavings systematically. Reduce
the protocol to a small testable state machine, bound exploration, and assert
the invariant. A model checker complements stress tests; it does not prove that
production resource limits or external services behave identically.

## Validate features and public examples

Doctests are executable API promises. Run them when changing public behavior,
imports, feature gates, or examples. For platform or feature-specific examples,
document required configuration and avoid compiling code in a configuration it
does not claim to support.

Run the project matrix intentionally. Default features, no-default-features,
all-features, targets, optional runtimes, and workspace members have different
meaning in different projects. Mark each result supported, unsupported, or not
run. A passing all-features build does not replace targeted tests when features
are mutually exclusive or require external services.

Coverage tools can highlight untested paths, but coverage counts are not a
quality target. Use them to ask whether a critical error, boundary, or state
transition lacks a proof, then add the narrowest useful test.

## Report evidence honestly

Before handoff, state:

1. The behavior or invariant each new test proves.
2. Which test layers ran and which did not.
3. Any external dependency, target, feature, or nondeterminism that limits the
   evidence.
4. The failure mode covered by a property, fuzz, concurrency, or benchmark tool.
5. What regression would still escape the current test set.

A test suite should make a future change easier to diagnose. Prefer focused test
names, explicit setup, and assertions that explain the contract when they fail.
