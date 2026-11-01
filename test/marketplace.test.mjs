import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

function pngDimensions(buffer) {
  assert.equal(buffer.toString("ascii", 1, 4), "PNG");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test("Marketplace submission defines the public extension", async () => {
  const content = await readFile(new URL("../marketplace/submission.json", import.meta.url), "utf8");
  const submission = JSON.parse(content);

  assert.equal(submission.name, "Pipeline Hygiene for Zoho CRM");
  assert.equal(submission.namespace, "layalabspipelinehygiene");
  assert.equal(submission.pricing, "Free");
  assert.equal(submission.stores_personal_data, false);
  assert.equal(submission.custom_property.api_name, "Enabled");
  assert.equal(submission.custom_property.default_value, "false");
  assert.match(submission.limits, /25 deals/);
});

test("Marketplace policy and build documents exist", async () => {
  const urls = [
    "../docs/PRIVACY.md",
    "../docs/TERMS.md",
    "../docs/ADMIN_GUIDE.md",
    "../marketplace/BUILD_IN_SIGMA.md",
    "../marketplace/RELEASE_CHECKLIST.md"
  ];

  for (const url of urls) {
    const content = await readFile(new URL(url, import.meta.url), "utf8");
    assert.ok(content.length > 200, `${url} is too short`);
  }
});

test("Marketplace image assets use required dimensions", async () => {
  const icon = await readFile(new URL("../marketplace/assets/icon-180.png", import.meta.url));
  const thumbnail = await readFile(new URL("../marketplace/assets/thumbnail-740x340.png", import.meta.url));
  const screenshot = await readFile(new URL("../marketplace/assets/screenshot-1-digest.png", import.meta.url));

  assert.deepEqual(pngDimensions(icon), { width: 180, height: 180 });
  assert.deepEqual(pngDimensions(thumbnail), { width: 740, height: 340 });
  assert.deepEqual(pngDimensions(screenshot), { width: 1440, height: 900 });
});
