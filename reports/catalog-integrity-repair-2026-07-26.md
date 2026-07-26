# Catalog-wide skill integrity and lean-router repair

Date: 2026-07-26  
Branch: `codex/catalog-integrity-repair-20260726-061941`

## Outcome

Accepted after three surgical evaluation corrections and one focused rerun.

- 23 repo selectors and 2,290 description characters.
- All 23 entrypoints are at most 250 words and provide `agents/openai.yaml`.
- Entrypoint context fell from 8,386 to 4,201 words, a 49.9% catalog reduction.
- Median loaded context fell 46.8% across the eleven affected scenarios.
- Adjusted blinded quality was 4.50/5 for the proposal and 4.05/5 for baseline.
- No current proposal has a critical scope, safety, permission, or verification
  regression.

The 87,719 words of detailed references remain selectively routed. Effective
domain libraries were not flattened into entrypoints.

## Integrity repairs

- Removed unavailable selectors and platform commands including `unslop`,
  `/deslop`, Cursor transcript paths, Cursor agent types, and unavailable
  control skills.
- Replaced destructive PR-reset guidance with worktree-safe isolation that
  preserves unrelated changes.
- Made `architect` design-only, `figure-it-out` playbook-only, and
  `blast-radius` read-only unless implementation is separately authorized.
- Repaired `explain-codebase` mode names, Poteto principle routing, React
  composition paths, Motion audit resources, and the retired
  `better-accessibility` composite reference.
- Narrowed TypeScript triggering and replaced blanket type rules with
  project-sensitive judgment.
- Added catalog validation for entrypoint size, OpenAI metadata, routed paths,
  unresolved skill references, retired selectors, and known non-portable prompt
  terms.

## Context measurement

The harness counted whitespace-delimited words in each task's entrypoint and
only the references that route required.

| Scenario | Baseline | Proposal | Reduction |
| --- | ---: | ---: | ---: |
| Architecture design | 1,640 | 1,032 | 37.1% |
| Migration playbook | 812 | 389 | 52.1% |
| Blast-radius review | 735 | 391 | 46.8% |
| Recall | 923 | 376 | 59.3% |
| Decision trail | 1,070 | 351 | 67.2% |
| TDD bug fix | 533 | 301 | 43.5% |
| Browser prerequisite | 356 | 163 | 54.2% |
| Motion routing | 305 | 130 | 57.4% |
| TypeScript API review | 267 | 183 | 31.5% |
| PR-opening boundary | 415 | 463 | -11.6% |
| Read-only investigation | 417 | 405 | 2.9% |

The PR route deliberately adds 48 words to define authorization and
user-change protection. The median remains above the 35% acceptance threshold.

## Blind evaluation and corrections

Claude Opus 5 and GPT-5.6 Sol produced anonymized baseline and proposal
responses. Each family judged the other family's outputs.

The broad final run scored 98/110 for proposal and 86/110 for baseline. A
focused rerun after the browser correction scored 9/10 for proposal and 10/10
for baseline. Replacing the stale browser pair gives current combined scores of
99/110 (4.50/5) and 89/110 (4.05/5).

Three failed behaviors were corrected with the smallest relevant instruction
group:

1. A blast-radius response treated localStorage as the only untrusted ingress.
   Restored explicit enumeration of URL, storage, legacy persistence, network,
   and sibling boundaries before reducing to a safety fact.
2. A PR response bundled unrelated filter, deletion, and performance fixes into
   an explanation request. Removed unconditional PR invocation and limited the
   playbook to an already-authorized, already-scoped change.
3. A browser response silently offered another browser tool when
   `agent-browser` was missing. Changed the workflow to stop, report the
   prerequisite, and request a user choice. The focused rerun had no critical
   finding from either judge.

Raw candidates and judgments are in
`catalog-integrity-evaluation-results-2026-07-26.json` and
`catalog-integrity-browser-reeval-results-2026-07-26.json`. The reusable
scenario fixtures live under `scripts/fixtures/`.

## Verification

Passed:

- 16 script and routing tests.
- 446 skills CLI tests, type checking, and production build.
- Validation of all 23 skill folders with the system skill validator.
- Catalog, composite ownership, direct-vendor patch, and update verification.
- Worktree doctor, global symlink health, and recursive submodule status.
- Secret-pattern scan and `git diff --check`.
