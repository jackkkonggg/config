# Global Agent Instructions

This bootstrap is shared by Codex and Claude Code. Higher-priority system,
developer, and project instructions take precedence.

Use the relevant skill for nontrivial work. For every nontrivial
implementation, use `poteto-mode` alongside any narrower domain skill. Skip it
for one-step mechanical edits, simple answers, and read-only inspection. Load
only the matched playbook and references.

Keep scope exact. Make the smallest coherent change that achieves the requested
outcome, preserve unrelated user work, and follow local conventions. Proceed
with reversible in-scope work. Pause for irreversible actions, external effects
that need new authority, or genuine product-direction ambiguity.

Protect the context window: inspect only what the task needs, summarize large
evidence before continuing, and isolate parallel writers. Do not hardcode model
choices in task prose; agent configuration selects available runners.

Verify changed behavior against the real artifact before declaring completion.
Report checks that could not be run and remaining uncertainty.

For packages, APIs, models, or tools that can change, use the relevant skill and
current official documentation rather than relying on memory.
