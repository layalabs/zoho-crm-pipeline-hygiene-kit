# Pipeline Hygiene for Zoho CRM

This repository contains a Zoho CRM extension candidate and a read-only agent skill. Both products find open Deals that need attention.

The kit flags these conditions:

- The closing date is overdue.
- No activity is open.
- The last activity is older than the set limit.
- The next step is empty.
- The owner is missing.
- The amount is missing.

The extension checks 25 Deals each day. It ignores closed stages and keeps task creation off.

The extension stays disabled after installation. A Zoho administrator must test it and set `Enabled` to `true`.

## Zoho Marketplace extension

The Marketplace package includes:

- The generated Deluge schedule function.
- A safe activation property.
- The Sigma build guide and release checklist.
- Marketplace listing copy and image assets.
- An administrator guide, privacy policy, and terms.

Start with [the Sigma build guide](marketplace/BUILD_IN_SIGMA.md). Use [the release checklist](marketplace/RELEASE_CHECKLIST.md) before submission.

The extension candidate is not yet a public Marketplace listing. Zoho must accept the submission before it becomes public.

## Read-only agent skill

The agent skill uses the official Zoho CRM Data Insights MCP server. It audits up to 25 open Deals and changes no CRM record.

Read [the agent installation guide](docs/AGENT_INSTALL.md). The skill source is in [`agent-skill`](agent-skill).

## Install the manual beta

1. Read [the installation guide](docs/INSTALL.md).
2. Test the function in a Zoho CRM sandbox.
3. Compare its digest with the four [saved view recipes](views/SAVED_VIEWS.md).
4. Complete the [live test checklist](docs/TESTING.md) before production use.

The ready-to-copy function is in [`dist/pipeline_hygiene.deluge`](dist/pipeline_hygiene.deluge).

## Run the reference tests

Use Node.js 20 or a later version.

```sh
npm test
npm run generate
node src/cli.mjs sample/deals.json --date 2026-11-01
```

The JavaScript reference engine tests the classification and digest rules. The generator tests the safety settings in the Deluge file.

## Current limits

This candidate has no live Zoho sandbox result. Zoho editions can use different field names, activity statuses, and function limits.

The function reads only the first 25 deals by default. You can set the limit to 200, but each related-record request uses an external call.

The function sends email from the CRM administrator address. Your Zoho account must permit the sender and each recipient.

Do not enable task creation until a sandbox test confirms the task fields. See [the removal guide](docs/REMOVE.md) before installation.

## Sources

- [Zoho CRM advanced filters](https://help.zoho.com/portal/en/kb/crm/customize-crm-account/advanced-filters/articles/advanced-filters)
- [Zoho CRM V8 get-records task](https://www.zoho.com/deluge/help/crm/get-records-V8.html)
- [Zoho CRM V8 related-records task](https://www.zoho.com/deluge/help/crm/get-related-records-V8.html)
- [Zoho CRM public extension publishing](https://help.zoho.com/portal/en/kb/sigma/extensions/articles/publish-your-extension)

## Licence

MIT. See [LICENSE](LICENSE).
