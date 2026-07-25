---
name: motion-design
description: Use to name, discover, audit, plan, or review interface motion and animation.
---

# Motion Design

Choose one mode from the request. Load only that mode’s reference.

| Mode | Load | Result |
| --- | --- | --- |
| Name or identify an effect | `references/vocabulary.md` | Exact motion term and likely implementation family |
| Apply Apple-like physical design | `references/apple.md` | Principles adapted to the current interface |
| Find missing motion | `references/opportunities.md` | Read-only, gated opportunity list |
| Audit a product’s motion system | `references/audit.md`, then only needed sections of `references/audit-rules.md` | Prioritized findings; optional plans |
| Review an animation diff | `references/review.md`, then only needed sections of `references/review-standards.md` | Findings and an explicit verdict |

Do not turn a naming question into an audit, or a review into an implementation.
For audits and reviews, inspect the real interaction frequency, existing
duration/easing tokens, reduced-motion behavior, and runtime artifact when
available. Prefer a short list of evidenced, high-leverage findings.

When writing an implementation plan, use
`references/plan-template.md`. When implementation is explicitly requested,
apply the smallest scoped change and verify the motion in the real artifact.
