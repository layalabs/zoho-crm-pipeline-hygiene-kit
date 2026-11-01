import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { generateDeluge } from "../src/generate-deluge.mjs";

test("generateDeluge uses safe first-release defaults", () => {
  const source = generateDeluge();

  assert.match(source, /createFollowUpTasks = false;/);
  assert.match(source, /maxDeals = 200;/);
  assert.match(source, /staleDays = 14;/);
  assert.match(source, /queryMap\.put\("fields","id,Deal_Name,Owner,Stage,Closing_Date,Last_Activity_Time,Next_Step,Amount"\);/);
  assert.match(source, /zoho\.crm\.v8\.getRecords\("Deals",1,maxDeals,queryMap\)/);
  assert.match(source, /zoho\.crm\.v8\.getRelatedRecords\("Tasks","Deals",dealId,1,200,Map\(\)\)/);
  assert.match(source, /zoho\.crm\.v8\.getRelatedRecords\("Events","Deals",dealId,1,200,Map\(\)\)/);
  assert.match(source, /zoho\.crm\.v8\.getRelatedRecords\("Calls","Deals",dealId,1,200,Map\(\)\)/);
});

test("generateDeluge rejects a record limit above the tested maximum", () => {
  assert.throws(() => generateDeluge({ maxDeals: 201 }), /maxDeals must be between 1 and 200/);
});

test("generateDeluge escapes configured reason labels", () => {
  const source = generateDeluge({
    reasonLabels: { missing_next_step: 'Next step says "later"' }
  });

  assert.match(source, /Next step says \\"later\\"/);
  assert.doesNotMatch(source, /Next step says "later"/);
});

test("generateDeluge is deterministic and matches the committed artifact", async () => {
  const first = generateDeluge();
  const second = generateDeluge();
  const artifact = await readFile(new URL("../dist/pipeline_hygiene.deluge", import.meta.url), "utf8");

  assert.equal(first, second);
  assert.equal(artifact, first);
});
