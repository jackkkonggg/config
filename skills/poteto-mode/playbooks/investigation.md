### Investigation

**You own the answer. Plan, route, write.**

Read-only requests: "how does X work?", "why was Y built this way?", "are we sure about Z?", "should we do X or Y?". They produce a cited explanation or a recommendation, not a code change.

1. Route through `explain-codebase`: How mode for runtime questions, Why mode
   for motivation, and Teach mode when both must form one walkthrough.
2. Produce a scoped evidence-backed explanation, or a recommendation with a
   tradeoffs table when the request compares alternatives.
3. Keep the reply concrete and concise; retain only evidence that changes the
   conclusion.

Do not open a PR or invoke `architect` unless the user separately requests a
design or code change. Hand a diagnosed issue back with the matching next
workflow.

**Reply:** the investigation output. For "are we sure?" answers, include your real judgment with reasons. Push back if the premise is wrong (see Autonomy).
