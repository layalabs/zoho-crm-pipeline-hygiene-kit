# Zoho Marketplace Extension Design

## Goal

Publish Pipeline Hygiene as a Zoho CRM extension. Keep an agent skill as the second distribution path.

## Extension experience

The Zoho administrator installs the extension. The extension adds one daily schedule and one custom function.

The first schedule run does no work. The `Enabled` custom property has the default value `false`.

The administrator tests the extension in a sandbox. The administrator then changes `Enabled` to `true`.

The schedule checks up to 25 open deals each day. It emails one digest to each deal owner.

## Extension components

| Component | Value |
|---|---|
| Extension name | Pipeline Hygiene for Zoho CRM |
| Unique namespace | `layalabspipelinehygiene` |
| Custom property | `Enabled`, read-write, default `false` |
| Custom function | `Pipeline Hygiene Digest` |
| Schedule | `Daily Pipeline Hygiene Digest` |
| Schedule time | 08:00 in the organization time zone |

Zoho runs an extension schedule once after installation. The `Enabled` property prevents email during this first run.

## Data and permissions

The extension reads Deal fields and related Tasks, Events, and Calls. It sends email from the CRM administrator address.

The extension does not send CRM data to Laya Labs. It does not use an external service. It does not collect telemetry.

## Marketplace package

The repository includes the console build guide, Marketplace copy, policy documents, release checklist, and image assets.

The Marketplace release starts as free. Paid pricing needs completed demand and payout checks.

## Agent path

The agent skill uses Zoho's official Data Insights MCP server. It runs a read-only audit and returns evidence for each reason.

The first agent version does not create workflows. A later version can use Zoho's Workflow and Process Automation MCP server.

## Release boundary

Local tests can verify the generated files and release assets. They cannot verify Zoho installation or Deluge runtime behavior.

The public submission requires a Zoho Developer account in the US data center. It also requires a sandbox test and owner vendor details.

