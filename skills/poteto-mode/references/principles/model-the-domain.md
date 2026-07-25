# Model the Domain

Use when stateful logic branches repeatedly or the same shape assumption is
spread across files.

Encode the domain in the smallest structure that removes duplicated rules or
invalid states:

- a state machine instead of synchronized booleans;
- a typed model instead of loose parameters;
- a table, registry, map, or discriminated union instead of repeated branches;
- a reducer or command model instead of ad hoc mutation;
- a queue, cache, index, graph, tree, or normalized collection when access
  patterns require it.

Do not force an abstraction. Keep boring local code when the current shape is
clear and unlikely to grow. A structure earns its place by deleting branches,
duplicated knowledge, invalid states, or lifecycle risk.
