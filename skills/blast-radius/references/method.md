# Blast-radius method

## Proof levels

1. Assertion only.
2. Direct source evidence.
3. Traced failure path showing the bad case cannot reach the change.
4. Existing executable check against the real dependency or code.
5. Reproduction in the running artifact.

Push key facts as far down the list as is cheap. State where each stopped.

## Trace targets

Inventory every input and output boundary before selecting the key safety fact.
Look beyond symbol search:

- dependency source at the pinned version and local patches;
- scheduling, teardown, retries, and concurrency;
- serialized JSON, database columns, caches, and wire formats;
- generated code and configuration;
- downstream readers in another package, service, or language;
- feature flags and rollout state.

Rank confirmed risks by likelihood and impact. Keep checked-and-cleared risks
separate. A search that finds nothing is evidence only when its scope is named.

For a broad assessment, use `arena` only if independent perspectives are likely
to expose different consumers. Synthesize against repository evidence.
