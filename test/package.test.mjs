import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

test("npm package contains every installation and removal file", () => {
  const cache = mkdtempSync(join(tmpdir(), "pipeline-hygiene-npm-"));
  const run = spawnSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: { ...process.env, npm_config_cache: cache }
  });
  rmSync(cache, { force: true, recursive: true });

  assert.equal(run.status, 0, run.stderr);
  const [manifest] = JSON.parse(run.stdout);
  const files = new Set(manifest.files.map((file) => file.path));
  for (const required of [
    "README.md",
    "LICENSE",
    "dist/pipeline_hygiene.deluge",
    "docs/INSTALL.md",
    "docs/REMOVE.md",
    "docs/TESTING.md",
    "docs/ADMIN_GUIDE.md",
    "docs/AGENT_INSTALL.md",
    "docs/END_TO_END_USER_TEST.md",
    "docs/PRIVACY.md",
    "docs/TERMS.md",
    "marketplace/submission.json",
    "marketplace/BUILD_IN_SIGMA.md",
    "marketplace/RELEASE_CHECKLIST.md",
    "marketplace/assets/icon-180.png",
    "marketplace/assets/thumbnail-740x340.png",
    "marketplace/assets/screenshot-1-digest.png",
    "agent-skill/SKILL.md",
    "agent-skill/agents/openai.yaml",
    "agent-skill/evals/pipeline-hygiene-cases.json",
    "sample/deals.json",
    "views/SAVED_VIEWS.md"
  ]) {
    assert.equal(files.has(required), true, `Package is missing ${required}`);
  }
});
