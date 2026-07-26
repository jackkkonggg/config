# Plan

Produce a phased implementation plan grounded in selectively loaded Poteto
principle references. The plan is the deliverable. Do not implement.

Open a todolist with one item per step below.

## 0. Triage

Skip the plan when the change is one or two files with an obvious approach. Say so and stop.

Plan when the change spans three or more files, introduces architecture, has competing approaches or unclear scope, or the user asked for one.

## 1. Select relevant principles

Read only the files under `principles/` that could change a decision. Link the
ones that materially constrain the plan.

## 2. Scope and constraints

State your read of scope and constraints in one paragraph. Ask the user only
for genuinely ambiguous intent; load
[Never Block on the Human](principles/never-block-on-the-human.md) when deciding
whether a question is necessary.

Resolve what is in scope vs explicitly out, technical or platform constraints, patterns to preserve, and the definition of done.

## 3. Explore in subagents

For large exploration, load
[Guard the Context Window](principles/guard-the-context-window.md) and delegate
only independent searches.

- Let agent configuration select available runners and models.

Each explorer returns file pointers, conventions, dependencies, test infrastructure, and entry points. No inlined dumps.

## 4. Write the plan

The user specifies where the plan lives.

Single file `NN-slug.md` for small plans. For three or more phases, a directory with `overview.md` plus phase files:

```
NN-slug/
├── overview.md
├── phase-1-scaffold.md
├── phase-2-...md
└── testing.md
```

### Phase sizing

- One function or type plus tests, or one bug fix. Not "one file".
- Two to three files touched, max.
- Prefer independently verifiable phases over a few large batches. Load
  [Foundational Thinking](principles/foundational-thinking.md) when sequencing
  foundations changes the plan.
- Split if a phase has more than five test cases or three functions.

### Overview file

- **Context.** Problem and why now.
- **Scope.** Included; explicitly excluded.
- **Constraints.** Technical, platform, dependency, pattern.
- **Alternatives.** Two or three credible approaches, choice, and rationale.
  Load [Exhaust the Design Space](principles/exhaust-the-design-space.md) only
  for consequential choices.
- **Applicable skills.** Domain skills the implementer should invoke, by name.
- **Phases.** Ordered standard-markdown links to phase files.
- **Verification.** Project-level commands.
- **Implementation guidance.** Per section 6.

### Phase files

- Back-link to overview.
- **Goal.** What the phase accomplishes.
- **Changes.** Files affected and the change at a high level. What and why, not how. No code snippets.
- **Data structures.** Name the key types or schemas. One-line sketch only.
- **Verification.** Per section 6.

Order phases so dependencies land before consumers. Each phase should be
independently shippable and verifiable.

For changes touching existing code, load
[Redesign from First Principles](principles/redesign-from-first-principles.md)
when the new requirement invalidates the existing shape. Redesign holistically;
deliver incrementally.

If a phase creates or edits a skill, use the environment's skill-authoring
workflow.

## 5. Verification per phase

Each phase needs both:

**Static.** Type check, lint, project tests pass.

**Runtime.** Exercise the feature on the matching surface with the authorized
capability available in the current environment:

- Browser, Electron, or web UIs: use the authorized browser or desktop-control
  capability available in the current environment.
- CLIs and TUIs: run the real command through the current shell capability.
- Native mobile: whatever simulator-driving skill your team has.
- No capability for the touched surface: flag it in the plan.

For bug fixes, reproduce on the surface, fix, and verify on that surface. Load
[Prove It Works](principles/prove-it-works.md) when selecting evidence.

## 6. Implementation guidance

In the overview, name which poteto-mode non-negotiables the implementer must apply, by name:

- `explain-codebase` in How mode over each unfamiliar subsystem before changing it.
- the **interrogate** skill for adversarial review on contested designs before shipping.
- Review each diff for unrelated churn and each prose surface for concrete,
  concise language before commit.
- the **show-me-your-work** skill to keep a decision trail when the plan is large enough to need an auditable record.
- The environment's review-monitoring workflow after opening the PR.

## 7. Hand back

Summarize phases, scope boundaries, applicable skills, and verification. Stop. The user decides when implementation starts.
