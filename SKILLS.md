# Skills Inventory

This file lists the installable skills currently present under `skills/`.
Skills marked as patched have local modifications recorded under `.vendor-state/patches/`.
Import commands for vendor skills use this repo-owned `skills add` wrapper backed by the local `skills-cli/` copy. Local skills are maintained only in this repo.

Total skills: 31

Patched skills: 2

| Skill | Source | Patched | Import Command | Description |
|---|---|---|---|---|
| `agent-browser` | Vendor | No | `skills add vercel-labs/agent-browser --skill agent-browser` | Browser automation CLI for AI agents. Use when the user needs to interact with websites, including navigating pages, filling forms, clicking buttons, taking screenshots, extracting data, testing web apps, or automating any browser task. |
| `browse` | Vendor | No | `skills add garrytan/gstack --skill browse --full-depth` | Fast headless browser for QA testing and site dogfooding. Navigate any URL, interact with elements, verify page state, diff before/after actions, take annotated screenshots, check responsive layouts, test forms and uploads, handle dialogs, and assert element states. |
| `cc-commit` | Vendor | **Yes** - [patch](.vendor-state/patches/cc-commit.patch) | Extracted from `anthropics/claude-plugins-official`; no direct `skills add` install. | Create a git commit. |
| `code-audit` | Local | No | - | Structured codebase audit with auto-detection, relevant docs and skill loading, prioritized findings, and optional auto-fix. |
| `convex-best-practices` | Local | No | - | Convex backend rules for queries, mutations, actions, HTTP actions, schema, indexes, scheduling, file storage, and search. |
| `create-design-system-rules` | Vendor | No | `skills add figma/mcp-server-guide --skill create-design-system-rules` | Generates custom design system rules for a codebase. Requires Figma MCP server connection. |
| `find-skills` | Vendor | No | `skills add vercel-labs/skills --skill find-skills` | Helps users discover and install agent skills when they ask how to do something or whether a skill exists. |
| `frontend-design` | Vendor | **Yes** - [patch](.vendor-state/patches/frontend-design.patch) | `skills add anthropics/skills --skill frontend-design` | Create distinctive, production-grade frontend interfaces with high design quality for pages, components, artifacts, and web apps. |
| `grammy-best-practices` | Local | No | - | grammY Telegram bot framework patterns for middleware, commands, sessions, conversations, API transformers, files/media, reliability, and deployment. |
| `gsap-best-practices` | Local | No | - | GSAP animation rules for tweens, timelines, ScrollTrigger, matchMedia, plugin usage, utilities, and performance. |
| `implement-design` | Vendor | No | `skills add figma/mcp-server-guide --skill implement-design` | Translates Figma designs into production-ready code with 1:1 visual fidelity. Requires Figma MCP server connection. |
| `motion-react-best-practices` | Local | No | - | Motion React rules for animations, gestures, scroll-linked effects, layout transitions, presence, accessibility, and performance. |
| `next-best-practices` | Vendor | No | `skills add vercel-labs/next-skills --skill next-best-practices` | Next.js best practices for file conventions, RSC boundaries, data patterns, async APIs, metadata, route handlers, images, fonts, and bundling. |
| `plan-ceo-review` | Vendor | No | `skills add garrytan/gstack --skill plan-ceo-review --full-depth` | CEO/founder-mode plan review for rethinking a problem, challenging premises, and choosing whether to expand, hold, or reduce scope. |
| `plan-eng-review` | Vendor | No | `skills add garrytan/gstack --skill plan-eng-review --full-depth` | Engineering-manager-mode plan review for architecture, data flow, edge cases, tests, performance, and execution readiness. |
| `qa` | Vendor | No | `skills add garrytan/gstack --skill qa --full-depth` | Systematically QA test a web application, fix bugs, re-verify, and produce ship-readiness evidence. |
| `react-doctor` | Local | No | - | Run after React changes to catch security, performance, correctness, and architecture issues early. |
| `react-gsap-best-practices` | Local | No | - | React and GSAP lifecycle-safe patterns for `useGSAP`, `contextSafe`, dependency-driven updates, ScrollTrigger, and SSR. |
| `remotion-best-practices` | Vendor | No | `skills add remotion-dev/skills --skill remotion-best-practices --path skills/remotion` | Best practices for creating videos in React with Remotion. |
| `retro` | Vendor | No | `skills add garrytan/gstack --skill retro --full-depth` | Weekly engineering retrospective using commit history, work patterns, code quality metrics, and persistent trend tracking. |
| `review` | Vendor | No | `skills add garrytan/gstack --skill review --full-depth` | Pre-landing PR review for diffs, SQL safety, LLM trust boundaries, conditional side effects, and structural issues. |
| `setup-browser-cookies` | Vendor | No | `skills add garrytan/gstack --skill setup-browser-cookies --full-depth` | Import cookies from a real browser into the headless browse session for authenticated QA or browser automation. |
| `shadcn` | Vendor | No | `skills add shadcn/ui --skill shadcn` | shadcn/ui guidance for adding, searching, fixing, debugging, styling, and composing UI components. |
| `ship` | Vendor | No | `skills add garrytan/gstack --skill ship --full-depth` | Ship workflow for detecting the base branch, running tests, reviewing diffs, bumping version, updating changelog, committing, pushing, and creating PRs. |
| `swift-best-practices` | Local | No | - | Swift best practices for naming, types, error handling, protocols, memory management, performance, and modern patterns. |
| `swift-concurrency` | Vendor | No | `skills add avdlee/swift-concurrency-agent-skill --skill swift-concurrency` | Swift Concurrency guidance for async/await, actors, task patterns, Sendable, data races, thread safety, and Swift 6 migration. |
| `swiftui-expert-skill` | Vendor | No | `skills add avdlee/swiftui-agent-skill --skill swiftui-expert-skill` | SwiftUI best practices for state management, view composition, performance, macOS APIs, and Liquid Glass adoption. |
| `typescript-clean-code` | Local | No | - | Clean Code principles adapted for TypeScript, including naming, functions, types, errors, modules, tests, comments, and code smells. |
| `vercel-composition-patterns` | Vendor | No | `skills add vercel-labs/agent-skills --skill vercel-composition-patterns --path skills/composition-patterns` | React composition patterns that scale, including compound components, render props, context providers, flexible APIs, and React 19 changes. |
| `vercel-react-best-practices` | Vendor | No | `skills add vercel-labs/agent-skills --skill vercel-react-best-practices --path skills/react-best-practices` | React and Next.js performance optimization guidelines from Vercel Engineering. |
| `web-design-guidelines` | Vendor | No | `skills add vercel-labs/agent-skills --skill web-design-guidelines` | Web interface guidelines for UI review, accessibility checks, UX audits, and design quality. |
