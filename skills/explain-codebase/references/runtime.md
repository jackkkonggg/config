# Runtime and Architecture Explanation

Scope the question, then trace the real path through the repository.

1. Locate entry points and key symbols with `rg`.
2. Follow callers, callees, types, state changes, and external boundaries.
3. Read the code; do not infer behavior from filenames.
4. Stop when the path from trigger to effect is complete enough to explain
   without hand-waving.

For a narrow question, investigate directly. For a broad subsystem, split the
reading into distinct slices only when parallel work will save material time.

Present the smallest useful structure: overview, key concepts, step-by-step
flow, where things live, and non-obvious gotchas. Cite files and symbols.
Mention uncertainty where runtime behavior depends on configuration or an
unobserved external system.
