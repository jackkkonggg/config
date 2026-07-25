---
name: codebase-design
description: Use to design deep modules, simplify interfaces, place seams, and improve locality, leverage, or testability.
---

# Codebase Design

Design modules that provide substantial behavior through a small interface.
Use the vocabulary below for this architecture exercise without overriding
established project terminology elsewhere:

- **Module:** implementation plus the interface callers must understand.
- **Interface:** signatures, invariants, ordering, errors, configuration, and
  performance facts exposed to callers.
- **Seam:** a place where behavior can vary without editing the caller.
- **Adapter:** an implementation occupying a seam.
- **Depth:** behavior delivered per unit of interface.
- **Leverage:** value callers receive from that depth.
- **Locality:** related change, knowledge, and verification concentrated
  together.

Apply the deletion test. A useful module concentrates complexity when removed;
a shallow wrapper merely moves it. Treat the interface as the test surface.
Do not introduce a seam for one hypothetical adapter.

Load `DEEPENING.md` when restructuring a dependency cluster. Load
`DESIGN-IT-TWICE.md` when several interface shapes are plausible and should be
compared independently.

Prefer boring local code when a new module would add indirection without
removing branches, duplicated rules, invalid states, or lifecycle risk.
