---
name: interrogate
description: Use for adversarial multi-model review, stress testing, challenges, and finding blind spots.
---

# Interrogate

Stress-test an artifact before committing to it.

1. State what is being reviewed, the decision it supports, and the strongest
   relevant evidence.
2. Select independent reviewers through agent configuration. Use different
   model families or review lenses when available.
3. Give reviewers the same artifact and ask them to identify:
   - hidden assumptions and missing evidence;
   - scope, safety, compatibility, and verification risks;
   - simpler alternatives;
   - the strongest argument against the current direction.
4. Run reviewers in parallel without write access to the artifact.
5. Synthesize findings by evidence, not vote count. Resolve contradictions,
   reject unsupported objections, and retain actionable risks with concrete
   mitigations.
6. Re-review only when the artifact changes materially.

**Reply:** accepted challenges, rejected challenges with reasons, remaining
uncertainty, and the resulting decision.
