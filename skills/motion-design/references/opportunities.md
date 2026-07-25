# Finding Animation Opportunities

Search an interface for state changes that are currently abrupt and would
materially benefit from motion. This is read-only unless the user separately
asks for implementation.

## Gate every candidate

Keep a suggestion only when all four answers are satisfactory:

1. **Purpose:** it explains spatial change, preserves continuity, gives useful
   feedback, or prevents a jarring transition.
2. **Frequency:** it is subtle enough for how often the user sees it. Keyboard
   actions and interactions repeated hundreds of times a day usually should not
   animate.
3. **Performance:** it can use `transform` and `opacity` without layout churn.
4. **Accessibility:** movement has a gentler reduced-motion form, and hover
   behavior is gated to hover-capable pointers.

## Where to inspect

- Conditional UI that appears or disappears instantly.
- Expanding disclosure, accordion, tab, and navigation transitions.
- Reordering or filtering where spatial continuity would aid comprehension.
- Buttons and controls with no press feedback.
- Popovers, menus, and tooltips that do not originate from their trigger.
- Draggable or swipeable surfaces with hard stops or no velocity.
- Rare onboarding, empty, success, or completion moments where delight is
  appropriate.

Reject motion on command palettes, keyboard shortcuts, dense data users are
actively reading, and decorative effects that compete with the task.

## Workflow

Map the stack, existing motion tokens, product personality, and interaction
frequency first. Sweep each seam class above, then confirm each candidate in the
real component. Reuse the project’s easing, duration, and spring vocabulary.

Report two sections:

1. An opportunities table ordered by leverage, with `file:line`, current
   behavior, purpose, frequency, and an exact suggested motion.
2. Two to five rejected candidates with the gate that rejected each.

Close with a short verdict naming how much additional motion the interface
actually needs and the single highest-leverage opportunity. If nothing survives
the gate, say so plainly.
