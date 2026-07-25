---
name: visual-design
description: Use for web color, typography, surface polish, shadows, borders, and interaction details.
---

# Visual Design

Inspect the existing design and styling system. Preserve its tokens and
implementation approach. Load only matching routes.

| Concern | Load |
| --- | --- |
| Convert colors or work in OKLCH | `references/color-conversion.md` |
| Build a palette or dark theme | `references/palette-generation.md` |
| Check color contrast | `references/accessibility-contrast.md` |
| Handle gamut or Tailwind color tokens | `references/gamut-and-tailwind.md` |
| Choose or pair fonts | `references/typography-choosing-fonts.md` |
| Configure variable fonts or OpenType | `references/typography-variable-fonts.md` |
| Tune scale, hierarchy, spacing, or line height | `references/typography-spacing.md` |
| Tune heading measure or wrapping | `references/typography-spacing.md`, `references/typography-wrapping.md` |
| Fix wrapping, truncation, or punctuation | `references/typography-wrapping.md` |
| Review text details or accessibility | `references/typography-accessibility.md` |
| Look up CSS or Tailwind typography syntax | `references/typography-css.md` |
| Polish radii, shadows, alignment, or hit areas | `references/polish-surfaces.md` |
| Polish hover, press, enter, or exit behavior | `references/polish-interactions.md` |
| Diagnose visual interaction performance | `references/polish-performance.md` |

For broad UI work, inspect first and load only evidenced concerns. Keep changes
scoped and verify the rendered result. Prefer logical sizing properties.
