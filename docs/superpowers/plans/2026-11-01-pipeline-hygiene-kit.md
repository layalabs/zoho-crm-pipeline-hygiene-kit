# Pipeline Hygiene Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public beta kit that finds neglected Zoho CRM deals and generates owner digests.

**Architecture:** A dependency-free JavaScript reference engine classifies normalized deal records and generates digest HTML. A generator produces the installable Deluge function from fixed rule definitions.

**Tech Stack:** Node.js 20 or newer, ECMAScript modules, `node:test`, Zoho Deluge

**Spec:** `docs/superpowers/specs/2026-11-01-pipeline-hygiene-kit-design.md`

## Global Constraints

- Use no runtime or development package dependencies.
- Keep task creation disabled by default.
- Process 25 deals by default, with a tested maximum setting of 200.
- Do not include customer data or telemetry.
- State that live Zoho execution is pending without an authenticated test account.
- Write technical documentation to ASD-STE100 Simplified Technical English rules.

## Review Focus

- Invalid dates must produce a clear error instead of a wrong classification.
- A deal on the report date must not count as overdue.
- A zero amount must not count as missing.
- Closed deals must never appear in a digest.
- HTML data must be escaped before it enters the digest.

---

### Task 1: Deal classifier

**Files:**
- Create: `package.json`
- Create: `src/classify.mjs`
- Create: `test/classify.test.mjs`
- Create: `sample/deals.json`

**Interfaces:**
- Consumes: normalized deal records from JSON.
- Produces: `classifyDeal(deal, options)` and `classifyDeals(deals, options)`.

- [ ] **Step 1: Write failing classifier tests**

Test all six reason codes, the report-date boundary, zero amount, invalid dates, and closed deals.

- [ ] **Step 2: Run the classifier test and verify the expected failure**

Run: `node --test test/classify.test.mjs`
Expected: FAIL because `src/classify.mjs` does not exist.

- [ ] **Step 3: Implement the classifier**

Use UTC date-only comparisons. Return stable reason-code arrays in specification order.

- [ ] **Step 4: Run the classifier tests**

Run: `node --test test/classify.test.mjs`
Expected: PASS with no warnings.

- [ ] **Step 5: Commit the classifier**

Commit message: `feat: add pipeline hygiene classifier`

### Task 2: Digest and command line

**Files:**
- Create: `src/digest.mjs`
- Create: `src/cli.mjs`
- Create: `test/digest.test.mjs`
- Create: `test/cli.test.mjs`

**Interfaces:**
- Consumes: `classifyDeals(deals, options)` from Task 1.
- Produces: `buildOwnerDigests(results, options)` and a JSON command-line report.

- [ ] **Step 1: Write failing digest and command-line tests**

Test owner grouping, the unassigned group, HTML escaping, empty results, and invalid input.

- [ ] **Step 2: Run the tests and verify the expected failure**

Run: `node --test test/digest.test.mjs test/cli.test.mjs`
Expected: FAIL because the digest and command-line modules do not exist.

- [ ] **Step 3: Implement the digest and command line**

Write JSON to standard output. Write errors to standard error and exit with status 1.

- [ ] **Step 4: Run the full test suite**

Run: `npm test`
Expected: PASS with no warnings.

- [ ] **Step 5: Commit the digest and command line**

Commit message: `feat: add owner digest and command line`

### Task 3: Deluge generator and artifact

**Files:**
- Create: `src/generate-deluge.mjs`
- Create: `test/generate-deluge.test.mjs`
- Create: `dist/pipeline_hygiene.deluge`
- Create: `views/SAVED_VIEWS.md`

**Interfaces:**
- Consumes: the rule order and defaults from Task 1.
- Produces: `generateDeluge(options)` and the committed Deluge artifact.

- [ ] **Step 1: Write failing generator tests**

Test safe defaults, the 200-record maximum, escaped labels, and deterministic generation.

- [ ] **Step 2: Run the generator test and verify the expected failure**

Run: `node --test test/generate-deluge.test.mjs`
Expected: FAIL because the generator does not exist.

- [ ] **Step 3: Implement the generator and create the artifact**

Use Zoho CRM V8 record calls. Fetch related Tasks, Events, and Calls for open-activity checks.

- [ ] **Step 4: Run the full suite and the artifact check**

Run: `npm test && npm run generate && git diff --exit-code -- dist/pipeline_hygiene.deluge`
Expected: PASS and no artifact diff.

- [ ] **Step 5: Commit the generator and artifact**

Commit message: `feat: generate installable Deluge function`

### Task 4: Installation and release package

**Files:**
- Create: `README.md`
- Create: `docs/INSTALL.md`
- Create: `docs/REMOVE.md`
- Create: `docs/TESTING.md`
- Create: `LICENSE`
- Create: `.gitignore`

**Interfaces:**
- Consumes: all earlier artifacts.
- Produces: a complete public beta repository and release package.

- [ ] **Step 1: Add a failing package-content test**

Add `test/package.test.mjs`. Test the files that a user needs for installation and removal.

- [ ] **Step 2: Run the package test and verify the expected failure**

Run: `node --test test/package.test.mjs`
Expected: FAIL because the documentation files do not exist.

- [ ] **Step 3: Write the user documentation and licence**

Document setup, limits, safe defaults, removal, local tests, and the untested live-Zoho boundary.

- [ ] **Step 4: Run final verification**

Run: `npm test && npm run generate && git diff --exit-code -- dist/pipeline_hygiene.deluge && npm pack --dry-run`
Expected: PASS, no artifact diff, and all required files in the package list.

- [ ] **Step 5: Commit the release package**

Commit message: `docs: add beta installation and release guide`
