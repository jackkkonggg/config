# Skill source update and lean-prompt evaluation

Date: 2026-07-26
Branch: `codex/skill-updates-20260726-023815`

## Outcome

Accepted. The proposed catalog passes the structural, context, safety, and
blinded-quality gates.

- 23 repo selectors.
- 2,256 total description characters; no description exceeds 140.
- Every declared router is at most 250 words.
- Median transitive context fell 66.8% across the nine affected tasks.
- Median Poteto context fell 83.9%; every measured Poteto route exceeded 50%.
- No affected route loaded more than 10% additional context; Teach rose 1.7%.
- The routing suite passed 8/8 tests.
- Blinded quality averaged 4.61/5 for the proposal and 3.72/5 for baseline.
- Neither judge identified a critical proposal regression in scope, safety,
  permissions, behavior preservation, or verification.

The prompt reductions follow
[OpenAI's GPT-5.6 guidance](https://developers.openai.com/api/docs/guides/prompt-guidance-gpt-5p6)
and
[Anthropic's Claude 5 context guidance](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models):
entrypoints route work, detailed guidance loads selectively, and agent
configuration—not shared prose—chooses models.

After evaluation, the locally owned `convex-best-practices` selector was
retired at the user's request. It was not loaded by any evaluation task, so
the routed-context and blinded-quality results below are unchanged.

## Source decisions

| Source | Locked revision | Decision |
| --- | --- | --- |
| `vercel-labs/next-skills` | retired | Delete the selector and source. Use version-matched bundled Next.js docs and generated agent instructions. |
| `figma/mcp-server-guide` | retired | Delete the project-rule generator and source. Figma remains an external-provider-only group. |
| `jakubkrehel/skills` | `79a09456be60419e652e63fc9e057b5587d051ea` | Import seven visual families into `visual-design`; watch routers and ignore packaging metadata. |
| `anthropics/skills` | `b29e7cf65e5cb78a5ac33d582270551bc74a14eb` | Preserve current design substance behind direction, process, and writing routes. |
| `shadcn/ui` | `aa13b0cb83cd32beb99820df63db1bb9357bc4f6` | Adopt current component, chat, registry, CLI, MCP, styling, and composition references behind a 196-word router. |
| `mattpocock/skills` | `ed37663cc5fbef691ddfecd080dff42f7e7e350d` | Merge opportunity scanning and selected interface design into the routed `codebase-architecture` composite. |
| `cursor/plugins` | `04166ac89136d36de2a87f24429e6cc307594953` | Reconcile all direct and composite locks together; remove platform paths and model slugs from shared workflows. |

The Jakub composite explicitly classifies every upstream file. Specialist
references are imported, each `SKILL.md` is watched for manual adapter review,
and each `agents/openai.yaml` is ignored as packaging metadata. Imported
license assets remain non-context files.

`SKILLS.md` is not required and was not created. `skills/.groups.json` remains
the canonical inventory rendered by `skills list`.

## Prompt material deliberately rejected

- Anthropic studio roleplay, imagined rejected proposals, mandatory
  aesthetic-risk narration, fixed lists of “AI looks,” and internal-thinking
  narration.
- The 2,430-word shadcn entrypoint when its durable rules can live in routed
  upstream references.
- Matt Pocock dependencies on uninstalled `grilling` and `domain-modeling`
  skills, and global vocabulary bans outside architecture-design output.
- Cursor paths, hardcoded Claude/GPT/Grok/Composer slugs, mandatory todo
  copying, mandatory principle attribution, unconditional delegation or
  architecture routing, and blanket punctuation rules.
- Global TypeScript rules for “no console.log” and “always use real tests.”
- `create-verification-skill` and `maintain-verification-skill`.

The retained behaviors are exact scope, reversible autonomy, protection of user
changes, approval for irreversible or external actions, evidence-backed
diagnosis, and verification against the real artifact.

## Transitive-context measurement

The harness counted deterministic whitespace-delimited words in the entrypoint
and only the references selected for each task. This avoids model-specific
tokenizer drift while preserving the relative prompt-size comparison.

| Task | Baseline | Proposal | Change |
| --- | ---: | ---: | ---: |
| UI implementation | 545 | 323 | -40.7% |
| Holistic UI review | 2,579 | 2,077 | -19.5% |
| Architecture investigation | 722 | 240 | -66.8% |
| Interface design | 1,521 | 1,040 | -31.6% |
| Behavior-preserving refactor | 2,711 | 441 | -83.7% |
| Bug repair | 2,580 | 409 | -84.1% |
| Performance diagnosis | 2,339 | 552 | -76.4% |
| Teach mode | 1,751 | 1,780 | +1.7% |
| Destructive/external-action boundary | 2,179 | 252 | -88.4% |

Median reduction is 66.8%. The four Poteto cases have an 83.9% median
reduction. Teach is the only increase and stays below the 10% ceiling because
it intentionally combines runtime and rationale evidence.

The architecture follow-up replaced two selectors with one router. Broad
requests default to a read-only Scan; detailed Design references load only
after the user asks to shape a selected opportunity. Forward tests confirmed
that Scan loaded no references, while an explicit two-shape interface request
loaded only `deepening.md` and `design-it-twice.md`. Compared with the earlier
split proposal, the merge adds 45 words (23.4%) to the unusually small Scan
route and 50 words (5.1%) to Design. They remain 66.8% and 31.6% below their
respective baselines. The accepted 10% ceiling compares proposal routes with
their baselines, so neither route violates it.

GPT-5.6 Sol's reported median total candidate tokens fell from 21,541 to
18,714 (-13.1%) despite a large fixed CLI/system context. Claude's system-prompt
file usage was cache-reported as two input tokens for every run, so its input
counter is not used as a comparative claim.

## Blind model evaluation

The reproducible harness is `scripts/evaluate-skill-update.mjs`; raw anonymized
outputs and judgments are in
`reports/skill-update-evaluation-results-2026-07-26.json`.

It ran baseline and proposal variants for all nine tasks through:

- Claude Opus 5 via `claude --model opus`;
- GPT-5.6 Sol via `codex exec --model gpt-5.6-sol`.

Variant labels alternated deterministically between A and B. GPT judged
Claude's outputs and Claude judged GPT's outputs. Each judge scored task
quality, scope discipline, safety/permissions, and verification.

| Variant | Score | Average |
| --- | ---: | ---: |
| Baseline | 67 / 90 | 3.72 / 5 |
| Proposal | 83 / 90 | 4.61 / 5 |

The proposal matched or exceeded baseline on 14 of 18 paired judgments. The
four lower scores were the two UI implementation and two Teach outputs;
neither task had a critical regression. One judge flagged the baseline
refactor for changing invalid-filter persistence despite a behavior-preserving
request, and the other flagged the baseline action-boundary answer for
promising an unsupported undo path. No critical proposal regression was
reported.

## Verification

Passed:

- `node --test scripts/tests/*.test.mjs`
- `node scripts/composite-sync.mjs check --json`
- linked-worktree `./bin/skills doctor`
- catalog count, description, router, provenance, and retired-selector checks
- exact direct-source and composite revisions
- `git submodule status --recursive`
- relative-link resolution
- no `SKILLS.md`
- secret-pattern scan of evaluation evidence
- `git diff --check`

The live global symlinks intentionally still point at the primary checkout.
Linked-worktree verification skips retired-link mutation; promotion from the
primary checkout removes the two retired links after merge.
