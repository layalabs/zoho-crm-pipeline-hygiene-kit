# Install the Zoho Pipeline Hygiene Agent Skill

The first agent release uses the official Zoho CRM Data Insights MCP server. It performs a read-only audit.

## Requirements

- Use an agent client that supports MCP.
- Connect the official Zoho CRM Data Insights MCP server.
- Use a Zoho user with permission to read the required CRM data.

Zoho opens its OAuth page during the first MCP tool call. Complete OAuth in the Zoho page. The skill does not receive or store your Zoho password or OAuth token.

## Codex

1. Copy the `agent-skill` directory to your Codex skills directory.
2. Name the destination directory `zoho-pipeline-hygiene`.
3. Restart the Codex session when required.
4. Connect the official Zoho CRM Data Insights MCP server.
5. Ask: `Audit my open Zoho Deals for pipeline hygiene.`

The usual destination is `${CODEX_HOME}/skills/zoho-pipeline-hygiene`. Use your configured Codex home when it differs.

## Other MCP clients

Use `agent-skill/SKILL.md` as the project instruction file for Claude, Cursor, or VS Code. Use each client's documented local-instruction location.

Connect only the Data Insights MCP server for the first release. Do not connect a write-capable Zoho server for this audit.

## Expected result

The agent reads the Deals schema before the audit. It checks up to 25 open Deals and returns evidence for each finding.

The agent marks a rule as `not_evaluated` when the required field or related query is unavailable. It changes no CRM record.

Use the Zoho CRM extension when you need a daily scheduled digest. An administrator must install and test that extension separately.
