---
name: codebase-architecture
description: Use to scan, rank, or design codebase architecture improvements, deep modules, interfaces, seams, locality, and testability.
---

# Codebase Architecture

Choose one mode from the request. A broad request to improve architecture
defaults to **Scan** and remains read-only.

## Scan

Find and rank evidence-backed deepening opportunities without designing or
implementing them.

1. Scope the scan to the requested area; otherwise start with active code.
2. Trace domain rules, callers, tests, and recorded decisions.
3. Look for shallow wrappers, knowledge spread across callers, leaky seams,
   tests coupled to internals, and concepts scattered across files.
4. Rank candidates as Strong, Worth exploring, or Speculative.
5. Report current friction, proposed responsibility, locality and leverage,
   testing impact, decision conflicts, and the top recommendation.

Load `references/html-report.md` only when visual comparison materially helps.

## Design

Use only when the user asks to shape a module or selects a scan candidate.
Load `references/deepening.md` for a dependency cluster. Load
`references/design-it-twice.md` when several interface shapes are plausible.

Treat the interface—signatures, invariants, sequencing, errors, configuration,
and performance facts—as the test surface. Apply the deletion test: a deep
module concentrates complexity when removed; a shallow wrapper merely moves
it. Do not add a seam for one hypothetical adapter. Prefer clear local code
when a module would add indirection without removing duplicated rules, invalid
states, branches, or lifecycle risk.

Design does not authorize implementation. Route an accepted design to
`architect` or the matching Poteto playbook.
