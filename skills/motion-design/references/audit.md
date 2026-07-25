# Motion Audit

Use this mode for a product-wide motion assessment, not a single diff.

1. Map the stack, motion libraries, shared easing and duration tokens, and
   interaction-frequency tiers.
2. Search the relevant UI for existing animation, gestures, reduced-motion
   handling, and abrupt state changes.
3. Load only the applicable sections of `audit-rules.md`.
4. Confirm every finding in source and, when possible, in the running artifact.
5. Report a prioritized table with severity, location, evidence, and a concise
   fix direction. Separate additive opportunities from corrective findings.
6. If plans are requested, use `plan-template.md` and make each plan
   self-contained.

Audit source read-only unless the user explicitly requests implementation.
Respect documented product decisions. A short, high-confidence list—or a clean
bill of health—is preferable to padded findings.
