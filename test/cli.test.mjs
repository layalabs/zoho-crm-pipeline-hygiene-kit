import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const cli = new URL("../src/cli.mjs", import.meta.url);
const sample = new URL("../sample/deals.json", import.meta.url);

test("command line writes a JSON hygiene report", () => {
  const run = spawnSync(process.execPath, [cli.pathname, sample.pathname, "--date", "2026-11-01"], {
    encoding: "utf8"
  });

  assert.equal(run.status, 0, run.stderr);
  const report = JSON.parse(run.stdout);
  assert.equal(report.reportDate, "2026-11-01");
  assert.equal(report.findingCount, 1);
  assert.deepEqual(report.digests.map((digest) => digest.key), ["asha@example.com"]);
});

test("command line rejects malformed JSON", () => {
  const directory = mkdtempSync(join(tmpdir(), "pipeline-hygiene-"));
  const badFile = join(directory, "bad.json");
  writeFileSync(badFile, "{bad", "utf8");

  const run = spawnSync(process.execPath, [cli.pathname, badFile, "--date", "2026-11-01"], {
    encoding: "utf8"
  });

  assert.equal(run.status, 1);
  assert.match(run.stderr, /Invalid input JSON/);
  assert.equal(run.stdout, "");
});
