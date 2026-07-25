# React GSAP Rules (SSR, Strict Mode, Accessibility)

## Canonical docs

- https://github.com/greensock/react
- https://react.dev/reference/react/StrictMode
- https://react.dev/reference/react/useEffect

## SSR and client boundaries

- Run DOM-driven GSAP code only in client-rendered components.
- Prefer `useGSAP` for isomorphic-safe behavior in mixed SSR/CSR environments.
- In React server/client split frameworks, keep GSAP modules behind client boundaries.

## Strict Mode resilience

- Expect an extra setup+cleanup cycle in development Strict Mode.
- Ensure cleanup fully reverts timelines, tweens, and triggers to prevent duplicate effects.
- Keep side effects out of render and make animation setup idempotent.

## Accessibility and UX

- Respect reduced-motion preferences and bypass non-essential motion.
- Keep state communication clear without requiring animation perception.
- Avoid blocking input during long intro animations.

## Minimal example

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".hero", { y: 20, autoAlpha: 0, duration: 0.5 });
  });
  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".hero", { clearProps: "all" });
  });

  return () => mm.revert();
}, { scope });
```
