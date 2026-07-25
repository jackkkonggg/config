# Performance Strategy Families

Use these as hypothesis generators, not a checklist. A strategy earns an
attempt only when the trace shows its signal.

| Strategy | Trace signal |
| --- | --- |
| Elimination | Work runs but its result is unused or legacy. |
| Divide and conquer | Cost grows with input size and work can be partitioned. |
| Caching | The same expensive operation repeats on identical inputs. |
| Indirection | A cheaper index, queue, or handle can remove work from the critical path. |
| Batching | Many small operations repeatedly pay the same fixed overhead. |
| Redundancy | Tail latency is dominated by one slow attempt and spare capacity exists. |
| Lazy evaluation | Work runs for results that are never requested. |
| Scheduling | Necessary work blocks an interactive moment but can run earlier, later, or in the background. |

Name invalidation for caching and capacity cost for redundancy. Add an
indirection only when it removes more critical-path work than it adds.
