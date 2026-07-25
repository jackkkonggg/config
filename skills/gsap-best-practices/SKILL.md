---
name: gsap-best-practices
description: Use when writing, reviewing, or refactoring GSAP animation code in JavaScript/TypeScript (tweens, timelines, ScrollTrigger, matchMedia, plugin usage, and performance tuning) to enforce production-safe animation patterns.
---

# GSAP Best Practices

Apply these rules when working on GSAP-powered animation codebases.

## Current platform note

- As of March 6, 2026, official GSAP docs state that all plugins, including former Club GSAP bonus plugins, are freely available in the public package. Use the standard `gsap` package and do not recommend legacy private-registry or paid-only installation flows. Prefer GSAP `3.13+` when this matters.

## Rule routing

Do not read every rule file by default. Start with the smallest relevant set:

- Read `AGENTS.md` for broad GSAP reviews, unclear tasks, or when you need the compact checklist.
- Read `rules/gsap-core.md` for tweens, eases, staggers, transform aliases, `matchMedia`, defaults, or `immediateRender`.
- Read `rules/gsap-timelines.md` for sequencing, labels, position parameters, nested timelines, or playback control.
- Read `rules/gsap-scrolltrigger.md` for scroll animation, ScrollTrigger, pinning, scrub, snap, batch, scroller proxies, refresh, or horizontal scroll.
- Read `rules/gsap-plugins.md` for plugin registration or plugin APIs such as Flip, Draggable, Observer, SplitText, ScrambleText, DrawSVG, MorphSVG, MotionPath, ScrollTo, ScrollSmoother, or GSDevTools.
- Read `rules/gsap-utils.md` for `gsap.utils`, value mapping, `clamp`, `mapRange`, `normalize`, `random`, `snap`, `distribute`, `toArray`, `selector`, `pipe`, `wrap`, or units.
- Read `rules/gsap-performance.md` for jank, FPS, layout thrashing, many elements, `quickTo`, `quickSetter`, `will-change`, reduced motion, or animation cleanup/performance.

If React or Next.js is involved, also use `react-gsap-best-practices` when available for `useGSAP`, `contextSafe`, SSR, StrictMode, and dependency-driven lifecycle behavior.

## Enforcement policy

- Use recommendation-first language for style and performance guidance.
- Use strict language (`must` / `must not`) only for correctness, stability, and accessibility constraints.
- Prefer official GSAP docs when resolving conflicts; update these rules when docs change.
