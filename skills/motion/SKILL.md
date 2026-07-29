---
name: motion
description: Use for Motion or CSS animation implementation, framework guidance, docs, examples, springs, performance audits, and transition previews.
---

# Motion

Load only the route matching the request:

- Motion and CSS implementation for vanilla JS, React, Vue, Base UI, or Radix:
  [best-practices/index.md](best-practices/index.md).
- Motion APIs, documentation, examples, and Motion UI patterns:
  [codex/index.md](codex/index.md).
- CSS spring generation:
  [css-spring/index.md](css-spring/index.md).
- Static or runtime MotionScore performance audits:
  [performance-audit/index.md](performance-audit/index.md).
- Spring and easing visualization:
  [transition-preview/index.md](transition-preview/index.md).

Do not load multiple routes unless the task crosses them. Match the project’s
framework and Motion version, preserve behavior unless the request changes it,
and verify the real animation or audit artifact.

Some routes use Motion AI Kit tools. If a required tool is unavailable, explain
that the capability requires the kit from
`https://motion.dev/docs/ai-kit`, then continue with local guidance when
possible. Do not install it without permission.
