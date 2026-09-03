/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, writeFileSync } = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const generatedAt = new Date().toISOString();

const checks = [
  ["Client observability utilities", "lib/monitoring/client-observability.ts"],
  ["Performance budget utilities", "lib/monitoring/performance-budget.ts"],
  ["Observability docs", "OBSERVABILITY.md"],
  ["Monitoring checklist", "MONITORING-CHECKLIST.md"],
  ["Next.js build output", ".next"]
];

const rows = checks
  .map(([label, file]) => {
    const exists = existsSync(path.join(root, file));
    return `| ${label} | ${exists ? "Pass" : "Missing"} | ${file} |`;
  })
  .join("\n");

const content = [
  "# Matn Quiz Monitoring Report",
  "",
  `Generated at: ${generatedAt}`,
  "",
  "| Check | Status | Path |",
  "| --- | --- | --- |",
  rows,
  "",
  "## Notes",
  "",
  "This report verifies monitoring readiness files and local build output.",
  "",
].join("\n");

writeFileSync("MONITORING-REPORT.md", content, "utf8");
console.log("✅ MONITORING-REPORT.md generated.");
