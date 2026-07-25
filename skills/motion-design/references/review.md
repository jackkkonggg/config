# Motion Review

Use this mode for a diff or bounded set of animation code.

Read the changed path and load only relevant sections of
`review-standards.md`. Check purpose and frequency, easing and duration,
physical origin, interruptibility, animated properties, reduced-motion and
pointer gating, and cohesion with the product.

Report:

1. A findings table with file and line, current behavior, recommended behavior,
   and why.
2. An explicit **Block** or **Approve** verdict.

Block feel-breaking or accessibility regressions. Do not invent findings to
fill categories, and do not review unrelated code.
