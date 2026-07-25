# React GSAP Rules (ScrollTrigger)

## Canonical docs

- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
- https://gsap.com/resources/react-advanced/

## Component integration

- Register `ScrollTrigger` before using it in component hooks.
- Create triggers inside `useGSAP` so they are recorded in context and cleaned up automatically.
- Scope selector text to the component container to avoid cross-component collisions.

## Dynamic layout handling

- Refresh triggers when component layout changes materially after mount.
- Recreate triggers when dependency changes alter start/end geometry.
- Keep pinning logic isolated for sections that own their own layout context.

## Responsive scroll behavior

- Use `gsap.matchMedia()` for breakpoint-specific trigger config.
- Provide simpler scroll effects on mobile where pinned timelines may feel heavy.
- Avoid duplicating triggers across re-renders by centralizing setup in one lifecycle boundary.

## Minimal example

```tsx
useGSAP(() => {
  gsap.to(".panel", {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
      trigger: ".panel",
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
    },
  });
}, { scope });
```
