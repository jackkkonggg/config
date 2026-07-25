import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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
  assert.match(read("skills/poteto-mode/playbooks/feature.md"), /smallest structure/i);
  assert.match(read("skills/poteto-mode/playbooks/refactoring.md"), /Keep local code/i);
  assert.match(read("skills/poteto-mode/playbooks/bug-fix.md"), /proven mechanism/i);
  assert.match(read("skills/poteto-mode/playbooks/hillclimb.md"), /sensitive/i);
  assert.match(read("skills/poteto-mode/playbooks/perf-issue.md"), /performance-strategies\.md/);
  assert.match(read("skills/poteto-mode/playbooks/session-pickup.md"), /authoritative prior trail/i);
});

test("negative routes do not add unrelated unconditional dependencies", () => {
  assert.doesNotMatch(read("skills/visual-design/SKILL.md"), /shadcn|codebase-architecture/);
  assert.doesNotMatch(read("skills/shadcn/SKILL.md"), /accessibility-\*|typography-\*/);
  assert.doesNotMatch(read("skills/codebase-architecture/SKILL.md"), /frontend-design|visual-design/);
  assert.doesNotMatch(read("skills/poteto-mode/SKILL.md"), /always.*architect|always.*delegate/i);
});
