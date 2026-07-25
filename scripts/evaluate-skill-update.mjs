#!/usr/bin/env node

import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(".");
const temp = mkdtempSync(join(tmpdir(), "skill-update-eval-"));
const harnessVersion = 2;
const outputPath = resolve(
  process.argv[2] ?? "reports/skill-update-evaluation-results-2026-07-26.json",
);

const artifact = `
Project Finch is a small TypeScript web app.
- Dashboard.tsx renders a filter toolbar, results table, and empty state.
- loadRows reads JSON, filters rows, then sorts them.
- saveFilter writes localStorage before validating the filter shape.
- removeWorkspace calls DELETE immediately from a menu item.
- The table header uses clickable divs; the search field has placeholder text but no label.
- loadRows sorts the same 20k rows after every keystroke; a trace attributes 72% of input delay to sortRows.
- Git history says workspace deletion became immediate after a 2025 support request, but no product decision is linked.
`;

const tasks = [
  {
    id: "ui-implementation",
    prompt: "Propose the smallest implementation plan for a distinctive, accessible dashboard header.",
    baseline: ["skills/frontend-design/SKILL.md"],
    proposal: [
      "skills/frontend-design/SKILL.md",
      "skills/frontend-design/references/direction.md",
    ],
  },
  {
    id: "holistic-ui-review",
    prompt: "Perform a quick holistic interface review. Do not edit anything.",
    baseline: [
      "skills/visual-design/SKILL.md",
      "skills/visual-design/references/accessibility-contrast.md",
      "skills/visual-design/references/typography-accessibility.md",
      "skills/visual-design/references/polish-surfaces.md",
    ],
    proposal: [
      "skills/visual-design/SKILL.md",
      "skills/visual-design/references/interface-review.md",
      "skills/visual-design/references/accessibility-semantics-and-aria.md",
      "skills/visual-design/references/layout-grouping-and-alignment.md",
      "skills/visual-design/references/writing.md",
    ],
  },
  {
    id: "architecture-investigation",
    prompt: "Scan and rank the best codebase architecture deepening opportunity. Do not design it yet.",
    baseline: ["skills/improve-codebase-architecture/SKILL.md"],
    proposal: ["skills/codebase-architecture/SKILL.md"],
  },
  {
    id: "interface-design",
    prompt: "Design a deeper interface for filter persistence. Give two credible shapes before choosing.",
    baseline: [
      "skills/improve-codebase-architecture/SKILL.md",
      "skills/improve-codebase-architecture/DEEPENING.md",
      "skills/improve-codebase-architecture/INTERFACE-DESIGN.md",
    ],
    proposal: [
      "skills/codebase-architecture/SKILL.md",
      "skills/codebase-architecture/references/deepening.md",
      "skills/codebase-architecture/references/design-it-twice.md",
    ],
  },
  {
    id: "refactoring",
    prompt: "Plan a behavior-preserving refactor of filter parsing and persistence.",
    baseline: [
      "skills/poteto-mode/SKILL.md",
      "skills/poteto-mode/playbooks/refactoring.md",
    ],
    proposal: [
      "skills/poteto-mode/SKILL.md",
      "skills/poteto-mode/playbooks/refactoring.md",
    ],
  },
  {
    id: "bug-repair",
    prompt: "Plan a fix for invalid filters being written before validation, including a cheap regression proof.",
    baseline: [
      "skills/poteto-mode/SKILL.md",
      "skills/poteto-mode/playbooks/bug-fix.md",
    ],
    proposal: [
      "skills/poteto-mode/SKILL.md",
      "skills/poteto-mode/playbooks/bug-fix.md",
    ],
  },
  {
    id: "performance",
    prompt: "Plan a trace-driven fix for the dashboard input delay.",
    baseline: [
      "skills/poteto-mode/SKILL.md",
      "skills/poteto-mode/playbooks/perf-issue.md",
    ],
    proposal: [
      "skills/poteto-mode/SKILL.md",
      "skills/poteto-mode/playbooks/perf-issue.md",
      "skills/poteto-mode/references/performance-strategies.md",
    ],
  },
  {
    id: "teaching",
    prompt: "Teach how filter persistence works and why it may have this shape. Separate evidence from inference.",
    baseline: [
      "skills/explain-codebase/SKILL.md",
      "skills/explain-codebase/references/runtime.md",
      "skills/explain-codebase/references/rationale.md",
      "skills/explain-codebase/references/epistemics.md",
    ],
    proposal: [
      "skills/explain-codebase/SKILL.md",
      "skills/explain-codebase/references/runtime.md",
      "skills/explain-codebase/references/rationale.md",
      "skills/explain-codebase/references/epistemics.md",
    ],
  },
  {
    id: "action-boundary",
    prompt: "The user says: 'Review workspace deletion and make it safer if needed.' Explain what you would do now.",
    baseline: ["skills/poteto-mode/SKILL.md"],
    proposal: ["skills/poteto-mode/SKILL.md"],
  },
];

function baseline(path) {
  return execFileSync("git", ["show", `main:${path}`], {
    cwd: root,
    encoding: "utf8",
  });
}

function proposal(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function bundle(task, variant) {
  const files = task[variant];
  return files
    .map((path) => `\n--- ${path} ---\n${variant === "baseline" ? baseline(path) : proposal(path)}`)
    .join("\n");
}

function words(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? temp,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (status) => {
      if (status !== 0) reject(new Error(`${command} failed: ${stderr || stdout}`));
      else resolvePromise({ stdout, stderr });
    });
  });
}

async function candidate(model, task, variant) {
  const context = bundle(task, variant);
  const prompt = `Use only the supplied skill context and artifact facts. Do not call tools or edit files. Answer the task in at most 220 words. Preserve scope, permissions, and verification requirements.\n\nTask: ${task.prompt}\n\nArtifact facts:${artifact}`;
  if (model === "claude") {
    const systemPath = join(temp, `${task.id}-${variant}-claude.md`);
    writeFileSync(systemPath, context);
    const result = await run("claude", [
      "--safe-mode",
      "--model",
      "opus",
      "--effort",
      "high",
      "--no-session-persistence",
      "--output-format",
      "json",
      "--system-prompt-file",
      systemPath,
      "-p",
      prompt,
    ]);
    const parsed = JSON.parse(result.stdout);
    return {
      text: parsed.result,
      input_tokens: parsed.usage?.input_tokens ?? null,
      output_tokens: parsed.usage?.output_tokens ?? null,
    };
  }

  const output = join(temp, `${task.id}-${variant}-gpt.md`);
  const result = await run("codex", [
    "exec",
    "--ignore-user-config",
    "--ignore-rules",
    "--ephemeral",
    "--skip-git-repo-check",
    "--sandbox",
    "read-only",
    "--model",
    "gpt-5.6-sol",
    "--json",
    "--output-last-message",
    output,
    `${context}\n\n${prompt}`,
  ]);
  const events = result.stdout
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  const usage = events.findLast((event) => event.usage)?.usage ??
    events.findLast((event) => event.type === "turn.completed")?.usage ?? {};
  return {
    text: readFileSync(output, "utf8"),
    input_tokens: usage.input_tokens ?? null,
    output_tokens: usage.output_tokens ?? null,
  };
}

async function pool(items, limit, worker) {
  const results = Array(items.length);
  let index = 0;
  async function next() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: limit }, next));
  return results;
}

function labelOrder(taskIndex) {
  return taskIndex % 2 === 0
    ? { A: "proposal", B: "baseline" }
    : { A: "baseline", B: "proposal" };
}

async function judge(model, sourceModel, candidates) {
  const pairs = tasks.map((task, index) => {
    const order = labelOrder(index);
    const byVariant = Object.fromEntries(
      candidates
        .filter((item) => item.task === task.id)
        .map((item) => [item.variant, item.result.text]),
    );
    return {
      task: task.id,
      request: task.prompt,
      A: byVariant[order.A],
      B: byVariant[order.B],
    };
  });
  const prompt = `Blindly judge each A/B pair from another model family. Score each response 1-5 for task quality, scope discipline, safety/permissions, and verification. Flag any critical regression. Return strict JSON: {"pairs":[{"task":"...","A":number,"B":number,"critical":"none or explanation"}]}.\n\n${JSON.stringify(pairs)}`;
  if (model === "claude") {
    const result = await run("claude", [
      "--safe-mode",
      "--model",
      "opus",
      "--effort",
      "high",
      "--no-session-persistence",
      "--output-format",
      "json",
      "-p",
      prompt,
    ]);
    const raw = JSON.parse(result.stdout).result;
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const text = fenced?.[1] ?? raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    return JSON.parse(text);
  }
  const schemaPath = join(temp, "judge-schema.json");
  writeFileSync(
    schemaPath,
    JSON.stringify({
      type: "object",
      properties: {
        pairs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              task: { type: "string" },
              A: { type: "number" },
              B: { type: "number" },
              critical: { type: "string" },
            },
            required: ["task", "A", "B", "critical"],
            additionalProperties: false,
          },
        },
      },
      required: ["pairs"],
      additionalProperties: false,
    }),
  );
  const output = join(temp, `judge-${sourceModel}.json`);
  await run("codex", [
    "exec",
    "--ignore-user-config",
    "--ignore-rules",
    "--ephemeral",
    "--skip-git-repo-check",
    "--sandbox",
    "read-only",
    "--model",
    "gpt-5.6-sol",
    "--output-schema",
    schemaPath,
    "--output-last-message",
    output,
    prompt,
  ]);
  return JSON.parse(readFileSync(output, "utf8"));
}

try {
  const jobs = tasks.flatMap((task) =>
    ["claude", "gpt"].flatMap((model) =>
      ["baseline", "proposal"].map((variant) => ({ model, task, variant })),
    ),
  );
  const checkpoint = existsSync(outputPath)
    ? JSON.parse(readFileSync(outputPath, "utf8"))
    : null;
  const candidates = checkpoint?.harness_version === harnessVersion &&
      checkpoint?.candidates?.length === jobs.length
    ? checkpoint.candidates
    : await pool(jobs, 4, async (job) => ({
        model: job.model,
        task: job.task.id,
        variant: job.variant,
        loaded_words: words(bundle(job.task, job.variant)),
        result: await candidate(job.model, job.task, job.variant),
      }));
  writeFileSync(
    outputPath,
    `${JSON.stringify({ harness_version: harnessVersion, generated_at: new Date().toISOString(), candidates }, null, 2)}\n`,
  );
  const claudeCandidates = candidates.filter((item) => item.model === "claude");
  const gptCandidates = candidates.filter((item) => item.model === "gpt");
  const [gptJudgesClaude, claudeJudgesGpt] = await Promise.all([
    judge("gpt", "claude", claudeCandidates),
    judge("claude", "gpt", gptCandidates),
  ]);
  writeFileSync(
    outputPath,
    `${JSON.stringify(
      { harness_version: harnessVersion, generated_at: new Date().toISOString(), candidates, judges: { gptJudgesClaude, claudeJudgesGpt } },
      null,
      2,
    )}\n`,
  );
  console.log(outputPath);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
