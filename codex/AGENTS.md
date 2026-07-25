# Global Agent Instructions

This is the shared global instruction file for Codex and Claude Code. Claude Code imports it through `~/.claude/CLAUDE.md`, which points at `~/.codex/AGENTS.md`.

## Authority

System, developer, and project instructions win over this file.

When no higher-priority instruction conflicts, `poteto-mode` is the default behavioral contract. This file is a bootstrap and index, not a second copy of Poteto. Do not blend competing styles. Follow Poteto unless a higher-priority instruction overrides it.

## Default Workflow

- Start nontrivial work by using the relevant skill.
- For Poteto-style work, read [`poteto-mode`](/Users/jq/.codex/skills/poteto-mode/SKILL.md) first.
- For multi-step work, follow the matching Poteto playbook instead of inventing a bespoke checklist.
- For reversible implementation work, proceed and present the result.
- Pause only for irreversible actions or genuine product-direction ambiguity.

## Change Discipline

- Surface assumptions and meaningful interpretations when they affect the work. For reversible work, choose a path and state it instead of blocking.
- Keep scope exact. Do not add features, configurability, abstraction, or impossible-case handling that the task did not ask for.
- Make surgical edits. Touch only what the request needs, match local style, and leave unrelated cleanup for a note.
- Clean up only your own leftovers. Remove imports, variables, functions, and files made unused by your change. Mention pre-existing dead code instead of deleting it.
- Every changed line should trace to the user request, the selected Poteto playbook, or required verification. If it does not, drop it.

## Principle Index

These summaries are quick routing hints. Read the linked reference when a principle changes a decision.

**Core**

- [Laziness Protocol](/Users/jq/.codex/skills/poteto-mode/references/principles/laziness-protocol.md): prefer deletion, smaller diffs, and the least abstraction that solves the problem.
- [Foundational Thinking](/Users/jq/.codex/skills/poteto-mode/references/principles/foundational-thinking.md): name core types, data structures, and sequencing before writing logic.
- [Redesign from First Principles](/Users/jq/.codex/skills/poteto-mode/references/principles/redesign-from-first-principles.md): integrate new requirements as if they were present from day one.
- [Subtract Before You Add](/Users/jq/.codex/skills/poteto-mode/references/principles/subtract-before-you-add.md): remove dead weight and redundant paths before layering on new structure.
- [Minimize Reader Load](/Users/jq/.codex/skills/poteto-mode/references/principles/minimize-reader-load.md): reduce layers, hidden state, and indirection between question and answer.
- [Outcome-Oriented Execution](/Users/jq/.codex/skills/poteto-mode/references/principles/outcome-oriented-execution.md): converge on the target architecture instead of preserving temporary compatibility forever.
- [Experience First](/Users/jq/.codex/skills/poteto-mode/references/principles/experience-first.md): choose the user or operator experience over implementation convenience.
- [Exhaust the Design Space](/Users/jq/.codex/skills/poteto-mode/references/principles/exhaust-the-design-space.md): compare real alternatives before committing to a novel UI or architecture.
- [Build the Lever](/Users/jq/.codex/skills/poteto-mode/references/principles/build-the-lever.md): build the script, codemod, generator, or harness that performs or proves the work.

**Architecture**

- [Boundary Discipline](/Users/jq/.codex/skills/poteto-mode/references/principles/boundary-discipline.md): validate at system boundaries, trust internal types, and keep business logic pure.
- [Type System Discipline](/Users/jq/.codex/skills/poteto-mode/references/principles/type-system-discipline.md): make illegal states unrepresentable and parse external data into typed models.
- [Make Operations Idempotent](/Users/jq/.codex/skills/poteto-mode/references/principles/make-operations-idempotent.md): design commands and lifecycle steps to converge safely across retries and crashes.
- [Migrate Callers Then Delete Legacy APIs](/Users/jq/.codex/skills/poteto-mode/references/principles/migrate-callers-then-delete-legacy-apis.md): move every caller to the new API and delete the old path in the same wave.
- [Separate Before Serializing Shared State](/Users/jq/.codex/skills/poteto-mode/references/principles/separate-before-serializing-shared-state.md): give concurrent actors independent state before introducing locks or serialization.

**Verification**

- [Prove It Works](/Users/jq/.codex/skills/poteto-mode/references/principles/prove-it-works.md): verify against the real artifact before declaring done.
- [Fix Root Causes](/Users/jq/.codex/skills/poteto-mode/references/principles/fix-root-causes.md): reproduce symptoms, trace to the root cause, and fix there.
- [Sequence Work into Verifiable Units](/Users/jq/.codex/skills/poteto-mode/references/principles/sequence-verifiable-units.md): break work into small units, verify each one, and order commits so the proof is readable.

**Delegation**

- [Guard the Context Window](/Users/jq/.codex/skills/poteto-mode/references/principles/guard-the-context-window.md): route bulk reading and fan-out to subagents while keeping reduced findings in the main thread.
- [Never Block on the Human](/Users/jq/.codex/skills/poteto-mode/references/principles/never-block-on-the-human.md): proceed on reversible work and reserve questions for genuine product or preference calls.

**Meta**

- [Encode Lessons in Structure](/Users/jq/.codex/skills/poteto-mode/references/principles/encode-lessons-in-structure.md): turn repeated instructions into checks, scripts, metadata, or runtime guardrails.

## Package and API Freshness

When implementing code that depends on a package, use the relevant skill if one is available. Use Context7 or current official docs before relying on examples, APIs, or behavior from memory.
