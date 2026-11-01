# Zoho Marketplace Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare a tested Zoho CRM extension candidate and a read-only agent skill package.

**Architecture:** The existing generator creates a schedule function. The extension candidate adds a disabled installation state, submission metadata, policy documents, and Marketplace assets. The agent skill reuses the rules through Zoho's official MCP server.

**Tech Stack:** Node.js 20, Deluge, Markdown, JSON, PNG

**Spec:** `docs/superpowers/specs/2026-11-01-zoho-marketplace-extension-design.md`

## Global Constraints

- Keep the first run disabled through `layalabspipelinehygiene__Enabled`.
- Do not send CRM data to an external service.
- Keep the maximum deal count at 25.
- Keep follow-up task creation disabled.
- Write technical text to STE rules.

## Review Focus

- The immediate post-install schedule run must send no email.
- The package must disclose the 25-deal limit.
- Policy documents must match the code data flow.
- Marketplace images must have the required dimensions.
- The agent skill must use read-only Zoho MCP tools.

---

### Task 1: Safe extension function

**Files:**
- Modify: `src/generate-deluge.mjs`
- Modify: `dist/pipeline_hygiene.deluge`
- Test: `test/generate-deluge.test.mjs`

**Interfaces:**
- Produces: A schedule function that exits when the extension is disabled.

- [ ] Add a failing test for the `Enabled` property gate.
- [ ] Run `npm test` and confirm the new test fails.
- [ ] Add the property gate to the generator.
- [ ] Run `npm run generate`.
- [ ] Run `npm test` and confirm all tests pass.
- [ ] Commit the task.

### Task 2: Marketplace release package

**Files:**
- Create: `marketplace/submission.json`
- Create: `marketplace/BUILD_IN_SIGMA.md`
- Create: `marketplace/RELEASE_CHECKLIST.md`
- Create: `docs/PRIVACY.md`
- Create: `docs/TERMS.md`
- Create: `docs/ADMIN_GUIDE.md`
- Create: `marketplace/assets/*`
- Test: `test/marketplace.test.mjs`

**Interfaces:**
- Consumes: The generated schedule function from Task 1.
- Produces: A complete local submission package for Sigma.

- [ ] Add failing tests for required metadata, documents, and image dimensions.
- [ ] Run `npm test` and confirm the new tests fail.
- [ ] Add the Marketplace package and deterministic assets.
- [ ] Run `npm test` and confirm all tests pass.
- [ ] Commit the task.

### Task 3: Read-only agent skill

**Files:**
- Create: `agent-skill/SKILL.md`
- Create: `agent-skill/evals/pipeline-hygiene-cases.json`
- Create: `docs/AGENT_INSTALL.md`
- Test: `test/agent-skill.test.mjs`

**Interfaces:**
- Consumes: The rule codes and safety boundary from the project design.
- Produces: A portable read-only instruction package for Zoho MCP clients.

- [ ] Add failing tests for read-only scope, rule coverage, and eval cases.
- [ ] Run `npm test` and confirm the new tests fail.
- [ ] Add the agent skill, evals, and installation guide.
- [ ] Run `npm test` and confirm all tests pass.
- [ ] Commit the task.

### Task 4: Release verification

**Files:**
- Modify: `README.md`
- Modify: `package.json`
- Modify: `test/package.test.mjs`

**Interfaces:**
- Consumes: All release files from Tasks 1-3.
- Produces: A packaged extension candidate with public instructions.

- [ ] Add failing package assertions for all release files.
- [ ] Run `npm test` and confirm the new assertions fail.
- [ ] Add release files to the package and update the README.
- [ ] Run the full test and package checks.
- [ ] Commit the task.

