import assert from "node:assert/strict";
import test from "node:test";

import { buildOwnerDigests } from "../src/digest.mjs";

function result(id, owner, name = `Deal ${id}`) {
  return {
    deal: {
      id,
      name,
      owner,
      stage: "Negotiation",
      closingDate: "2026-10-20",
      amount: 1000
    },
    reasons: ["overdue_closing_date"]
  };
}

test("buildOwnerDigests groups deals by owner and keeps an unassigned group", () => {
  const digests = buildOwnerDigests([
    result("1", { name: "Asha", email: "asha@example.com" }),
    result("2", { name: "Asha", email: "ASHA@example.com" }),
    result("3", null)
  ], { reportDate: "2026-11-01" });

  assert.deepEqual(digests.map(({ key, dealCount }) => [key, dealCount]), [
    ["asha@example.com", 2],
    ["unassigned", 1]
  ]);
});

test("buildOwnerDigests escapes customer data before it enters HTML", () => {
  const [digest] = buildOwnerDigests([
    result("1", { name: "Asha <Admin>", email: "asha@example.com" }, "Deal <script>alert(1)</script>")
  ], { reportDate: "2026-11-01" });

  assert.match(digest.html, /Asha &lt;Admin&gt;/);
  assert.match(digest.html, /Deal &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(digest.html, /<script>/);
});

test("buildOwnerDigests returns no digests for no findings", () => {
  assert.deepEqual(buildOwnerDigests([], { reportDate: "2026-11-01" }), []);
});
