import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import test from "node:test";

const root = resolve(".");

function read(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function routes(skill, expectations) {
  const entrypoint = read(`skills/${skill}/SKILL.md`);
  for (const [trigger, reference] of expectations) {
    assert.match(entrypoint.toLowerCase(), new RegExp(trigger));
    if (reference) {
      assert.match(entrypoint, new RegExp(reference.replaceAll(".", "\\.")));
      assert.ok(existsSync(resolve(root, `skills/${skill}/${reference}`)), reference);
    }
  }
}

test("visual-design routes seven families without unconditional bulk loading", () => {
  routes("visual-design", [
    ["holistic", "references/interface-review.md"],
    ["accessibility", null],
    ["layout", null],
    ["writing", "references/writing.md"],
    ["color", null],
    ["typography", null],
    ["polish", null],
  ]);
  for (const reference of [
    "accessibility-focus-and-keyboard.md",
    "layout-grouping-and-alignment.md",
    "typography-spacing.md",
    "color-usage.md",
    "polish-icons.md",
  ]) {
    assert.ok(existsSync(resolve(root, `skills/visual-design/references/${reference}`)));
  }
  assert.match(read("skills/visual-design/SKILL.md"), /one domain at a time/i);
});

test("shadcn routes components, chat, registries, presets, CLI, and MCP", () => {
  routes("shadcn", [
    ["component", "rules/composition.md"],
    ["chat", "rules/chat.md"],
    ["registr", "registry.md"],
    ["preset", "cli.md"],
    ["cli", "cli.md"],
    ["mcp", "mcp.md"],
  ]);
  const router = read("skills/shadcn/SKILL.md");
  assert.match(router, /Never overwrite/i);
  assert.match(router, /rendered component/i);
});

test("codebase-architecture isolates Scan and Design modes", () => {
  const router = read("skills/codebase-architecture/SKILL.md");
  assert.match(router, /defaults to \*\*Scan\*\*/);
  assert.match(router, /remains read-only/);
  assert.match(router, /references\/html-report\.md/);
  assert.match(router, /references\/deepening\.md/);
  assert.match(router, /references\/design-it-twice\.md/);
  assert.match(router, /does not authorize implementation/i);
  assert.ok(!existsSync(resolve(root, "skills/improve-codebase-architecture")));
  assert.ok(!existsSync(resolve(root, "skills/codebase-design")));
});

test("explain-codebase exposes How, Why, and Teach without separate selectors", () => {
  const router = read("skills/explain-codebase/SKILL.md");
  assert.match(router, /\*\*How\*\*/);
  assert.match(router, /\*\*Why\*\*/);
  assert.match(router, /\*\*Teach\*\*/);
  assert.ok(!existsSync(resolve(root, "skills/how")));
  assert.ok(!existsSync(resolve(root, "skills/why")));
  assert.ok(!existsSync(resolve(root, "skills/teach")));
});

test("Poteto keeps selective domain modeling and evidence-based playbooks", () => {
  const router = read("skills/poteto-mode/SKILL.md");
  assert.match(router, /model-the-domain\.md/);
  assert.match(
    router.split("---", 3)[1],
    /Implement, fix, refactor, build, migrate, or optimize repository artifacts/i,
  );
  assert.match(router, /references\/orchestration-gates\.md/);
  assert.match(read("skills/poteto-mode/playbooks/feature.md"), /smallest structure/i);
  assert.match(read("skills/poteto-mode/playbooks/refactoring.md"), /Keep local code/i);
  assert.match(read("skills/poteto-mode/playbooks/bug-fix.md"), /proven mechanism/i);
  assert.match(read("skills/poteto-mode/playbooks/hillclimb.md"), /sensitive/i);
  assert.match(read("skills/poteto-mode/playbooks/perf-issue.md"), /performance-strategies\.md/);
  assert.match(read("skills/poteto-mode/playbooks/session-pickup.md"), /authoritative prior trail/i);
});

test("Poteto substantial-work gates restore Arena and judge without mechanical fan-out", () => {
  const bootstrap = read("codex/AGENTS.md");
  const router = read("skills/poteto-mode/SKILL.md");
  const gates = read("skills/poteto-mode/references/orchestration-gates.md");
  const arena = read("skills/arena/SKILL.md");

  assert.match(bootstrap, /Before the first implementation\s+tool call, load `poteto-mode`/i);
  assert.match(bootstrap, /implement, fix, refactor, build,\s+migrate, optimize/i);
  assert.match(bootstrap, /modify a repository artifact/i);
  assert.match(bootstrap, /except one-step\s+mechanical edits/i);
  assert.match(bootstrap, /alongside narrower domain skills/i);
  assert.match(bootstrap, /Skip\s+it for simple answers and read-only inspection/i);

  assert.match(router, /Poteto: <playbook>; subagents: <none\|judge\|arena\+judge>/i);
  assert.match(router, /whenever classification changes/i);
  assert.match(router, /three or more phases/i);
  assert.match(router, /spans two\s+subsystems/i);
  assert.match(router, /consequential API, ownership, persistence, concurrency,\s+or data-model decision/i);
  assert.match(router, /runs unattended, or reaches 30 minutes/i);
  assert.match(router, /immediately load `references\/orchestration-gates\.md`/i);
  assert.match(router, /Re-evaluate before completion/i);
  assert.match(gates, /three or more phases/i);
  assert.match(gates, /two or more subsystems/i);
  assert.match(gates, /consequential API, ownership, persistence, concurrency, or\s+data-model decision/i);
  assert.match(gates, /spawn one independent,\s+read-only judge/i);
  assert.match(gates, /Do not run Arena when there is no real\s+design fork/i);
  assert.match(gates, /Do not delegate mechanical work merely for throughput/i);
  assert.match(gates, /If the runtime lacks subagents/i);
  assert.match(gates, /do not claim independent review occurred/i);

  assert.match(arena, /spawn one blind,\s+read-only cross-judge/i);
  assert.match(arena, /Record your\s+scores before reading its verdict/i);
  assert.doesNotMatch(arena, /cross-judge when available/i);
  assert.match(arena, /report that gap instead of silently skipping review/i);
});

test("negative routes do not add unrelated unconditional dependencies", () => {
  assert.doesNotMatch(read("skills/visual-design/SKILL.md"), /shadcn|codebase-architecture/);
  assert.doesNotMatch(read("skills/shadcn/SKILL.md"), /accessibility-\*|typography-\*/);
  assert.doesNotMatch(read("skills/codebase-architecture/SKILL.md"), /frontend-design|visual-design/);
  assert.doesNotMatch(read("skills/poteto-mode/SKILL.md"), /always.*architect/i);
});

test("every repo skill has a lean entrypoint and valid OpenAI metadata", () => {
  const skillsRoot = resolve(root, "skills");
  const skillNames = readdirSync(skillsRoot).filter((name) =>
    existsSync(join(skillsRoot, name, "SKILL.md")),
  );
  assert.equal(skillNames.length, 23);

  for (const name of skillNames) {
    const entrypoint = read(`skills/${name}/SKILL.md`);
    assert.ok(entrypoint.trim().split(/\s+/).length <= 250, `${name} exceeds 250 words`);

    const metadata = read(`skills/${name}/agents/openai.yaml`);
    assert.match(metadata, /^  display_name: "[^"]+"$/m);
    assert.match(metadata, /^  short_description: ".{25,64}"$/m);
    assert.match(
      metadata,
      new RegExp(`^  default_prompt: ".*\\$${name.replaceAll("-", "\\-")}.*"$`, "m"),
    );
  }
});

test("design and review workflows do not acquire implementation authority", () => {
  const architect = read("skills/architect/SKILL.md");
  assert.match(architect, /design artifact, not implementation/i);
  assert.match(architect, /Do not edit production code/i);

  const figureItOut = read("skills/figure-it-out/SKILL.md");
  assert.match(figureItOut, /do not execute it/i);
  assert.match(figureItOut, /Do not create implementation commits/i);

  const blastRadius = read("skills/blast-radius/SKILL.md");
  assert.match(blastRadius, /read-only risk investigation/i);
  assert.match(blastRadius, /mark it unproven/i);
});

test("portable routes replace stale platform-only dependencies", () => {
  const groups = JSON.parse(read("skills/.groups.json"));
  const sharedPrompt = readdirSync(resolve(root, "skills/poteto-mode/playbooks"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => read(`skills/poteto-mode/playbooks/${name}`))
    .join("\n")
    .concat(read("skills/poteto-mode/references/plan.md"));

  for (const term of groups.forbidden_prompt_terms) {
    assert.doesNotMatch(sharedPrompt.toLowerCase(), new RegExp(term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(
    read("skills/react-engineering/SKILL.md"),
    /references\/composition-state-decouple-implementation\.md/,
  );
  assert.match(
    read("skills/motion/performance-audit/index.md"),
    /resources\/property-tiers\.json/,
  );
});

test("TypeScript guidance triggers on type safety rather than every TS file", () => {
  const skill = read("skills/typescript-best-practices/SKILL.md");
  assert.doesNotMatch(skill, /any \.ts or \.tsx/i);
  assert.match(skill, /project conventions/i);
  assert.match(skill, /justified local cast/i);
  assert.match(skill, /avoid brands for clear local values/i);
});

test("every selector advertises a focused positive route", () => {
  const routesBySkill = {
    "agent-browser": /browser automation/i,
    architect: /types, signatures, module boundaries/i,
    arena: /parallel candidates/i,
    "blast-radius": /could break beyond its diff/i,
    "codebase-architecture": /architecture improvements/i,
    commit: /git commits/i,
    "explain-codebase": /runtime flow/i,
    "figure-it-out": /auditable execution playbook/i,
    "frontend-design": /distinctive web interfaces/i,
    "gsap-best-practices": /GSAP/i,
    interrogate: /adversarial multi-model review/i,
    motion: /Motion or CSS animation/i,
    "motion-design": /interface motion/i,
    "poteto-mode": /scoped autonomy/i,
    "react-engineering": /React component composition/i,
    recall: /recent work/i,
    reflect: /active transcript/i,
    shadcn: /shadcn components/i,
    "show-me-your-work": /TSV decision trail/i,
    tdd: /regression tests/i,
    "typescript-best-practices": /TypeScript type design/i,
    "visual-design": /interface color/i,
    "web-design-guidelines": /review UI code/i,
  };

  for (const [name, trigger] of Object.entries(routesBySkill)) {
    assert.match(read(`skills/${name}/SKILL.md`).split("---", 3)[1], trigger, name);
  }
});

test("PR and browser workflows preserve authorization boundaries", () => {
  const openingPr = read("skills/poteto-mode/playbooks/opening-a-pr.md");
  assert.match(openingPr, /explicitly requests a PR/i);
  assert.match(openingPr, /explain the steps\s+without acting/i);
  assert.match(openingPr, /does not authorize fixing/i);
  assert.doesNotMatch(openingPr, /reset --hard|invoked at the end of every/i);

  const browser = read("skills/agent-browser/SKILL.md");
  assert.match(browser, /stop this workflow/i);
  assert.match(browser, /Do not substitute tools silently/i);
});
