import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = resolve("scripts/composite-sync.mjs");

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "composite-sync-test-"));
  write(join(root, "vendor/source/skill/imported.md"), "upstream one\n");
  write(join(root, "vendor/source/skill/SKILL.md"), "router one\n");
  write(join(root, "skills/group/reference.md"), "upstream one\n");
  write(join(root, "skills/group/SKILL.md"), "custom router\n");
  write(
    join(root, "skills/.composites.json"),
    `${JSON.stringify({
      version: 1,
      composites: {
        group: {
          ownership: "test",
          sources: [
            {
              id: "source",
              vendor_root: "vendor/source",
              source_root: "skill",
              imports: [{ from: "imported.md", to: "reference.md" }],
              watches: [{ from: "SKILL.md", adapter: "SKILL.md" }],
            },
          ],
        },
      },
    })}\n`,
  );
  write(join(root, "skills/.provenance.json"), '{"version":2,"composites":{}}\n');
  spawnSync("git", ["init", "-q", join(root, "vendor/source")]);
  spawnSync("git", ["-C", join(root, "vendor/source"), "add", "."]);
  spawnSync(
    "git",
    [
      "-C",
      join(root, "vendor/source"),
      "-c",
      "user.name=Test",
      "-c",
      "user.email=test@example.com",
      "commit",
      "-qm",
      "base",
    ],
  );
  return root;
}

function run(root, mode) {
  return spawnSync("node", [script, mode, "--json"], {
    env: { ...process.env, SKILLS_REPO_ROOT: root },
    encoding: "utf8",
  });
}

test("imports merge while watched routers stop and unmapped files fail", () => {
  const root = fixture();
  try {
    assert.equal(run(root, "initialize").status, 0);

    write(join(root, "vendor/source/skill/imported.md"), "upstream two\n");
    const merged = run(root, "sync");
    assert.equal(merged.status, 0, merged.stderr);
    assert.equal(readFileSync(join(root, "skills/group/reference.md"), "utf8"), "upstream two\n");
    assert.equal(readFileSync(join(root, "skills/group/SKILL.md"), "utf8"), "custom router\n");

    write(join(root, "vendor/source/skill/SKILL.md"), "router two\n");
    const watched = run(root, "sync");
    assert.equal(watched.status, 1);
    assert.match(watched.stdout, /manual adapter review required/);
    assert.equal(readFileSync(join(root, "skills/group/SKILL.md"), "utf8"), "custom router\n");

    write(join(root, "vendor/source/skill/unmapped.md"), "new file\n");
    const unmapped = run(root, "check");
    assert.equal(unmapped.status, 1);
    assert.match(unmapped.stdout, /unmapped upstream file/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
