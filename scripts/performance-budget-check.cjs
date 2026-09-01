/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/monitoring/client-observability.ts",
  "lib/monitoring/performance-budget.ts",
  "OBSERVABILITY.md",
  "MONITORING-CHECKLIST.md",
  "MONITORING-REPORT.md"
];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`✅ ${message}`);
}

console.log("\n=== Monitoring and performance budget checks ===");

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) {
    fail(`Missing monitoring file: ${file}`);
  }

  pass(file);
}

if (!existsSync(path.join(root, ".next"))) {
  fail("Missing .next build output. Run pnpm run build before monitoring budget check.");
}

pass(".next build output exists");

const packageJson = JSON.parse(
  readFileSync(path.join(root, "package.json"), "utf8"),
);

for (const scriptName of [
  "monitoring:report",
  "monitoring:budget",
  "verify:phase17"
]) {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    fail(`Missing package script: ${scriptName}`);
  }

  pass(`script: ${scriptName}`);
}

console.log("\n✅ Monitoring and performance budget checks passed.");
