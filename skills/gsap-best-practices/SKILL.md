---
name: gsap-best-practices
description: Use for GSAP or React GSAP setup, lifecycle, tweens, timelines, ScrollTrigger, plugins, and performance.
---

# GSAP Best Practices

## Rule routing

Load the smallest relevant set:

- Read `AGENTS.md` for broad GSAP reviews, unclear tasks, or when you need the compact checklist.
- Read `rules/gsap-core.md` for tweens, eases, staggers, transform aliases, `matchMedia`, defaults, or `immediateRender`.
- Read `rules/gsap-timelines.md` for sequencing, labels, position parameters, nested timelines, or playback control.
- Read `rules/gsap-scrolltrigger.md` for scroll animation, ScrollTrigger, pinning, scrub, snap, batch, scroller proxies, refresh, or horizontal scroll.
- Read `rules/gsap-plugins.md` for plugin registration or plugin APIs such as Flip, Draggable, Observer, SplitText, ScrambleText, DrawSVG, MorphSVG, MotionPath, ScrollTo, ScrollSmoother, or GSDevTools.
- Read `rules/gsap-utils.md` for `gsap.utils`, value mapping, `clamp`, `mapRange`, `normalize`, `random`, `snap`, `distribute`, `toArray`, `selector`, `pipe`, `wrap`, or units.
- Read `rules/gsap-performance.md` for jank, FPS, layout thrashing, many elements, `quickTo`, `quickSetter`, `will-change`, reduced motion, or animation cleanup/performance.

For React or Next.js, load the smallest matching React rules:

- `rules/react-gsap-setup.md` for package setup and `useGSAP`.
- `rules/react-gsap-lifecycle.md` for cleanup and `contextSafe`.
- `rules/react-gsap-dependency-bugs.md` for dependency-driven updates.
- `rules/react-gsap-scrolltrigger.md` for React ScrollTrigger integration.
- `rules/react-gsap-ssr-strictmode.md` for SSR and Strict Mode.

Read `REACT.md` only for a broad React GSAP review.

Use strict language only for correctness, stability, and accessibility. Prefer
official GSAP docs when resolving conflicts.
