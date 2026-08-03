# Performance and Observability

## Contents

- Measure before changing structure
- Locate the limiting resource
- Optimize representation and work deliberately
- Build useful observability
- Verify performance claims

## Measure before changing structure

A performance change starts with a user-visible symptom or capacity requirement:
latency, throughput, memory, startup time, CPU, tail behavior, binary size, or
cost. Capture a representative workload, baseline it, and identify the resource
that limits it before changing APIs, data structures, compiler settings, or
dependencies.

Use the tool appropriate to the question. Profiles and tracing identify where
time is spent; allocation profiles expose churn; benchmarks compare a stable
micro-operation; load tests show queueing, contention, and tail latency; binary
analysis identifies size contributors. A single elapsed-time measurement can be
a clue, but it does not establish a regression-safe result.

Write a hypothesis before optimizing: for example, repeated parsing dominates
request CPU, a shared lock serializes workers, or an intermediate allocation
appears once per record. Change one mechanism, remeasure the same workload, and
keep the simpler design if the evidence does not support the added complexity.

## Locate the limiting resource

| Symptom | Investigate | Possible response |
| --- | --- | --- |
| High request latency | traces, queue depth, lock waits, I/O spans | remove serial work, batch where semantics permit, add backpressure. |
| CPU saturation | profiler flame graph, algorithmic complexity, parse and copy work | reduce work, change algorithm, parallelize bounded independent CPU work. |
| Allocation churn | allocation profile, ownership and formatting paths | reuse buffers, borrow, reserve from evidence, remove intermediate materialization. |
| Memory growth | heap profile, cache ownership, queues, retained tasks | bound queues, expire caches, release handles, correct retention paths. |
| Contention | lock profile, task timeline, atomic hotspots | partition ownership, use a single owner, reduce critical-section scope. |
| Large binary or slow build | dependency graph, feature set, code generation | remove unused dependencies or features after checking target requirements. |

Algorithmic and I/O changes usually matter more than micro-hints. Prefer a
clear complexity improvement or fewer network, disk, lock, and allocation
operations over compiler attributes or a specialized container. A performance
claim should include the workload, metric, hardware or environment caveat, and
confidence in repeatability.

## Optimize representation and work deliberately

Use slices, iterators, and borrowing when they naturally avoid copies, but do
not make an API obscure to avoid a hypothetical allocation. Collect when the
operation needs sorting, grouping, replay, ownership, or a clear evaluation
boundary. Avoid repeated formatting or parsing in hot paths when a profiler
shows it dominates.

Preallocate only from a credible bound or measured growth pattern. Reuse a
buffer when its lifetime and retention do not create an unwanted memory floor.
Choose a data layout from measured access patterns: contiguous storage often
helps scans; an index can help repeated lookup; a separate cold field can reduce
hot working-set pressure. Keep a representation change local until evidence
shows that a public API must expose it.

Dynamic dispatch, boxing, inlining, link-time optimization, profile-guided
optimization, target-specific CPU flags, and SIMD have real tradeoffs in binary
size, portability, compile time, code sharing, and maintenance. Treat each as a
measured experiment. Do not enable host-native CPU features for a distributed
binary without a deployment compatibility decision.

Release profiles matter for production measurements, but the exact profile
settings belong to the repository and deployment environment. Avoid presenting
a universal compiler profile as a language rule.

## Build useful observability

Observability should answer operational questions without exposing sensitive
data. Use structured events, spans, metrics, and error chains at boundaries
where they add diagnostic value. Choose stable field names for identifiers,
operation names, result categories, queue depth, retry count, and durations;
avoid putting secrets, credentials, complete untrusted payloads, or excessive
cardinality into logs and metrics.

Create spans around meaningful operations, not every helper. Propagate request
or job context through async work so traces show ownership and causal sequence.
Record errors once at the boundary that reports them, while retaining the cause
chain for diagnosis. Library crates should usually emit through a facade or
structured interface and leave subscriber configuration to applications.

Metrics need an owner and action. A counter, histogram, or gauge should map to a
question such as whether retries rise, a queue approaches capacity, a worker
stalls, or a latency objective regresses. Keep labels bounded and document the
units. Sampling and log levels are capacity controls; tune them with production
cost and incident needs in mind.

## Verify performance claims

For each performance or observability change:

1. Capture a baseline and post-change measurement on the same representative
   workload.
2. Show that the changed region, rather than noise, explains the result.
3. Check behavior, error handling, and cancellation semantics remained intact.
4. Test memory, queue, and concurrency behavior under sustained load where
   relevant.
5. Verify logs, traces, and metrics contain useful context without sensitive or
   unbounded-cardinality fields.

Keep benchmark code and fixture data close enough to the claim that future
maintainers can rerun it. If hardware, input distribution, or deployment
configuration limits the conclusion, say so in the change description.
