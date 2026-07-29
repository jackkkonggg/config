---
name: agent-browser
description: Use when explicitly asked for agent-browser CLI or its Electron, Slack, HAR-client, AgentCore, Vercel Sandbox, or dogfood workflows.
---

# Agent Browser

For ordinary navigation, screenshots, local web testing, and UI QA, use
`browser:control-in-app-browser` when available. Use this skill only when the
user explicitly requests agent-browser CLI or needs a specialized workflow
below.

Use the installed `agent-browser` CLI. If it is unavailable, report the missing
prerequisite; do not install global packages without explicit permission.

Load version-matched instructions before acting:

```bash
agent-browser skills get core
```

Use `--full` only when the compact guide lacks a needed command. Load one
specialized guide when required:

- `electron` for desktop apps;
- `slack` for Slack automation;
- `dogfood` for exploratory QA;
- `derive-client` for HAR-based API clients;
- `vercel-sandbox` or `agentcore` for those hosted environments.

Discover other installed guides with `agent-browser skills list`. Follow the
loaded guide, preserve session and authentication boundaries, and verify the
requested result on the visible or returned artifact.

If the CLI is absent, stop this workflow, name the missing prerequisite, and
ask whether the user wants to authorize installation or choose another
available browser workflow. Do not substitute tools silently.
