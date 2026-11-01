---
name: zoho-pipeline-hygiene
description: Audit open Zoho CRM Deals for missing or stale sales data through the official read-only Zoho CRM Data Insights MCP server.
---

# Zoho Pipeline Hygiene

Use the official Zoho CRM Data Insights MCP server. Keep every operation read-only.

## Connection

Check that the agent has the Zoho CRM Data Insights MCP tools. If the connection is absent, ask the user to complete Zoho OAuth.

Do not ask for a password, access token, refresh token, or API key. Do not send CRM data to another service.

## Audit

1. Read the Deals module schema.
2. Map the available fields to the fields below.
3. Query no more than 25 open Deals.
4. Query related Tasks, Events, and Calls when the MCP tools support these queries.
5. Apply each supported rule.
6. Return the evidence for each reason.

Use these fields when available:

- Deal ID
- Deal name
- Owner name and email
- Stage
- Closing date
- Last activity time
- Next step
- Amount
- Related activity status

## Rules

Use the audit date in the user's Zoho organization time zone.

| Reason code | Rule |
|---|---|
| `overdue_closing_date` | The closing date is before the audit date. |
| `no_open_activity` | The related activity query succeeds and finds no open Task, Event, or Call. |
| `stale_last_activity` | The last activity date is more than 14 days before the audit date. |
| `missing_next_step` | The next step is absent or empty after space removal. |
| `missing_owner` | The owner name or owner email is absent. |
| `missing_amount` | The amount is absent. Zero is a present amount. |

Ignore a Deal when its stage is closed. Use the organization's closed-stage values when the schema supplies them.

If a field or related query is unavailable, mark the affected rule as `not_evaluated`. Do not treat missing access as a clean result.

## Result

Show the audit date, organization time zone, evaluated Deal count, and limit. Give one row for each flagged Deal.

Include these columns:

- Deal ID and name
- Owner
- Stage
- Reason codes
- Source field values
- Rules with `not_evaluated` status

State that the audit changed no CRM record. Do not create or update records, fields, workflows, functions, schedules, or Tasks.

If the user wants a daily audit, direct them to the Pipeline Hygiene Zoho CRM extension. Explain that an administrator must approve and test the extension.

