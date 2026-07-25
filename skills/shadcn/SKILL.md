---
name: shadcn
description: Use for shadcn components, registries, presets, chat interfaces, styling, installation, updates, and debugging.
---

# shadcn/ui

Use the package runner declared by the project. Start with
`shadcn@latest info --json` to resolve its base, framework, aliases, installed
components, icon library, Tailwind version, and package manager.

Load only the matching guidance:

| Work | Load |
| --- | --- |
| Add, compose, style, or fix components | `rules/composition.md`, `rules/styling.md`, and the relevant rule file |
| Forms or inputs | `rules/forms.md` |
| Icons | `rules/icons.md` |
| Chat or messaging | `rules/chat.md` |
| Registry discovery or authoring | `registry.md` |
| CLI, presets, initialization, or updates | `cli.md` |
| MCP setup or use | `mcp.md` |

Prefer an existing component or registry item over custom markup. Run
`shadcn@latest docs <component>` before relying on an API from memory. Inspect
files added by the CLI and correct aliases, icons, composition, and
accessibility against the resolved project context.

Preview updates with `--dry-run` and `--diff`. Never overwrite local component
changes or apply a preset destructively without explicit approval. After a
change, run the affected project checks and exercise the rendered component or
workflow.
