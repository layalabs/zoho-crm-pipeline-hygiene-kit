import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { generateDeluge } from "../src/generate-deluge.mjs";

test("generateDeluge uses safe first-release defaults", () => {
  const source = generateDeluge();

  assert.match(source, /void schedule\.pipeline_hygiene_digest\(\)/);
  assert.match(source, /createFollowUpTasks = false;/);
  assert.match(source, /maxDeals = 25;/);
  assert.match(source, /staleDays = 14;/);
  assert.match(source, /queryMap\.put\("fields","id,Deal_Name,Owner,Stage,Closing_Date,Last_Activity_Time,Next_Step,Amount"\);/);
  assert.match(source, /zoho\.crm\.v8\.getRecords\("Deals",queryMap,1,maxDeals\)/);
  assert.match(source, /taskQuery\.put\("fields","id,Status"\);/);
  assert.match(source, /eventQuery\.put\("fields","id,Event_Status"\);/);
  assert.match(source, /callQuery\.put\("fields","id,Call_Status"\);/);
  assert.match(source, /zoho\.crm\.v8\.getRelatedRecords\("Tasks","Deals",dealId,taskQuery,1,200\)/);
  assert.match(source, /zoho\.crm\.v8\.getRelatedRecords\("Events","Deals",dealId,eventQuery,1,200\)/);
  assert.match(source, /zoho\.crm\.v8\.getRelatedRecords\("Calls","Deals",dealId,callQuery,1,200\)/);
});

test("generateDeluge sends no email while the extension is disabled", () => {
  const source = generateDeluge();

  assert.match(source, /zoho\.crm\.getOrgVariable\("layalabspipelinehygiene__Enabled"\)/);
  assert.match(source, /if\(extensionEnabled == "true"\)/);
  assert.ok(source.indexOf('if(extensionEnabled == "true")') < source.indexOf("sendmail"));
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

test("generateDeluge escapes all CRM and configured data before HTML output", () => {
  const source = generateDeluge();

  assert.match(source, /safeOwnerName = ownerName\.replaceAll\("&","&amp;"\)\.replaceAll\("<","&lt;"\)\.replaceAll\(">","&gt;"\);/);
  assert.match(source, /safeReasonLabel = reasonLabels\.get\(reason\)\.replaceAll\("&","&amp;"\)\.replaceAll\("<","&lt;"\)\.replaceAll\(">","&gt;"\);/);
  assert.match(source, /ownerNames\.put\(ownerEmail,safeOwnerName\);/);
  assert.match(source, /reasonText = reasonText \+ safeReasonLabel;/);
});

test("generateDeluge is deterministic and matches the committed artifact", async () => {
  const first = generateDeluge();
  const second = generateDeluge();
  const artifact = await readFile(new URL("../dist/pipeline_hygiene.deluge", import.meta.url), "utf8");

  assert.equal(first, second);
  assert.equal(artifact, first);
});
