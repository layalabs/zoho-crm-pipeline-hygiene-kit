export const RULE_ORDER = Object.freeze([
  "overdue_closing_date",
  "no_open_activity",
  "stale_last_activity",
  "missing_next_step",
  "missing_owner",
  "missing_amount"
]);

export const DEFAULT_OPTIONS = Object.freeze({
  staleDays: 14
});

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseDateOnly(value, fieldName) {
  if (typeof value !== "string" || !DATE_ONLY_PATTERN.test(value)) {
    throw new TypeError(`Invalid ${fieldName}: expected YYYY-MM-DD`);
  }

  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  const normalized = new Date(timestamp).toISOString().slice(0, 10);
  if (!Number.isFinite(timestamp) || normalized !== value) {
    throw new TypeError(`Invalid ${fieldName}: expected a real calendar date`);
  }
  return timestamp;
}

function parseDateTime(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`Invalid ${fieldName}: expected an ISO date-time`);
  }

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    throw new TypeError(`Invalid ${fieldName}: expected an ISO date-time`);
  }
  return timestamp;
}

function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

function normalizedOptions(options = {}) {
  const staleDays = options.staleDays ?? DEFAULT_OPTIONS.staleDays;
  if (!Number.isInteger(staleDays) || staleDays < 0) {
    throw new TypeError("Invalid staleDays: expected a non-negative integer");
  }
  return {
    asOfTimestamp: parseDateOnly(options.asOfDate, "asOfDate"),
    staleDays
  };
}

export function classifyDeal(deal, options = {}) {
  if (deal?.isClosed === true) {
    return null;
  }

  const { asOfTimestamp, staleDays } = normalizedOptions(options);
  const reasons = [];

  if (deal?.closingDate != null) {
    const closingTimestamp = parseDateOnly(deal.closingDate, "closingDate");
    if (closingTimestamp < asOfTimestamp) {
      reasons.push("overdue_closing_date");
    }
  }

  if (deal?.hasOpenActivity === false) {
    reasons.push("no_open_activity");
  }

  if (deal?.lastActivityAt != null) {
    const lastActivityTimestamp = parseDateTime(deal.lastActivityAt, "lastActivityAt");
    const staleBefore = asOfTimestamp - staleDays * 24 * 60 * 60 * 1000;
    if (lastActivityTimestamp < staleBefore) {
      reasons.push("stale_last_activity");
    }
  }

  if (isBlank(deal?.nextStep)) {
    reasons.push("missing_next_step");
  }

  if (isBlank(deal?.owner?.name) || isBlank(deal?.owner?.email)) {
    reasons.push("missing_owner");
  }

  if (deal?.amount == null) {
    reasons.push("missing_amount");
  }

  return { deal, reasons };
}

export function classifyDeals(deals, options = {}) {
  if (!Array.isArray(deals)) {
    throw new TypeError("Invalid deals: expected an array");
  }

  return deals
    .map((deal) => classifyDeal(deal, options))
    .filter((result) => result !== null && result.reasons.length > 0);
}
