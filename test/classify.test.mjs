import assert from "node:assert/strict";
import test from "node:test";

import { classifyDeal, classifyDeals } from "../src/classify.mjs";

const options = { asOfDate: "2026-11-01", staleDays: 14 };

function healthyDeal(overrides = {}) {
  return {
    id: "deal-1",
    name: "Website renewal",
    owner: { name: "Asha", email: "asha@example.com" },
    stage: "Negotiation",
    isClosed: false,
    closingDate: "2026-11-15",
    lastActivityAt: "2026-10-25T10:00:00Z",
    hasOpenActivity: true,
    nextStep: "Review the proposal",
    amount: 25000,
    ...overrides
  };
}

test("classifyDeal returns all hygiene reasons in specification order", () => {
  const deal = healthyDeal({
    closingDate: "2026-10-31",
    lastActivityAt: "2026-10-01T10:00:00Z",
    hasOpenActivity: false,
    nextStep: "  ",
    owner: null,
    amount: null
  });

  assert.deepEqual(classifyDeal(deal, options).reasons, [
    "overdue_closing_date",
    "no_open_activity",
    "stale_last_activity",
    "missing_next_step",
    "missing_owner",
    "missing_amount"
  ]);
});

test("classifyDeal does not report date values on their boundary", () => {
  const deal = healthyDeal({
    closingDate: "2026-11-01",
    lastActivityAt: "2026-10-18T00:00:00Z"
  });

  assert.deepEqual(classifyDeal(deal, options).reasons, []);
});

test("classifyDeal treats zero as a present amount", () => {
  const deal = healthyDeal({ amount: 0 });

  assert.equal(classifyDeal(deal, options).reasons.includes("missing_amount"), false);
});

test("classifyDeal ignores closed deals", () => {
  assert.equal(classifyDeal(healthyDeal({ isClosed: true }), options), null);
});

test("classifyDeals removes healthy and closed deals", () => {
  const unhealthy = healthyDeal({ id: "deal-2", nextStep: "" });
  const results = classifyDeals(
    [healthyDeal(), healthyDeal({ id: "closed", isClosed: true }), unhealthy],
    options
  );

  assert.deepEqual(results.map((result) => result.deal.id), ["deal-2"]);
});

for (const [label, deal, invalidOptions, message] of [
  ["report date", healthyDeal(), { ...options, asOfDate: "bad-date" }, "Invalid asOfDate"],
  ["closing date", healthyDeal({ closingDate: "31/10/2026" }), options, "Invalid closingDate"],
  ["last activity", healthyDeal({ lastActivityAt: "yesterday" }), options, "Invalid lastActivityAt"]
]) {
  test(`classifyDeal rejects an invalid ${label}`, () => {
    assert.throws(() => classifyDeal(deal, invalidOptions), new RegExp(message));
  });
}
