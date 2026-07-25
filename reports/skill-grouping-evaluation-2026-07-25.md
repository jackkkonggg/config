# Skill Grouping Evaluation

Date: 2026-07-25  
Branch: `codex/skill-grouping`

## Result

The grouped catalog passed promotion after two small instruction restorations.

| Gate | Required | Result |
| --- | --- | --- |
| Repo selectors | 26 | 26 |
| Description characters | At most 4,000 | 2,542 |
| Router size | Below 250 words | 118–216 words |
| Median affected-route context reduction | At least 40% | 40.2% |
| Worst affected-route context increase | At most 10% | 5.5% |
| Trigger routing | At least 95% | 25/25 for Claude 5 and 25/25 for GPT-5.6 |
| Blind quality | Match or exceed baseline | Grouped won 3 tasks and tied 1 |
| Critical grouped regression | None | None |

## Context measurement

Normal transitive load is the word count of the selected entrypoint plus the
references that route normally requires. Unrelated rules and compiled
`AGENTS.md` files are excluded. The same detailed reference is counted on both
sides when it is unchanged.

| Route | Baseline words | Grouped words | Reduction |
| --- | ---: | ---: | ---: |
| Color conversion + contrast | 1,630 | 1,030 | 36.8% |
| Palette | 1,270 | 670 | 47.2% |
| Typography spacing + wrapping | 3,209 | 1,366 | 57.4% |
| Surface polish | 2,180 | 1,304 | 40.2% |
| Motion term lookup | 2,159 | 2,277 | -5.5% |
| Apple motion principles | 3,426 | 3,568 | -4.1% |
| Motion opportunities | 1,430 | 499 | 65.1% |
| Motion audit + plan | 2,715 | 1,828 | 32.7% |
| Motion review | 2,503 | 1,666 | 33.4% |
| React composition | 852 | 681 | 20.1% |
| React performance | 1,129 | 393 | 65.2% |
| Crossed composition + performance | 1,715 | 596 | 65.2% |
| React GSAP | 1,466 | 1,313 | 10.4% |
| Runtime explanation | 1,058 | 276 | 73.9% |
| Historical rationale | 4,421 | 1,621 | 63.3% |

Median reduction is 40.2%. The two small increases occur where a formerly
standalone motion prompt becomes a router plus the same large reference. Both
remain below the allowed 10% increase.

## Trigger suite

Both model families routed all 25 prompts correctly. Coverage included:

- Color-only, palette, typography, UI polish, motion naming, Apple motion,
  opportunity discovery, motion audit, and motion review.
- React composition, performance, crossed concerns, plain GSAP, and React GSAP.
- Runtime explanation and historical rationale.
- Next.js, shadcn, architecture, three Figma workflows, and negative UI, React,
  and architecture prompts.

The negative cases did not load `visual-design`, `motion-design`,
`react-engineering`, `next-best-practices`, `architect`, or
`improve-codebase-architecture` when those selectors were unrelated.

## Blind quality

Candidate paths and variant labels were removed from judge prompts. Claude 5
produced the React and rationale candidates; GPT-5.6 judged them. GPT-5.6
produced the motion and visual candidates; Claude 5 judged them.

| Task | Grouped | Baseline | Verdict |
| --- | ---: | ---: | --- |
| Scoped React composition refactor | 5 | 3 | Grouped |
| Repository-evidence rationale | 5 | 4 | Grouped |
| Bounded motion review | 4.5 | 3.5 | Grouped |
| Scoped visual CSS improvement | 7.5 | 7.5 | Tie |

The initial round exposed three misses: static child composition was not
explicit enough, positive design purpose was incorrectly treated as proof
against an alternative, and heading measure did not route to wrapping guidance.
The smallest durable constraints were restored and the failed pairs rerun.

The React judge marked the pair as containing a critical regression because the
baseline candidate changed repeat-selection callback behavior. The final
grouped candidate preserved the original effect, dependencies, callback timing,
and repeat-selection semantics; the grouped candidate itself had no critical
regression.

## Catalog changes

- `visual-design` replaces `better-colors`, `better-typography`, and
  `better-ui`.
- `motion-design` replaces five motion vocabulary and review selectors.
- `react-engineering` replaces the two Vercel React selectors.
- `explain-codebase` replaces `how` and `why`.
- `gsap-best-practices` now owns the React GSAP routes.
- `figma-project-rules` preserves the unique repository-backed Figma rule
  workflow. Other Figma work routes to the enabled official plugins.

Composite provenance and pinned vendor revisions are recorded in
`skills/.provenance.json`. Upstream drift is warning-only and requires manual
review.

## Verification boundary

The fixture intentionally had no installed dependencies or TypeScript
configuration. Implementation candidates therefore used static verification
and `git diff --check`; the report does not claim compiler or browser proof.
Catalog structure, descriptions, links, provenance, plugins, global symlinks,
and vendor resolution are verified separately by `skills doctor`.

## Repository verification

- `skills doctor` passes with 26 grouped selectors, 2,542 description
  characters, 17 resolved vendor entries, both required Figma providers, and no
  stale global links.
- All 26 repo skills are linked in each of `~/.agents/skills`,
  `~/.claude/skills`, and `~/.codex/skills`; each root has zero broken links.
- The catalog validator passes relative-link, membership, provenance, router
  size, description, retired-name, plugin, and symlink checks.
- Deliberately altered temporary manifests prove that source drift produces a
  warning and a missing required plugin produces an error.
- `skills-cli` passes type checking and all 446 tests across 30 test files with
  the repository-pinned pnpm 10.17.1. Its two global-install tests now isolate
  `HOME`, `CLAUDE_CONFIG_DIR`, and `CODEX_HOME`, so verification cannot recreate
  global `find-skills` or fixture selectors.
- Recursive submodule status is clean. Secret scanning, conflict checks, and
  `git diff --check` pass.

The live catalog was relinked only after the evaluation gates passed. The
repository changes remain uncommitted on `codex/skill-grouping`.
