# Rationale and Historical Intent

Anchor the target in code, then search for evidence of intent.

1. Identify files, symbols, and relevant lines.
2. Inspect blame and file history; trace substantive commits to PR discussion.
3. Search decisions, tickets, docs, or operational evidence when available and
   relevant. Use `source-playbook.md` and one matching `source-*.md` reference
   only when a connected source is used.
4. Treat null results and contradictory records as evidence. Do not turn code
   mechanics into proof of motivation.

Present direct evidence with citations, then clearly separated inference,
competing hypotheses, unknowns, and sources consulted. Follow
`epistemics.md` for confidence language. If the rationale will guide a change,
end with Preserve / Change / Avoid / Risk constraints.

Do not attribute a property or weakness to a rejected alternative unless a
source states it. Label it as inference otherwise. Before reporting a negative
search result or count, verify the exact query and result.

A stated positive purpose for the chosen design does not prove that an
alternative cannot serve that purpose. Keep those as separate claims.
