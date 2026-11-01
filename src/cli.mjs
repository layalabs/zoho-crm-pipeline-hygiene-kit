#!/usr/bin/env node

import { readFile } from "node:fs/promises";

import { DEFAULT_OPTIONS, classifyDeals } from "./classify.mjs";
import { buildOwnerDigests } from "./digest.mjs";

function readArguments(argv) {
  const [inputFile, ...flags] = argv;
  if (!inputFile) {
    throw new TypeError("Usage: node src/cli.mjs <deals.json> --date YYYY-MM-DD [--stale-days N]");
  }

  let reportDate;
  let staleDays = DEFAULT_OPTIONS.staleDays;
  for (let index = 0; index < flags.length; index += 2) {
    const flag = flags[index];
    const value = flags[index + 1];
    if (flag === "--date") {
      reportDate = value;
    } else if (flag === "--stale-days") {
      staleDays = Number(value);
    } else {
      throw new TypeError(`Unknown option: ${flag ?? ""}`);
    }
  }

  if (!reportDate) {
    throw new TypeError("Missing required option: --date YYYY-MM-DD");
  }
  return { inputFile, reportDate, staleDays };
}

async function main() {
  const { inputFile, reportDate, staleDays } = readArguments(process.argv.slice(2));
  const source = await readFile(inputFile, "utf8");
  let deals;
  try {
    deals = JSON.parse(source);
  } catch (error) {
    throw new SyntaxError(`Invalid input JSON: ${error.message}`);
  }

  const findings = classifyDeals(deals, { asOfDate: reportDate, staleDays });
  const report = {
    reportDate,
    staleDays,
    findingCount: findings.length,
    digests: buildOwnerDigests(findings, { reportDate })
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
