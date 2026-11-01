# Administrator Guide

## Purpose

Pipeline Hygiene checks open Deals each day. It emails one digest to each Deal owner.

The extension flags overdue closing dates, missing open activities, stale activity, missing next steps, missing owners, and missing amounts.

## Before installation

Use a Zoho CRM sandbox. Create synthetic Deals that cover each rule.

The extension checks up to 25 Deals during each run. It does not change Deal fields. It does not create Tasks.

## Install and test

1. Install the extension in the sandbox.
2. Confirm that `Enabled` has the value `false`.
3. Confirm that the first schedule run sends no email.
4. Add synthetic Deals for each rule.
5. Change `Enabled` to `true`.
6. Run the schedule once.
7. Check the function log and email results.
8. Compare each result with the synthetic data.
9. Confirm that no Deal record changed.

## Production use

1. Install the tested extension in the production organization.
2. Keep `Enabled` set to `false`.
3. Confirm the closed-stage names and email settings.
4. Use a small synthetic test before activation.
5. Change `Enabled` to `true`.
6. Review the first digest and the function audit log.

The schedule runs each day at the configured organization time. Deal owners receive only their grouped findings.

## Stop or remove

Set `Enabled` to `false` to stop all checks and email. Remove the extension through **Setup → Marketplace → All → Installed** when required.

## Support

Open an issue at https://github.com/layalabs/zoho-crm-pipeline-hygiene-kit/issues. Do not include customer names, email addresses, Deal data, or access tokens.
