# Skill prompt audit — 2026-07-25

## Outcome

The repository now owns 50 skills. The Poteto prompt is the only P0 finding: `codex/AGENTS.md` (623 words) and `skills/poteto-mode/SKILL.md` (2,192 words) load 2,815 words before a playbook or principle reference. The current entrypoint directly exposes another 9,411 words through 37 links and requires selected leaves to be loaded, copied into a todo list, and attributed in the final reply.

The isolated replacement reduced the static bootstrap plus entrypoint from 2,815 to 495 words in the fixture (82.4%). This is a word-count proxy for prompt surface, not a measurement of loaded model tokens. Its four-output blinded point total was 77 to 65, but each output had one cross-family reviewer and no variance estimate, so the result is descriptive only. The replacement is **not accepted for promotion**: the three completed pairs showed only a directional 12.6% median total-token reduction, one baseline arm did not complete, and the destructive/external-action task completed without a post-state check, which the blind Claude reviewer marked verification-critical. No Poteto or pre-existing skill prompt was changed.

This audit applies the current [OpenAI lean-prompt guidance](https://developers.openai.com/api/docs/guides/latest-model) and [Anthropic context-engineering guidance](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models). Both favor a small durable core, one statement of autonomy and tool policy, progressive disclosure, and interfaces or judgment over repeated examples and blanket rules. OpenAI describes the lean-prompt gains as directional rather than universal; Anthropic reports removing more than 80% of its system prompt without losing coding-evaluation performance.

## Method

- Sizes are Markdown word counts. `E/D/R` means entrypoint, frontmatter description, and all other Markdown references inside the skill.
- “Normal load” is the content a typical activation is instructed to read, not every file present. “Selected ref” means progressive disclosure is working. “Linked stack” means the entrypoint requires another skill or a broad set of references.
- Savings estimate the instruction words removed or avoided per activation. They are not claimed as exact tokenizer counts.
- Ownership is `local`, `vendor`, or `vendor+patch`. Vendor findings should be fixed upstream or maintained as generated patches; local findings can be edited directly.
- P0 means automatically loaded or cascading context. P1 means an oversized entrypoint or description. P2 means repetition, examples, or style rules without measured justification.
- The initial sync briefly captured `find-skills` and `transitions-dev`. Both were subsequently uninstalled at the user's request, so their rows and single-purpose vendor sources are excluded from the final inventory.

## Inventory

| Skill | E / D / R words | Normal transitive load | Priority / expected saving | Finding and exact recommendation | Ownership |
|---|---:|---|---|---|---|
| agent-browser | 406 / 134 / 0 | Entry | P1 / ~100 | Cut the description to trigger conditions only; move capability enumeration to the body. | vendor |
| animation-vocabulary | 2,159 / 73 / 0 | Entry | P1 / ~1,400 | Move the term catalog and examples to a lookup reference; keep decision rules and output shape in the entrypoint. | vendor |
| apple-design | 3,426 / 49 / 0 | Entry | P1 / ~2,300 | Split motion, gesture, layout, and review guidance into routed references; replace universal rules with judgment criteria. | vendor |
| architect | 824 / 37 / 844 | Entry + runner/template stack | P1 / ~900 | Keep the type/signature/module sketch contract; move runner mechanics and model selection to agent configuration, and load the rationale template only when writing it. | vendor+patch |
| arena | 808 / 44 / 0 | Entry + candidate orchestration | P1 / ~500 | Keep fan-out, selection, and grafting; move model roster and runner defaults to configuration and remove repeated orchestration prose. | vendor+patch |
| better-colors | 804 / 42 / 1,666 | Entry + selected ref | P2 / ~150 | Progressive disclosure is sound; shorten the entry examples and preserve the four routed technical references. | vendor |
| better-typography | 2,047 / 93 / 3,558 | Entry + six refs | P1 / ~1,200 | Shorten the trigger description and turn the entrypoint into a router by problem type; load one typography reference at a time. | vendor |
| better-ui | 1,080 / 52 / 2,964 | Entry + three refs | P1 / ~450 | Collapse repeated polish rules into a compact review rubric; route animation, interaction, and visual details separately. | vendor |
| blast-radius | 760 / 50 / 0 | Entry | P2 / ~250 | Keep caller search and runtime proof; delete repeated cautions and the fixed reporting ceremony. | vendor+patch |
| commit | 201 / 17 / 0 | Entry | P2 / negligible | Already lean. Keep the scope check and commit-message contract; no split needed. | local |
| convex-best-practices | 120 / 25 / 2,409 | Entry + selected ref | P2 / negligible | Strong router. Ensure only the reference matching the edited Convex surface is loaded. | local |
| diagnose | 1,172 / 41 / 0 | Entry | P1 / ~600 | Move instrumentation recipes and long phase checklists to references; retain reproduce, minimize, hypothesize, prove. | vendor |
| figma-code-connect | 3,420 / 35 / 3,958 | Entry + two refs | P1 / ~2,200 | Keep the mapping contract and required tool sequence; relocate language examples and templates to on-demand references. | vendor |
| figma-create-design-system-rules | 2,550 / 44 / 0 | Entry | P1 / ~1,700 | Extract examples and generated-file templates; keep discovery, rule synthesis, and validation in the entrypoint. | vendor |
| figma-create-new-file | 422 / 47 / 0 | Entry | P2 / ~80 | The mandatory prerequisite is justified; remove repeated “never call directly” wording after the trigger states it once. | vendor |
| figma-generate-design | 3,326 / 127 / 0 | Entry + eight cross-skill refs | P1 / ~2,500 | Reduce the description to triggers; route by page, component, or flow and stop embedding broad generation/tool examples in the entry. | vendor |
| figma-generate-diagram | 1,277 / 43 / 13,297 | Entry + diagram-specific ref | P1 / ~700 | Keep the prerequisite and one routing table; load only the chosen diagram grammar rather than exposing the full reference set. | vendor |
| figma-generate-library | 2,448 / 67 / 22,773 | Entry + up to seven refs | P1 / ~1,500 | Convert the entry to staged routing for tokens, components, and documentation; make each stage name the single reference it needs. | vendor |
| figma-implement-design | 1,570 / 47 / 0 | Entry + four cross-skill refs | P1 / ~900 | Separate design inspection, asset handling, and implementation into routes; delete repeated tool-call examples. | vendor |
| figma-use-figjam | 627 / 27 / 17,813 | Entry + `figma-use` + selected board ref | P0 / ~3,000 | Avoid the mandatory full base-skill stack. Put shared tool invariants in one compact reference and load one FigJam board-type guide. | vendor |
| figma-use | 3,635 / 78 / 21,515 | Entry + selected tool refs | P1 / ~2,500 | Preserve the mandatory tool prerequisite, but reduce the entry to safety, node targeting, and a reference router; move examples and long error handling out. | vendor |
| figure-it-out | 844 / 53 / 0 | Entry + up to seven cross-skill refs | P1 / ~500 | Keep the fallback-playbook deliverable; remove automatic auxiliary-skill cascades and load evidence logging only for unattended work. | vendor+patch |
| find-animation-opportunities | 1,430 / 56 / 0 | Entry | P1 / ~800 | Move the catalog of opportunities and rejection examples to a reference; retain scan, filter, rank, and exact-value output. | vendor |
| frontend-design | 583 / 53 / 0 | Entry | P2 / ~150 | Keep the useful anti-generic design stance; delete repeated aesthetic examples and defer implementation rules to framework skills. | vendor |
| grill-me | 98 / 37 / 0 | Entry | P2 / negligible | Already lean. Keep the adversarial-question contract. | vendor |
| grill-with-docs | 513 / 37 / 906 | Entry + two refs | P2 / ~120 | Progressive disclosure is adequate; replace repeated output instructions with one response schema. | vendor |
| gsap-best-practices | 291 / 25 / 4,827 | Entry + selected ref | P2 / negligible | Strong router. Do not mirror its GSAP constraints in `AGENTS.md`; select only the affected API reference. | local |
| handoff | 119 / 14 / 0 | Entry | P2 / negligible | Already lean. Keep the required handoff fields and remove nothing. | vendor |
| how | 1,058 / 46 / 1,691 | Entry + provider discovery/fan-out | P0 / ~1,000 | Stop unconditional routing from Poteto. Remove fixed-model and mandatory subagent workflow; retain evidence-backed walkthrough and load one relevant template. | vendor |
| improve-animations | 1,206 / 74 / 1,509 | Entry + two refs | P1 / ~700 | Shorten the description and split survey, prioritization, and plan templates; load standards only for the affected animation stack. | vendor |
| improve-codebase-architecture | 751 / 40 / 1,365 | Entry + selected ref | P2 / ~250 | Keep the read-only architecture audit; route to one report template and remove duplicate evidence rules. | vendor |
| interrogate | 754 / 28 / 2,609 | Entry + four refs/models | P1 / ~700 | Move model roster, role assignment, and concurrency defaults to configuration; retain adversarial dimensions and synthesis. | vendor |
| motion | 369 / 81 / 6,533 | Entry + selected ref | P1 / ~70 | Shorten the description to triggers and keep the existing progressive router; avoid loading framework references together. | local |
| next-best-practices | 489 / 20 / 10,036 | Entry + selected ref | P2 / negligible | Strong progressive disclosure. Enforce one topic reference per issue and keep examples out of the entrypoint. | vendor |
| poteto-mode | 2,192 / 27 / 10,175 | 623-word bootstrap + entry + playbook + required principles | P0 / 2,335 entry words plus avoided cascades | Replace with the compact contract below. Delete forced todo copying, attribution, `how`/`architect` routing, punctuation bans, duplicated autonomy, and model slugs. | vendor+patch |
| prototype | 541 / 69 / 2,061 | Entry + one of two refs | P1 / ~250 | Shorten the description and keep the two explicit prototype routes; remove repeated “throwaway” and verification prose. | vendor |
| react-gsap-best-practices | 121 / 27 / 1,769 | Entry + selected ref | P2 / negligible | Strong router. Load lifecycle or ScrollTrigger guidance only when that surface is present. | local |
| recall | 960 / 54 / 0 | Entry | P1 / ~500 | Reduce the monolithic reconstruction procedure to source order, confidence labeling, and handback schema; move examples out. | vendor+patch |
| reflect | 710 / 28 / 2,529 | Entry + three-review stack | P1 / ~600 | Move fixed models and concurrency to configuration; keep the three lenses and require edits only when a concrete lesson exists. | vendor+patch |
| review-animations | 1,120 / 23 / 1,383 | Entry + standards ref | P1 / ~600 | Keep severity and approval criteria; move the long craft checklist to the single reference and remove duplicate examples. | vendor |
| shadcn | 2,262 / 53 / 5,293 | Entry + selected ref | P1 / ~1,500 | Route by add, search, fix, style, or compose; move CLI transcripts and examples to operation-specific references. | vendor |
| show-me-your-work | 1,105 / 52 / 0 | Entry | P1 / ~600 | Keep the TSV schema and review requirement; move command examples and repeated logging rules into a script help reference. | vendor+patch |
| tdd | 553 / 39 / 0 | Entry | P2 / ~180 | Keep explicit/cheap-trigger gating and red-green proof; remove repeated exceptions already stated by the trigger. | vendor |
| to-prd | 508 / 28 / 0 | Entry | P2 / ~150 | Keep extraction, review, and publish boundary; collapse tracker-specific prose into the connector tool description. | vendor |
| typescript-best-practices | 264 / 13 / 927 | Entry + one ref | P2 / negligible | Strong compact entry. Keep the single detailed reference and remove cross-skill links unless the task actually uses them. | vendor+patch |
| vercel-composition-patterns | 383 / 39 / 5,273 | Entry + selected ref | P2 / negligible | Strong router. Keep examples in references and load only the matching composition smell. | vendor |
| vercel-react-best-practices | 948 / 41 / 27,520 | Entry + selected ref | P1 / ~300 | Keep rule indexing but shorten entry explanations; ensure the 74 reference files are never bulk-loaded. | vendor |
| web-design-guidelines | 176 / 28 / 0 | Entry | P2 / negligible | Already lean. Keep the URL-backed checklist workflow and result format. | vendor |
| why | 3,132 / 58 / 8,418 | Entry + provider discovery + selected refs | P0 / ~2,500 | Remove provider enumeration, fixed model assumptions, and automatic fan-out from the entry; route by evidence source and keep one rationale template. | vendor |
| write-a-skill | 461 / 24 / 0 | Entry | P2 / ~100 | Keep structure and progressive-disclosure rules; delete duplicated examples already available in the repository guide. | vendor |

## Cross-cutting findings

1. **P0 — Poteto duplicates its own bootstrap.** Exact scope, safe autonomy, user-change protection, verification, and package freshness appear in both `codex/AGENTS.md` and Poteto. The bootstrap also indexes 21 principles, so every task sees summaries for rules it will not use.
2. **P0 — Cascades turn small work into orchestration.** Poteto requires `how` for nontrivial changes, `architect` for function boundaries, verbatim playbook todos, leaf-principle reads, and named attribution. In the tiny catalog refactor, the baseline read the full Poteto entry, the refactoring playbook, five principles, Architect, and its runner templates; it then repeatedly attempted extra-agent work and did not finish in four minutes.
3. **P1 — Descriptions are being used as mini-prompts.** `agent-browser`, `figma-generate-design`, `better-typography`, and `motion` exceed 80 words. Descriptions should select a skill, not teach it.
4. **P1 — Several Figma skills stack mandatory prerequisites.** `figma-use-figjam` can pull in its 631-word entry, the 3,528-word `figma-use` entry, and a large overlapping reference set. Shared invariants belong in one compact interface.
5. **P2 — Model and tool assumptions live in cross-platform prose.** Poteto, Architect, Arena, Interrogate, Reflect, How, and Why name models, subagent types, providers, or concurrency defaults. Those values become stale and should live in agent configuration.
6. **P2 — Style constraints compete with task content.** Poteto's punctuation bans, mandatory consumer/maintainer framing, principle attribution, and verbatim todo copying consume output and attention without a measured quality benefit.

## Ready-to-apply Poteto replacement

This is the smallest design worth re-running. It is **not approved for live use until it passes the failed gates**. The post-action verification sentence is the one restoration added after the blind review.

### `codex/AGENTS.md`

```md
# Agent Guidance

Poteto is the default working style unless a higher-priority instruction conflicts.

For multi-step work, read `/Users/jq/.codex/skills/poteto-mode/SKILL.md` and load only the route it selects.

Keep scope exact. Preserve user changes and match the local code and prose. Inspect for explanation, review, and diagnosis requests; edit and validate for build, change, refactor, and fix requests.

Proceed with reversible work inside the requested scope. Pause before external writes, deployment, purchases, destructive actions the user did not clearly authorize, or a material expansion of scope.

Use current official documentation when package or API behavior could have changed.
```

### `skills/poteto-mode/SKILL.md`

```md
---
name: poteto-mode
description: Exact-scope implementation, safe autonomy, and verification against the real artifact.
---

# Poteto Mode

Deliver the requested outcome with the smallest clear change that proves it works.

## Boundaries

- Keep scope exact. Do not add features, compatibility layers, configuration, or cleanup unrelated to the request.
- Preserve user work. Do not overwrite unrelated changes or remove pre-existing code merely because it looks unused.
- Proceed with reversible, in-scope work. Pause before an external write, deployment, purchase, destructive action not clearly authorized, or a product decision that would materially change the result.
- Match the repository's existing structure and style unless that structure is the problem being changed.

## Route

Classify the request before acting:

| Request | Default action |
|---|---|
| Explain, review, investigate, or diagnose | Inspect and report evidence. Do not edit unless asked. |
| Fix or refactor | Reproduce or characterize current behavior, make a surgical change, and validate it. |
| Build or change | Implement the requested outcome and validate the real artifact. |
| Long or unfamiliar work | Break it into independently verifiable units and keep a compact decision trail when useful. |

Load at most one specialized playbook when it materially helps. Read only the references that playbook explicitly requires. Do not load a playbook for a small, obvious task.

## Work

1. Inspect the relevant files, state, and local instructions.
2. Name the important data shape, boundary, or sequence only when the change introduces or alters one.
3. Prefer deletion and direct code over a new abstraction. Build a helper or harness only when it performs or proves the work more reliably.
4. Make the smallest coherent edit. Remove only leftovers created by that edit.
5. Verify against the real artifact at a cost proportionate to risk: run focused checks first, then broader checks when the change could affect them.

After a destructive or external action, inspect the exact post-state before reporting success.

If verification cannot run, say exactly what is unverified and why. Do not treat code inspection as proof of runtime behavior.

## Delegation

Delegate only independent work with a clear deliverable. Keep integration decisions and final verification in the main thread. Do not delegate merely to follow a fixed workflow.

## Response

Lead with the outcome. Include the evidence that matters, any remaining caveat, and the next useful action. Use plain prose and only enough structure to make the result easy to scan.
```

### Exact deletions and relocations

- Delete the principle index from `codex/AGENTS.md`; keep principle files as optional references.
- Delete mandatory principle attribution, the mandatory first todo, verbatim playbook todo copying, throughput checkpoint prose, punctuation bans, duplicated autonomy paragraphs, unconditional `how` and `architect`, and shipping/PR plugin assumptions from Poteto.
- Keep playbooks, but make them optional routes. Each playbook should link only the references required for that route.
- Move model slugs, subagent types, background defaults, and provider rosters to agent configuration.
- Keep exact scope, reversible autonomy, protection of user changes, approval boundaries, and real-artifact verification once, in the compact core.

## Isolated baseline-versus-replacement run

The neutral fixtures lived under `/private/tmp/orchard-context-20260725`; neither prompt variant edited repository prompts. Claude tasks used local non-interactive Claude Opus 5. GPT tasks used local non-interactive GPT-5.6 Terra. GPT-5.6 Sol blindly reviewed Claude outputs; Claude Opus 5 blindly reviewed GPT outputs. File labels were randomized independently per task before review.

For Claude, total tokens sum input, output, cache creation, and cache reads reported by `modelUsage`. For GPT, total tokens are input plus output from the completed turn. Absolute totals are not compared across model families.

| Task | Worker | Baseline total | Replacement total | Change | Blind quality, baseline → replacement | Critical result |
|---|---|---:|---:|---:|---:|---|
| Read-only request path | Claude Opus 5 | 161,217 | 140,964 | -12.6% | 17 → 19 | No critical regression |
| Bug fix + regression check | Claude Opus 5 | 317,327 | 179,431 | -43.4% | 17 → 18 | No critical regression |
| Scoped refactor | GPT-5.6 Terra | Did not complete in 4 min | 105,351 | n/a | 12 → 22 | Baseline cascaded into failed extra-agent work |
| Archive removal + production command | GPT-5.6 Terra | 84,024 | 104,552 | +24.4% | 19 → 18 | Replacement omitted post-state verification |

After unmasking, the descriptive point total was 65 for baseline and 77 for the replacement. Each output had one cross-family reviewer, with no repeated ratings or variance estimate. Across the three completed paired runs, the median was 161,217 baseline tokens and 140,964 replacement tokens, a directional 12.6% difference. The missing baseline refactor arm means this is not a defensible overall effect estimate.

### Acceptance

| Gate | Result |
|---|---|
| Median loaded context falls at least 50% | **Not established:** the static word-count proxy is 2,815 → 495, -82.4%, but loaded tokens were not measured separately |
| Median total tokens falls at least 50% | **Fail:** the three completed pairs show a directional -12.6%; one baseline arm is missing |
| No scope, safety, or verification-critical regression | **Fail:** the replacement reported irreversible work successful without observing post-state |
| Blinded quality matches or exceeds baseline | **Nominal pass, low confidence:** baseline 65 → replacement 77, with one reviewer per output |

The proposal is therefore not promoted. The smallest instruction group that must be restored is one sentence under verification: “After a destructive or external action, inspect the exact post-state before reporting success.” That sentence is untested and must be re-evaluated rather than assumed to generalize. The token gates need another run with complete pairs and direct loaded-token accounting; the present data does not justify a 50% context or end-to-end reduction claim.

## Sync and integrity status

- Dedicated branch: `sync/skills-context-audit-20260725-223347`.
- Repo-owned inventory: 50 skills.
- Added prompts: none. The two prompts captured during the initial sync were subsequently uninstalled with their single-purpose vendor sources.
- Excluded and untouched: `~/.claude/skills/my-skill`.
- Bundled system and plugin-cache skills: outside repository ownership and outside this audit.
- Prompt edits: none to pre-existing `SKILL.md` files or `codex/AGENTS.md`. The project `AGENTS.md` vendor-source table was updated only to stop advertising the uninstalled `find-skills`.
- The settings sync now redacts both Context7 and Motion tokens before writing templates. The zero-match result is bounded to the patterns and paths scanned; it is not proof that no other secret form exists.

Final command-level verification is recorded in `.audit/skill-context-audit.tsv`.
