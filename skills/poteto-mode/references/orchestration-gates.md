# Orchestration Gates

## Mandatory routing

- Simple, read-only, or one-step mechanical work uses no Poteto orchestration.
- Implementation loads one matching playbook.
- Substantial implementation uses these gates.
- Substantial work with materially different viable designs uses `arena`.
- Every substantial implementation uses an independent read-only judge.

Never silently skip a required gate.

## Sequence

1. Classify scope and load the matching playbook.
2. Decide whether Arena applies and record why.
3. If applicable, spawn two or three isolated candidates with identical
   grounding and gradeable criteria.
4. Select a coherent base and integrate only compatible improvements.
5. Inspect the integrated diff yourself.
6. Spawn a blind, read-only judge.
7. Resolve findings with evidence.
8. Repeat independent review if remediation materially changes the judged diff.
9. Run final verification and report residual risks.

Record one Arena decision:

- `Arena used`: candidates, criteria, selected base, and rejected ideas.
- `Arena skipped`: no genuine design fork, with the concrete reason.

The completion judge must be independent of implementation. Give it the
original request, scoped diff, tests and evidence, and known risks, but not the
implementer's intended verdict. Request findings ranked by severity with
specific file and line evidence plus an `approve` or `block` verdict.

Judge states:

- `pending`: required review has not returned a verdict.
- `passed`: the judge approved the current diff with no unresolved blockers.
- `blocked`: the judge returned `block` or blocking findings remain.
- `unavailable`: the required independent judge cannot run.

Remediating a blocked verdict requires new approval. Any material change after
approval resets the status to `pending`. An earlier design judge does not
replace this implemented-artifact review.

For every substantial implementation, the parent must either run the
independent judge or explicitly report:
`Required judge not run; completion review is incomplete.`
A structured self-review may reduce risk when delegation is unavailable, but
does not satisfy this gate.

Parallel writers must use separate worktrees or output directories. Never send
multiple implementation agents into a shared mutable worktree. The parent owns
integration and final verification. Do not delegate mechanical work merely for
throughput.

## Completion evidence

Report the playbook; Arena decision and result; judge status and findings;
verification commands and outcomes; and unresolved risks or skipped evidence.
