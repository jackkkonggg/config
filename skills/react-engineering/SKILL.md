---
name: react-engineering
description: Use for React component composition, reusable APIs, rendering, bundles, data flow, and performance.
license: MIT
---

# React Engineering

Route by the problem in the code, not merely by the presence of React.

- For boolean-prop proliferation, compound components, reusable component APIs,
  provider boundaries, lifted state, render props, or React 19 composition,
  load only matching `references/composition-*.md` files.
- For waterfalls, bundles, server or client data flow, re-renders, rendering
  cost, hydration, or JavaScript hot paths, load only matching
  `references/performance-*.md` files.
- Load both families only when the task genuinely crosses API design and
  performance.

Find the smallest rule set with:

```bash
rg -n "<term>" references/composition-*.md references/performance-*.md
```

Read the matching files before changing code. Use critical and high-impact rules
first; do not apply low-impact micro-optimizations without evidence that the
path matters. Preserve behavior unless the request changes it, match the
project’s React version, and verify with the narrowest relevant checks.

For composition refactors, keep state implementation inside the provider and
prefer static child composition over render-prop or callback-shaped APIs. Load
`references/composition-state-decouple-implementation.md` and
`references/composition-patterns-children-over-render-props.md` when either
choice is in play.

Behavior preservation outranks a performance rule. Preserve callback timing and
repeat-selection semantics; do not move an effect into an event handler when
that changes which user actions emit the callback.
