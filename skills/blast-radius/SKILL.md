---
name: blast-radius
description: Use to trace what a proposed or existing change could break beyond its diff and prove key safety facts.
---

# Blast Radius

Perform a read-only risk investigation. Do not modify tracked files unless the
user separately authorized implementation.

1. Read the change and identify the behavior it alters.
2. Use `explain-codebase` How mode for runtime flow and Why mode for historical
   constraints.
3. Trace beyond direct callers: lifecycle timing, wire formats, persisted data,
   generated artifacts, feature flags, local patches, and consumers in other
   modules or languages.
4. Enumerate every ingress and egress before reducing the assessment. Do not
   call one boundary unique until sibling sources such as URLs, storage,
   persisted legacy data, and network input have been checked.
5. Reduce the assessment to the one or two facts on which safety depends.
6. Prove each fact as cheaply as possible with existing tests, read-only
   commands, or temporary artifacts outside tracked state. If proof would
   require a repository change, mark it unproven and propose the check.

Load [references/method.md](references/method.md) when the change is wide or the
proof level is unclear.

Hand back what changed, the key safety facts and proof level, confirmed risks,
cleared risks, and the cheapest pre-merge verification. Cite real evidence and
label uncertainty; do not invent callers or round an inconclusive result up to
safe.
