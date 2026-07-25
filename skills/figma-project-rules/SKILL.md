---
name: figma-project-rules
description: Use to generate project-specific Figma-to-code design-system rules from a codebase.
---

# Figma Project Rules

Use this workflow when the user wants durable project conventions for future
Figma-to-code work.

1. Confirm the official Figma integration is available.
2. Load `references/workflow.md`.
3. Inspect the codebase’s component organization, styling system, tokens,
   naming, assets, architecture, accessibility, and verification conventions.
4. Generate rules for the active agent surface without overwriting unrelated
   existing instructions.
5. Show what changed and verify the rule file is valid and project-specific.

Treat generated tool output as a starting template. Replace placeholders with
evidence from the repository, keep instructions focused on recurring Figma
translation decisions, and avoid copying generic framework advice already
owned elsewhere.
