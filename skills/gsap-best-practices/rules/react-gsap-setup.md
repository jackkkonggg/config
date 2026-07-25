# React GSAP Rules (Setup)

## Canonical docs

- https://github.com/greensock/react
- https://gsap.com/resources/react-basics/
- https://react.dev/reference/react/useRef

## Installation

```bash
npm install gsap @gsap/react
```

## Baseline setup

- Import `useGSAP` from `@gsap/react` and register it as a GSAP plugin once at the top level.
- Use a container ref and pass it as `scope` to `useGSAP` for selector safety.
- Prefer refs for animated elements rather than global selector strings.
- Keep animation creation inside `useGSAP` callback, not during render.
- Prefer the config-object form of `useGSAP` (`{ scope, dependencies, revertOnUpdate }`) for consistent lifecycle control.

## Context-safe callbacks

GSAP objects created inside functions that run **after** `useGSAP` executes (event handlers, timers, async callbacks) are not tracked by the context and won't be reverted on unmount. Use `contextSafe()` to wrap them.

```tsx
useGSAP((context, contextSafe) => {
  // CORRECT — wrapped in contextSafe, will be reverted
  const onClick = contextSafe(() => {
    gsap.to(boxRef.current, { rotation: 180 });
  });
  boxRef.current.addEventListener("click", onClick);

  return () => {
    boxRef.current.removeEventListener("click", onClick);
  };
}, { scope: container });
```

- Remove manually attached event listeners in the cleanup return.
- Avoid creating unmanaged tweens in callbacks outside GSAP context.
- Use either `const { contextSafe } = useGSAP({ scope })` or the callback second argument pattern.

## gsap.context() in useEffect (fallback)

When `@gsap/react` is not available, use `gsap.context()` inside `useEffect` and **always** call `ctx.revert()` in cleanup:

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(".box", { x: 100 });
  }, containerRef);
  return () => ctx.revert();
}, []);
```

## Minimal example

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    gsap.from(".headline", { y: 24, autoAlpha: 0, duration: 0.5 });
  }, { scope });

  return <section ref={scope}><h1 className="headline">Hello</h1></section>;
}
```
