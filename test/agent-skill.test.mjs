import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const REASON_CODES = [
  "overdue_closing_date",
  "no_open_activity",
  "stale_last_activity",
  "missing_next_step",
  "missing_owner",
  "missing_amount"
];

test("agent skill declares a read-only Zoho MCP audit", async () => {
  const skill = await readFile(new URL("../agent-skill/SKILL.md", import.meta.url), "utf8");

  assert.match(skill, /^---\nname: zoho-pipeline-hygiene/m);
  assert.match(skill, /Data Insights MCP/);
  assert.match(skill, /read-only/i);
  assert.match(skill, /not_evaluated/);
  assert.doesNotMatch(skill, /Data Operations MCP/);
  assert.doesNotMatch(skill, /Workflow.*Automation MCP/);
});

test("agent evals cover every hygiene reason and safe boundary", async () => {
  const content = await readFile(new URL("../agent-skill/evals/pipeline-hygiene-cases.json", import.meta.url), "utf8");
  const cases = JSON.parse(content);
  const reasons = new Set(cases.flatMap((entry) => entry.expected_reasons));

  assert.deepEqual([...reasons].sort(), [...REASON_CODES].sort());
  assert.ok(cases.some((entry) => entry.id === "healthy-deal" && entry.expected_reasons.length === 0));
  assert.ok(cases.some((entry) => entry.id === "closed-deal" && entry.expected_ignored === true));
  assert.ok(cases.some((entry) => entry.id === "zero-amount" && !entry.expected_reasons.includes("missing_amount")));
});

test("agent installation guide keeps Zoho OAuth with the user", async () => {
  const guide = await readFile(new URL("../docs/AGENT_INSTALL.md", import.meta.url), "utf8");

  assert.match(guide, /official Zoho CRM Data Insights MCP server/);
  assert.match(guide, /OAuth/);
  assert.match(guide, /does not receive.*token/is);
});
