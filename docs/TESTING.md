# Test the beta

## Run the local checks

Use Node.js 20 or a later version.

```sh
npm test
npm run generate
git diff --exit-code -- dist/pipeline_hygiene.deluge
node src/cli.mjs sample/deals.json --date 2026-11-01
npm pack --dry-run
```

The sample command must report one flagged deal. The deal must have four reasons.

These checks test rule order, date limits, HTML escaping, owner groups, command output, and generated safety settings. They do not run Deluge in Zoho.

## Run the live sandbox checks

1. Create one controlled open deal for each hygiene rule.
2. Create one healthy open deal.
3. Create one closed deal with missing data.
4. Keep `createFollowUpTasks` set to `false`.
5. Run the function once.
6. Confirm that each expected owner receives one digest.
7. Confirm that the healthy deal is absent.
8. Confirm that the closed deal is absent.
9. Confirm that a missing owner routes to `managerEmail`.
10. Confirm that no deal or activity record changed.
11. Compare every result with the saved views.
12. Record the Zoho edition, data centre, function log, and test date.

Stop the production release if a field, status, or related-list name differs. Update the function and repeat the complete checklist.
