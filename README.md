# Zoho CRM Pipeline Hygiene Kit

This public beta finds open deals that need attention. It emails one daily digest to each deal owner.

The kit flags these conditions:

- The closing date is overdue.
- No activity is open.
- The last activity is older than the set limit.
- The next step is empty.
- The owner is missing.
- The amount is missing.

The generated function reads a maximum of 200 deals. It ignores closed stages and keeps task creation off by default.

## Install the beta

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

## Beta limits

This release has no live Zoho sandbox result. Zoho editions can use different field names, activity statuses, and function limits.

The function reads only the first 200 deals. It does not paginate through larger pipelines.

The function sends email from the CRM administrator address. Your Zoho account must permit the sender and each recipient.

Do not enable task creation until a sandbox test confirms the task fields. See [the removal guide](docs/REMOVE.md) before installation.

## Sources

- [Zoho CRM advanced filters](https://help.zoho.com/portal/en/kb/crm/customize-crm-account/advanced-filters/articles/advanced-filters)
- [Zoho CRM Deluge tasks](https://www.zoho.com/deluge/help/crm/get-records.html)
- [Zoho CRM public extension publishing](https://help.zoho.com/portal/en/kb/sigma/extensions/articles/publish-your-extension)

## Licence

MIT. See [LICENSE](LICENSE).
