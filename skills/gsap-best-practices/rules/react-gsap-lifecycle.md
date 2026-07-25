# React GSAP Rules (Lifecycle and Dependencies)

## Canonical docs

- https://github.com/greensock/react
- https://react.dev/reference/react/useEffect
- https://react.dev/reference/react/useLayoutEffect

## Lifecycle policy

- Treat `useGSAP` as the default lifecycle boundary for GSAP in React components.
- Keep setup and cleanup symmetrical so re-mount/re-sync leaves no stale animations.
- Store timelines in refs when external controls need stable access.

## Cleanup scope

`useGSAP` automatically reverts all GSAP objects (tweens, timelines, ScrollTriggers) created inside its callback on unmount. The return function is only for non-GSAP side effects.

**Must not** manually `.kill()` GSAP objects inside `useGSAP` cleanup — they are already handled:

```tsx
// INCORRECT — redundant .kill() calls
useGSAP(() => {
  const tl = gsap.timeline();
  const trigger = ScrollTrigger.create({ ... });
  return () => {
    tl.kill();       // redundant — useGSAP already reverts this
    trigger.kill();  // redundant — useGSAP already reverts this
  };
}, { scope });

// CORRECT — only clean up non-GSAP side effects
useGSAP(() => {
  gsap.timeline().to(".box", { x: 100 });
  ScrollTrigger.create({ trigger: ".section", ... });

  const onTick = () => { /* frame logic */ };
  gsap.ticker.add(onTick);

  const ro = new ResizeObserver(handleResize);
  ro.observe(containerRef.current!);

  window.addEventListener("scroll", onScroll);

  return () => {
    gsap.ticker.remove(onTick);  // not a GSAP object — manual cleanup required
    ro.disconnect();              // not a GSAP object — manual cleanup required
    window.removeEventListener("scroll", onScroll); // manual cleanup required
  };
}, { scope });
```

Side effects that **do** require manual cleanup in the return function:
- `gsap.ticker.add()` / `gsap.ticker.remove()` — ticker callbacks
- `gsap.delayedCall()` — timers (call `.kill()` on the returned object)
- Native DOM event listeners (`addEventListener` / `removeEventListener`)
- `ResizeObserver`, `IntersectionObserver`, `MutationObserver`
- `requestAnimationFrame` IDs (`cancelAnimationFrame`)
- `setTimeout` / `setInterval` IDs

## Dependency-driven re-runs

- Use `dependencies` when animation inputs derive from props/state.
- Use `revertOnUpdate: true` when changed dependencies require a full animation rebuild.
- Avoid omitting dependencies that alter targets, trigger configuration, or animation values.

## Manual effects fallback

- If `useGSAP` cannot be used, use an isomorphic layout effect pattern and always return cleanup.
- Do not instantiate GSAP in render or memo initializers with DOM assumptions.

## Minimal example

```tsx
useGSAP(() => {
  gsap.to(".chip", { x: endX, duration: 0.4 });
}, {
  scope,
  dependencies: [endX],
  revertOnUpdate: true,
});
```
