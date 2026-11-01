# Zoho CRM Pipeline Hygiene Kit Design

## Intent

This project gives small Zoho CRM teams one daily list of deals that need attention. It reduces repeated manual searches in deal views.

The first release is a public beta. A buyer installs a generated Deluge function and follows the saved-view recipes.

## Goals

- Find open deals with an overdue closing date.
- Find open deals with no open activity.
- Find open deals with old activity.
- Find open deals with no next step.
- Find open deals with no owner or amount.
- Send one HTML digest for each owner.
- Keep task creation disabled by default.
- Give a local test harness with sample data.

## Non-goals

- This release is not a Zoho Marketplace extension.
- This release does not include OAuth setup or an external service.
- This release does not use AI.
- This release does not change deal fields.
- This release does not claim a live Zoho test without an authenticated test account.

## Users

The primary user is a Zoho CRM administrator for a small sales team. The digest recipient is a deal owner or sales manager.

## Rules

The engine ignores a deal when `isClosed` is true. It reports one or more reason codes for each other deal.

| Reason code | Rule |
|---|---|
| `overdue_closing_date` | `closingDate` is before the report date. |
| `no_open_activity` | `hasOpenActivity` is false. |
| `stale_last_activity` | `lastActivityAt` exists and is older than the configured limit. |
| `missing_next_step` | `nextStep` is empty after trimming. |
| `missing_owner` | The owner name or owner email is empty. |
| `missing_amount` | `amount` is null. Zero remains a valid amount. |

The default stale limit is 14 days. The default report date comes from the command line or Zoho current date.

The digest groups deals by owner email. It puts deals without an owner in the `unassigned` group.

The generated function reads up to 200 open deals in the first release. The guide states this limit.

## Approaches

### Manual configuration only

This option has no executable logic. It is easy to publish, but it cannot produce one consistent digest.

### Node.js function only

This option is easy to test. It adds an external runtime and a harder installation path for a small Zoho team.

### Generated Deluge plus a JavaScript reference engine

This option keeps installation inside Zoho CRM. The JavaScript engine gives deterministic local tests and generates the Deluge artifact.

This is the selected approach. It gives a simple install path and test evidence without a live Zoho account.

## Architecture

`src/classify.mjs` classifies normalized deal records. `src/digest.mjs` makes the owner digests.

`src/generate-deluge.mjs` generates `dist/pipeline_hygiene.deluge`. The generated function contains the same rule values and reason labels.

`src/cli.mjs` runs the reference engine on JSON data. Tests use sample records and compare exact reason codes and digest groups.

The Deluge function fetches deal records and their related open activities. Each related-record request consumes a Zoho external call.

## Safety

The default mode reads data and sends digests only. `CREATE_FOLLOW_UP_TASKS` stays false in the generated artifact.

The installation guide tells the administrator to test in a sandbox. It also lists the API-call and 200-record limits.

The sample data contains no customer information. The project does not collect telemetry.

## Release evidence

The full local test suite must pass. The generator must reproduce the committed Deluge artifact with no diff.

The package check must list all required files. A live Zoho installation remains an explicit pending check.

