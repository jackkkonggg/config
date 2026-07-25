# React GSAP Best Practices (Agent Rules)

This is the fast-path playbook. Use it to make decisions quickly, then consult section files for exact patterns and examples.

## Non-negotiables

- Use `useGSAP()` from `@gsap/react` for component-scoped animation lifecycle by default.
- Pass a `scope` ref so selector text remains local to the component.
- Do **not** manually `.kill()` GSAP objects (tweens, timelines, ScrollTriggers) in `useGSAP` cleanup — they are auto-reverted. Only clean up non-GSAP side effects (ticker callbacks, DOM listeners, observers, timers).
- Wrap delayed/event-driven GSAP work in `contextSafe()`.
- Keep effect setup/cleanup idempotent to survive React Strict Mode extra dev cycles.
- Keep GSAP code in client components only when using React server/client split frameworks.

## Core defaults

- Register `useGSAP` and animation plugins once, outside render paths.
- Store controllable timelines in refs instead of component state.
- Use dependency-driven re-runs with `revertOnUpdate: true` when animation inputs change.
- Co-locate ScrollTrigger creation with the component that owns the DOM.
- Respect reduced-motion and provide a non-animated fallback path.

## Dependency-change cleanup bug

- `useGSAP` does **not** reliably call the cleanup return when `dependencies` change — only on unmount.
- For components with dependencies that attach non-GSAP side effects, use `prevCleanupRef` to manually chain cleanup across re-runs.
- Use `activeIdRef` + instance counter to protect stale handlers from executing.
- Use a `scrollSynced` flag to prevent scroll-restoration from replaying animations after dependency changes.
- See `rules/react-gsap-dependency-bugs.md` for full patterns.

## Full references

- `rules/react-gsap-setup.md`
- `rules/react-gsap-lifecycle.md`
- `rules/react-gsap-dependency-bugs.md`
- `rules/react-gsap-scrolltrigger.md`
- `rules/react-gsap-ssr-strictmode.md`
