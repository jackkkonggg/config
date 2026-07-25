import assert from "node:assert/strict";
import {
  cpSync,
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

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function git(cwd, args) {
  const result = spawnSync("git", ["-C", cwd, ...args], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
}

test("direct vendor conflicts leave the skill, merge base, and source lock unchanged", () => {
  const root = mkdtempSync(join(tmpdir(), "vendor-sync-test-"));
  const worktree = `${root}-worktree`;
  try {
    git(root, ["init", "-q", "-b", "main"]);
    cpSync(resolve("scripts/vendor-sync.sh"), join(root, "scripts/vendor-sync.sh"));
    cpSync(resolve("scripts/worktree-lib.sh"), join(root, "scripts/worktree-lib.sh"));
    cpSync(resolve("scripts/lib.sh"), join(root, "scripts/lib.sh"));
    write(join(root, "vendor/source/SKILL.md"), "value: upstream one\n");
    write(join(root, ".vendor-state/pristine/demo/SKILL.md"), "value: upstream one\n");
    write(join(root, ".vendor-state/patches/demo.patch"), "existing patch\n");
    write(join(root, "skills/demo/SKILL.md"), "value: local edit\n");
    write(
      join(root, "skills/.vendor-manifest.json"),
      `${JSON.stringify({
        demo: { hash: "locked-before-update", vendor_path: "vendor/source" },
      })}\n`,
    );
    git(root, ["add", "."]);
    git(root, [
      "-c",
      "user.name=Test",
      "-c",
      "user.email=test@example.com",
      "commit",
      "-qm",
      "base",
    ]);
    git(root, ["worktree", "add", "-q", "-b", "test-update", worktree, "main"]);

    write(join(worktree, "vendor/source/SKILL.md"), "value: upstream two\n");
    const beforeSkill = readFileSync(join(worktree, "skills/demo/SKILL.md"), "utf8");
    const beforeBase = readFileSync(
      join(worktree, ".vendor-state/pristine/demo/SKILL.md"),
      "utf8",
    );
    const beforeManifest = readFileSync(
      join(worktree, "skills/.vendor-manifest.json"),
      "utf8",
    );
    const beforePatch = readFileSync(
      join(worktree, ".vendor-state/patches/demo.patch"),
      "utf8",
    );
    const result = spawnSync("bash", ["scripts/vendor-sync.sh", "demo"], {
      cwd: worktree,
      encoding: "utf8",
    });

    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stdout, /Update aborted/);
    assert.equal(readFileSync(join(worktree, "skills/demo/SKILL.md"), "utf8"), beforeSkill);
    assert.equal(
      readFileSync(join(worktree, ".vendor-state/pristine/demo/SKILL.md"), "utf8"),
      beforeBase,
    );
    assert.equal(
      readFileSync(join(worktree, "skills/.vendor-manifest.json"), "utf8"),
      beforeManifest,
    );
    assert.equal(
      readFileSync(join(worktree, ".vendor-state/patches/demo.patch"), "utf8"),
      beforePatch,
    );
  } finally {
    rmSync(worktree, { recursive: true, force: true });
    rmSync(root, { recursive: true, force: true });
  }
});
