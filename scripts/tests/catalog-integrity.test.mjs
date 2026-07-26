import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  validateAgentMetadata,
  validatePromptIntegrity,
  validateRoutedCodePaths,
} from "../validate-skill-catalog.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "catalog-integrity-"));
  const skillRoot = join(root, "demo");
  mkdirSync(join(skillRoot, "agents"), { recursive: true });
  writeFileSync(
    join(skillRoot, "SKILL.md"),
    "---\nname: demo\ndescription: Use for demo validation.\n---\n\n# Demo\n",
  );
  writeFileSync(
    join(skillRoot, "agents/openai.yaml"),
    'interface:\n  display_name: "Demo"\n  short_description: "Validate a focused demo workflow"\n  default_prompt: "Use $demo to validate this fixture."\n',
  );
  return { root, skillRoot };
}

test("catalog integrity accepts complete OpenAI metadata", () => {
  const { root, skillRoot } = fixture();
  try {
    const errors = [];
    validateAgentMetadata(
      { name: "demo", path: join(skillRoot, "SKILL.md") },
      errors,
    );
    assert.deepEqual(errors, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("catalog integrity rejects missing routes, stale terms, and unknown skills", () => {
  const { root, skillRoot } = fixture();
  try {
    const entrypoint = join(skillRoot, "SKILL.md");
    writeFileSync(
      entrypoint,
      "---\nname: demo\ndescription: Use for demo validation.\n---\n\nRead `references/missing.md`, run the **missing** skill, then apply unslop.\n",
    );

    const errors = [];
    validateRoutedCodePaths(entrypoint, "demo", errors);
    validatePromptIntegrity(
      root,
      [{ name: "demo" }],
      { forbidden_prompt_terms: ["unslop"] },
      errors,
    );

    assert.ok(errors.some((error) => error.includes("missing routed path")));
    assert.ok(errors.some((error) => error.includes("unresolved skill reference missing")));
    assert.ok(errors.some((error) => error.includes("forbidden shared prompt term unslop")));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
