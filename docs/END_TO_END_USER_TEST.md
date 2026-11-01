# End-to-End User Test

Use this guide before the public Marketplace submission. It tests the complete extension and agent journeys with synthetic data.

## Test roles

Use these roles to experience the product as a customer team.

| Role | Account | Purpose |
|---|---|---|
| Extension builder | Zoho Developer account in the US data center | Builds and publishes the private candidate |
| Customer administrator | Separate Zoho CRM Enterprise or Ultimate test organization | Installs, configures, tests, and removes the extension |
| Sales owner | User in the customer test organization | Receives the digest and corrects Deals |
| Agent user | Customer administrator or read-only operator | Runs the agent skill through Zoho MCP |

Use two browser profiles when one person performs all roles. Keep each Zoho organization and mailbox clearly labelled.

## Required evidence

Create one test folder. Save these items in that folder:

- Extension version and namespace
- Private installation URL
- Install-screen screenshots
- Custom property screenshot
- Schedule and execution-log screenshots
- Synthetic Deal table
- Received digest
- Record history before and after each run
- Removal screenshot
- Agent audit result
- Test result table

Do not put access tokens, private installation URLs, or real customer data in a public issue.

## Phase 1: Verify the local candidate

1. Check out commit `a26c7d732e003f90684e28d000c147916bc23954` or a later reviewed commit.
2. Run `npm test`.
3. Confirm that all 26 tests pass.
4. Run `npm run generate`.
5. Run `git diff --exit-code -- dist/pipeline_hygiene.deluge`.
6. Confirm that the command returns no difference.
7. Review `docs/PRIVACY.md` and `docs/TERMS.md`.
8. Review the three files in `marketplace/assets`.

Stop if a local check fails.

## Phase 2: Build the extension in Sigma

Follow `marketplace/BUILD_IN_SIGMA.md`.

Use these exact values:

| Setting | Value |
|---|---|
| Name | `Pipeline Hygiene for Zoho CRM` |
| Namespace | `layalabspipelinehygiene` |
| Property | `Enabled` |
| Property default | `false` |
| Schedule | `Daily Pipeline Hygiene Digest` |
| Schedule time | `08:00` in the organization time zone |

Confirm that Sigma creates `layalabspipelinehygiene__Enabled`. Stop if the generated API name differs from the Deluge file.

## Phase 3: Test the builder sandbox

Click **Test Your Extension** in Sigma. Zoho opens an isolated customer simulation in a new tab.

### 3.1 Test the safe installation state

1. Confirm that the extension is installed in the sandbox.
2. Open the extension settings.
3. Confirm that `Enabled` has the value `false`.
4. Open **Setup → Automation → Schedules**.
5. Confirm that the daily schedule exists.
6. Open the execution log.
7. Find the immediate post-install run.
8. Confirm that the run sent no email.
9. Confirm that the run changed no Deal.

Zoho executes an extension schedule once after installation. This test proves that the activation gate protects users.

### 3.2 Prepare the synthetic Deals

Use a fresh sandbox with fewer than 25 Deals. The first release checks only 25 Deals during each run.

Create one sales owner with an inbox that you control. Assign all open synthetic Deals to that user.

Use the test date as `T`. Use dates relative to `T`.

| Deal name | Stage | Closing date | Next step | Amount | Activity | Expected result |
|---|---|---|---|---:|---|---|
| `PH-E2E-Overdue` | Open stage | `T - 1 day` | `Call sponsor` | 1000 | One open Task | `overdue_closing_date` |
| `PH-E2E-Missing` | Open stage | `T + 30 days` | Blank | Blank | One open Task | `missing_next_step`, `missing_amount` |
| `PH-E2E-NoActivity` | Open stage | `T + 30 days` | `Send proposal` | 1000 | No Task, Event, or Call | `no_open_activity` |
| `PH-E2E-Closed` | `Closed Won` | `T - 30 days` | Blank | Blank | None | Ignored |
| `PH-E2E-Zero` | Open stage | `T + 30 days` | `Confirm scope` | 0 | One open Task | No finding |

Use one of these default open stages: `Qualification`, `Proposal`, or `Negotiation`.

Do not use a real customer name, email address, or amount.

The missing-owner case cannot usually be created through the CRM interface. Zoho assigns an owner automatically. Keep this case as local test evidence.

The stale-activity case needs a `Last_Activity_Time` older than 14 days. Use an existing synthetic record with this state when available.

If Zoho prevents this state, mark the stale rule as locally tested only. Do not claim a live stale-rule test.

### 3.3 Run the enabled audit

1. Record each synthetic Deal history.
2. Change `Enabled` to `true`.
3. Open **Setup → Automation → Schedules**.
4. Select **Run Now** for the Pipeline Hygiene schedule.
5. Use only one manual run at this step.
6. Open the schedule execution log.
7. Confirm that the run succeeded.
8. Open the sales owner's inbox.
9. Find the pipeline hygiene digest.
10. Compare every row with the expected table.
11. Confirm that `PH-E2E-Closed` is absent.
12. Confirm that `PH-E2E-Zero` is absent.
13. Compare each Deal history with the baseline.
14. Confirm that no Deal changed.
15. Confirm that the extension created no Task.

Zoho permits two manual schedule runs each day. Keep the second run for the correction test.

### 3.4 Test the sales-owner correction journey

1. Sign in as the sales owner.
2. Open each flagged Deal from Zoho CRM.
3. Move the overdue closing date to `T + 30 days`.
4. Add a next step to `PH-E2E-Missing`.
5. Add an amount to `PH-E2E-Missing`.
6. Add an open Task to `PH-E2E-NoActivity`.
7. Select **Run Now** for the second manual run.
8. Confirm that the corrected Deals do not appear.
9. Confirm that the execution log shows success.

This phase tests the product outcome. The sales owner receives a useful list and can remove each finding through normal CRM work.

## Phase 4: Publish a private beta

Publish the tested extension as **Private** first. Do not submit it to the public Marketplace yet.

1. Open the extension details page in Sigma.
2. Select **Publish**.
3. Select **Private** visibility.
4. Review the included components.
5. Add clear review remarks.
6. Confirm the private publish.
7. Copy the generated installation URL.
8. Store the URL in the private test folder.

Private installation URLs require Zoho CRM Enterprise or a higher edition. [Zoho extension FAQ](https://help.zoho.com/portal/en/kb/zoho-crm-platform/extensions-for-zoho-crm/faqs/articles/faqs-crm-extensions)

## Phase 5: Test the customer administrator journey

Use the separate customer test organization. This phase must not use the builder sandbox.

### 5.1 Test discovery and evaluation

1. Open the private installation URL in the customer browser profile.
2. Record the first page that Zoho shows.
3. Confirm the extension name and developer identity.
4. Review every requested component and permission.
5. Open the privacy policy.
6. Open the terms.
7. Confirm that both public URLs work without authentication.
8. Record unclear text or missing information.

The private URL simulates direct discovery. Marketplace search can only be tested after Zoho approves the public listing.

### 5.2 Test installation

1. Install the extension as the customer administrator.
2. Record the installation time and extension version.
3. Open **Setup → Marketplace → All → Installed**.
4. Open the Pipeline Hygiene extension.
5. Confirm that `Enabled` has the value `false`.
6. Confirm that the daily schedule exists.
7. Confirm that the immediate run sent no email.
8. Confirm that the immediate run changed no Deal.

Record the total installation time. Record each step that needs technical knowledge.

### 5.3 Repeat the value test

1. Create the five synthetic Deals from Phase 3.
2. Keep the organization below 25 Deals.
3. Change `Enabled` to `true`.
4. Select **Run Now** for the schedule.
5. Confirm the expected email and findings.
6. Correct the flagged Deals as the sales owner.
7. Use the second manual run.
8. Confirm that the corrected findings disappear.

This phase proves that another organization can install and use the same private version.

### 5.4 Test deactivation and removal

1. Change `Enabled` to `false`.
2. Select **Run Now** if a manual run remains available.
3. Confirm that the disabled run sends no email.
4. Open the installed extension page.
5. Remove the extension.
6. Confirm that the extension no longer appears.
7. Confirm that its schedule no longer appears.
8. Confirm that the synthetic Deal records remain unchanged.

Record every confirmation or warning in the removal flow.

## Phase 6: Test the agent journey

Use the customer administrator browser profile and the same synthetic organization.

1. Install the official Zoho CRM Data Insights MCP server in the agent client.
2. Complete the Zoho OAuth flow.
3. Connect a user that can read Deals and activities.
4. Install `agent-skill` as `zoho-pipeline-hygiene`.
5. Do not connect a write-capable Zoho MCP server.
6. Ask: `Audit my open Zoho Deals for pipeline hygiene.`
7. Confirm that the agent reads the Deals schema first.
8. Confirm that the agent checks no more than 25 open Deals.
9. Compare the agent findings with the extension digest.
10. Confirm that each finding includes field evidence.
11. Confirm that unavailable rules show `not_evaluated`.
12. Confirm that no CRM record changed.

The agent result can differ when the Data Insights server cannot query related activities. The agent must report this limit as `not_evaluated`.

## Phase 7: Review the entire funnel

Score each stage from 1 to 5. A score of 1 means unusable. A score of 5 means clear and easy.

| Stage | Score | Time | Confusing step | Required change |
|---|---:|---:|---|---|
| Private-link discovery |  |  |  |  |
| Permission review |  |  |  |  |
| Installation |  |  |  |  |
| Safe disabled state |  |  |  |  |
| Activation |  |  |  |  |
| First digest |  |  |  |  |
| Deal correction |  |  |  |  |
| Second clean run |  |  |  |  |
| Deactivation |  |  |  |  |
| Removal |  |  |  |  |
| Agent audit |  |  |  |  |

## Submission gate

Submit the public extension only when all required checks pass.

- The first installation run sends no email.
- A second Zoho organization completes the private installation.
- The enabled digest matches the synthetic data.
- The extension changes no Deal.
- Deactivation stops all email.
- Removal deletes the extension schedule.
- The privacy and terms URLs work publicly.
- The owner approves the listing copy and vendor details.
- Each incomplete live rule has a clear limit in the submission notes.

Zoho provides the sandbox and private installation URL for extension tests. [Zoho extension testing](https://help.zoho.com/portal/en/kb/zoho-crm-platform/extensions-for-zoho-crm/developer-guide/packaging-your-extension/articles/testing-your-extension)

Zoho provides **Run Now** and limits it to two uses each day for each schedule. [Zoho CRM schedules](https://help.zoho.com/portal/en/kb/crm/automate-business-processes/schedules/articles/custom-schedules)
