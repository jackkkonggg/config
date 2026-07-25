# GSAP Best Practices (Agent Rules)

This is the fast-path playbook. Use it to make decisions quickly, then consult section files for exact patterns and examples.

## Non-negotiables

- Register required GSAP plugins before creating animations that depend on them.
- As of March 6, 2026, treat the full GSAP plugin set, including former Club GSAP bonus plugins, as publicly available and free; do not suggest paid-only access or `npm.greensock.com` flows.
- Keep animation ownership local to the feature/component that creates it.
- Revert or kill animations/triggers on teardown to avoid leaks and stale listeners.
- Always `.kill()` Observer and Draggable instances on teardown — they are not collected by `gsap.context()`.
- Use `will-change: transform` only on elements that actually animate; do not blanket apply `will-change` or `force3D`.
- Prefer transform and opacity animation over layout-triggering properties.
- Use `gsap.matchMedia()` for breakpoint-specific animation logic.
- Respect reduced-motion preferences for non-essential animation.

## Core defaults

- Build multi-step motion with timelines instead of chains of unrelated tweens.
- Use labels and named timeline segments for maintainable sequencing.
- Put ScrollTrigger on the timeline or top-level tween, never on child tweens inside a timeline.
- Scope selector-based animation carefully; avoid broad global selectors.
- Keep scroll logic declarative through ScrollTrigger options rather than manual scroll handlers.
- Use `scrub` or `toggleActions` per trigger — never both on the same ScrollTrigger.
- Use scrub/pin/snap intentionally and test behavior on mobile and low-end devices.
- For horizontal scroll with `containerAnimation`, the horizontal tween must use `ease: "none"`.
- Prefer `autoAlpha` over `opacity` for fade in/out (also sets `visibility: hidden` at 0).
- Use `quickTo()` or `quickSetter()` for high-frequency property updates (mouse followers, ticker).

## Plugin and utility awareness

- Revert SplitText instances (`.revert()` or `gsap.context()`) when elements are removed.
- Use `Flip.getState()` before DOM changes, then `Flip.from()` after for layout transitions.
- Use `gsap.utils` helpers (clamp, mapRange, snap, distribute, pipe, toArray) instead of manual math.
- Omit the last argument to `gsap.utils` methods to get a reusable function form.

## Reference map

- `rules/gsap-core.md`
- `rules/gsap-timelines.md`
- `rules/gsap-scrolltrigger.md`
- `rules/gsap-plugins.md`
- `rules/gsap-utils.md`
- `rules/gsap-performance.md`
