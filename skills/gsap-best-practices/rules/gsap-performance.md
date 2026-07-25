# GSAP Rules (Performance and Accessibility)

## Canonical docs

- https://gsap.com/docs/v3/GSAP/
- https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
- https://gsap.com/docs/v3/GSAP/gsap.quickTo()
- https://gsap.com/docs/v3/GSAP/gsap.quickSetter()
- https://gsap.com/docs/v3/GSAP/gsap.killTweensOf()
- https://gsap.com/resources/react-basics/

## Prefer transforms and opacity

- Animating `x`, `y`, `scale`, `rotation`, and `opacity`/`autoAlpha` stays on the compositor and avoids layout/paint.
- Avoid animating `width`, `height`, `top`, `left`, `margin`, `padding` when transforms can achieve the same effect.
- GSAP's `x` and `y` use transforms (translate) by default — use them instead of `left`/`top` for movement.

## will-change

- Use `will-change: transform` in CSS on elements that will animate. It hints the browser to promote the layer.
- Apply it only to elements that actually animate; do not set `will-change` or `force3D` on every element "just in case".

## Batch reads and writes

- GSAP batches updates internally. When mixing GSAP with direct DOM reads/writes, do all reads first, then all writes to avoid layout thrashing.
- Avoid interleaving DOM reads and writes in high-frequency callbacks (`onUpdate`, ticker, pointermove).

## Many elements (stagger and virtualization)

- Use `stagger` instead of many separate tweens with manual delays — it's more efficient and readable.
- For long lists, consider virtualizing or animating only visible items; avoid hundreds of simultaneous tweens.
- Reuse timelines where possible; avoid creating new timelines every frame.

## Frequently updated properties (quickTo / quickSetter)

For properties updated on every pointer event or tick, use `quickTo()` or `quickSetter()` to reuse a single tween instead of creating new ones each event:

```ts
const xTo = gsap.quickTo("#follower", "x", { duration: 0.4, ease: "power3" });
const yTo = gsap.quickTo("#follower", "y", { duration: 0.4, ease: "power3" });

container.addEventListener("mousemove", (e) => {
  xTo(e.pageX);
  yTo(e.pageY);
});
```

- `quickTo()` returns a function that updates the tween's end value — smooth interpolation with no allocation.
- `quickSetter()` sets a value instantly with no tweening — use for raw per-frame updates.
- Kill superseded tweens (`killTweensOf`) in interactive flows where rapidly repeated input can stack motion.

## Observer and Draggable

- Register `Observer` and `Draggable` plugins before use, like any other GSAP plugin.
- Always call `.kill()` on `Observer` and `Draggable` instances during teardown; they are not collected by `gsap.context()` or `useGSAP` automatically.
- Define explicit constraints for `Draggable` (`bounds`, `type`) to prevent unexpected drag behavior.
- Use `Observer` for unified wheel/touch/pointer input instead of separate native event listeners when GSAP timing integration is needed.
- Remove any custom event listeners attached alongside Observer/Draggable in the same cleanup path.

## ScrollTrigger performance

- `pin: true` promotes the pinned element — pin only what's needed.
- `scrub` with a small value (e.g. `scrub: 1`) can smooth work during scroll; test on low-end devices.
- Call `ScrollTrigger.refresh()` only when layout actually changes, not on every resize (auto-handled, debounced 200ms).
- Pause or kill off-screen or inactive animations to reduce simultaneous work.

## Rendering stability

- Avoid layout thrashing: do not interleave reads and writes in high-frequency callbacks.
- Avoid large, continuously scrubbing timelines for off-screen content.
- Use GPU-friendly transforms for high-frequency interactions.

## Accessibility

- Respect `prefers-reduced-motion` and provide a reduced/instant experience for non-essential motion.
- Keep essential state changes perceivable without relying only on motion.
- Avoid motion patterns that can cause disorientation (rapid large-axis movement, constant parallax).

## Minimal example

```ts
const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.set(".hero", { clearProps: "all" });
});

mm.add("(prefers-reduced-motion: no-preference)", () => {
  gsap.from(".hero", { y: 24, autoAlpha: 0, duration: 0.5, ease: "power2.out" });
});
```
