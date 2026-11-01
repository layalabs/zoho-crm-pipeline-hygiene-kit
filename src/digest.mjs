const REASON_LABELS = Object.freeze({
  overdue_closing_date: "Closing date is overdue",
  no_open_activity: "No open activity",
  stale_last_activity: "Last activity is stale",
  missing_next_step: "Next step is missing",
  missing_owner: "Owner is missing",
  missing_amount: "Amount is missing"
});

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function ownerKey(owner) {
  const email = owner?.email?.trim().toLowerCase();
  return email || "unassigned";
}

function digestHtml(group, reportDate) {
  const ownerName = escapeHtml(group.ownerName || "Unassigned deals");
  const rows = group.results.map(({ deal, reasons }) => {
    const labels = reasons.map((reason) => REASON_LABELS[reason] ?? reason).join(", ");
    return `<tr><td>${escapeHtml(deal.name)}</td><td>${escapeHtml(deal.stage)}</td><td>${escapeHtml(deal.closingDate)}</td><td>${escapeHtml(labels)}</td></tr>`;
  }).join("");

  return `<!doctype html><html><body><h1>Pipeline hygiene digest</h1><p>${ownerName}, these deals need attention on ${escapeHtml(reportDate)}.</p><table><thead><tr><th>Deal</th><th>Stage</th><th>Closing date</th><th>Reasons</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
}

export function buildOwnerDigests(results, { reportDate } = {}) {
  if (!Array.isArray(results)) {
    throw new TypeError("Invalid results: expected an array");
  }

  const groups = new Map();
  for (const result of results) {
    const key = ownerKey(result.deal.owner);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        ownerName: result.deal.owner?.name?.trim() || "",
        ownerEmail: key === "unassigned" ? "" : key,
        results: []
      });
    }
    groups.get(key).results.push(result);
  }

  return [...groups.values()]
    .sort((left, right) => {
      if (left.key === "unassigned") return 1;
      if (right.key === "unassigned") return -1;
      return left.key.localeCompare(right.key);
    })
    .map((group) => ({
      key: group.key,
      ownerName: group.ownerName,
      ownerEmail: group.ownerEmail,
      dealCount: group.results.length,
      html: digestHtml(group, reportDate)
    }));
}
