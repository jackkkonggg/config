# React GSAP Rules (Dependency-Change Cleanup Bugs)

## Known issue

`useGSAP` from `@gsap/react` does **not** reliably call the returned cleanup function when `dependencies` change — only on component unmount. This means non-GSAP side effects (ticker callbacks, DOM listeners, observers, timers) accumulate across dependency-driven re-runs while old handlers remain active.

This does **not** affect GSAP objects (tweens, timelines, ScrollTriggers), which `useGSAP` reverts automatically via its internal context. It only affects side effects you manage manually in the cleanup return.

## When this matters

- Components with `dependencies` that include values that change during the component's lifetime (e.g. `pathname`, `reducedMotion`, `activeIndex`).
- Components that attach ticker callbacks, DOM listeners, or observers inside `useGSAP`.
- Components where stale handlers from a previous run would cause incorrect behavior (e.g. animating with outdated values or double-firing).

## Workaround patterns

### 1. `prevCleanupRef` — manual cleanup chaining

Call the previous run's cleanup at the **start** of each new effect run, since `useGSAP` won't call it for you on dependency changes:

```tsx
const prevCleanupRef = useRef<(() => void) | null>(null);

useGSAP(() => {
  // Manually run previous cleanup before setting up new side effects
  prevCleanupRef.current?.();

  const onTick = () => { /* current logic */ };
  gsap.ticker.add(onTick);

  const cleanup = () => {
    gsap.ticker.remove(onTick);
  };

  prevCleanupRef.current = cleanup;
  return cleanup; // still returned for unmount
}, { scope, dependencies: [pathname], revertOnUpdate: true });
```

### 2. `activeIdRef` — stale handler protection

Use an instance counter so handlers from previous runs bail out immediately:

```tsx
const activeIdRef = useRef(0);

useGSAP(() => {
  const id = ++activeIdRef.current;

  const onScroll = () => {
    if (activeIdRef.current !== id) return; // stale — bail
    /* current scroll logic */
  };

  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, { scope, dependencies: [pathname], revertOnUpdate: true });
```

### 3. `scrollSynced` flag — scroll-restoration guard

Prevent the first scroll event after a dependency change from triggering animations, which avoids scroll-restoration from replaying entrance effects:

```tsx
useGSAP(() => {
  let scrollSynced = false;

  const onScroll = () => {
    if (!scrollSynced) {
      scrollSynced = true;
      syncState(); // just read current position, don't animate
      return;
    }
    animateBasedOnScroll();
  };

  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, { scope, dependencies: [pathname], revertOnUpdate: true });
```

## Combining patterns

For complex components (e.g. footer reveals, carousels), combine all three:

```tsx
const prevCleanupRef = useRef<(() => void) | null>(null);
const activeIdRef = useRef(0);

useGSAP(() => {
  prevCleanupRef.current?.();
  const id = ++activeIdRef.current;
  let scrollSynced = false;

  const onTick = () => {
    if (activeIdRef.current !== id) return;
    /* frame logic */
  };

  const onScroll = () => {
    if (activeIdRef.current !== id) return;
    if (!scrollSynced) { scrollSynced = true; return; }
    /* scroll logic */
  };

  gsap.ticker.add(onTick);
  window.addEventListener("scroll", onScroll);

  const cleanup = () => {
    gsap.ticker.remove(onTick);
    window.removeEventListener("scroll", onScroll);
  };

  prevCleanupRef.current = cleanup;
  return cleanup;
}, { scope, dependencies: [pathname, reducedMotion], revertOnUpdate: true });
```

## When you don't need these workarounds

- Components with **no dependencies** (empty or omitted) — cleanup only fires on unmount, which works correctly.
- Components whose cleanup return only kills GSAP objects — `useGSAP` handles those automatically regardless.
- Components with dependencies but **no manual side effects** in the cleanup return.
