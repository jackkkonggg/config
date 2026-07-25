---
name: improve-codebase-architecture
description: Use to find and rank deepening opportunities that improve codebase locality, testability, and navigation.
---

# Improve Codebase Architecture

Find architectural friction and propose a small set of deepening opportunities.
This skill investigates and reports; it does not refactor the code.

1. Scope the scan to the user’s target. Otherwise use recent change history to
   identify active areas before widening.
2. Read relevant domain documentation and architecture decisions.
3. Trace the selected code. Look for shallow wrappers, knowledge spread across
   callers, leaky seams, tests coupled to internals, and concepts that require
   bouncing across many files.
4. Apply `codebase-design` vocabulary and its deletion test.
5. Rank only opportunities supported by repository evidence. Mark each
   recommendation Strong, Worth exploring, or Speculative.

For each candidate, report files, current friction, proposed module shape,
locality and leverage gains, testing impact, conflicts with recorded decisions,
and a before/after diagram. Use `HTML-REPORT.md` when a visual HTML report will
materially improve comparison; otherwise return the same evidence concisely in
the conversation.

Name the top recommendation. If the user chooses one, use `codebase-design` to
shape its interface, then hand implementation to `architect` or the matching
Poteto playbook.
