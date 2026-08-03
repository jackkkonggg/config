# Performance and MCP

## Performance

Measure before optimizing. Establish a representative benchmark or profile,
then change the actual bottleneck. Common candidates are unnecessary clones,
intermediate allocations, repeated parsing, poor collection choice, blocking
I/O, and contention. Re-check correctness and the measured result after each
change; an allocation-free implementation is not automatically faster or
clearer.

## MCP servers

Before building an MCP server, read the current official `rmcp` and MCP
transport documentation. Match the project's installed `rmcp` major version;
do not copy a pinned SDK version from an old scaffold or add `rmcp-macros`
separately when the selected SDK already re-exports its macros.

Use stdio for local subprocess servers. For networked servers, prefer
Streamable HTTP for new deployments; use legacy HTTP+SSE only when explicit
client compatibility requires it. Keep protocol output separate from logs,
validate tool inputs, return structured errors, and test the transport and
each exposed tool.
