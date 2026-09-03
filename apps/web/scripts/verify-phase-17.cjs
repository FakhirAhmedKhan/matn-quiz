/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/monitoring/client-observability.ts",
  "lib/monitoring/performance-budget.ts",
  "OBSERVABILITY.md",
  "MONITORING-CHECKLIST.md",
  "MONITORING-REPORT.md",
  "scripts/monitoring-report.cjs",
  "scripts/performance-budget-check.cjs",
  "tests/unit/monitoring/client-observability.test.ts",
  "tests/unit/monitoring/performance-budget.test.ts",
  "tests/unit/monitoring/phase-17-complete.test.ts"
];

function fail(message) {
  console.error(`\n❌ ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`✅ ${message}`);
}

function detectPackageManager() {
  return existsSync(path.join(root, "pnpm-lock.yaml")) ? "pnpm" : "npm";
}

function run(command, args) {
  console.log(`\n> ${command} ${args.join(" ")}`);

  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    cwd: root,
  });

  if (result.status !== 0) {
    fail(`Command failed: ${command} ${args.join(" ")}`);
  }
}

console.log("\n=== Checking Phase 17 files ===");

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) {
    fail(`Missing required file: ${file}`);
  }

  pass(file);
}

console.log("\n=== Checking package scripts ===");

const packageJson = JSON.parse(
  readFileSync(path.join(root, "package.json"), "utf8"),
);

for (const scriptName of [
  "test",
  "lint",
  "build",
  "monitoring:report",
  "monitoring:budget",
  "verify:phase17"
]) {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    fail(`Missing package.json script: ${scriptName}`);
  }

  pass(`script: ${scriptName}`);
}

const pm = detectPackageManager();

console.log(`\nUsing package manager: ${pm}`);

run(pm, [
  "test",
  "tests/unit/monitoring/client-observability.test.ts",
  "tests/unit/monitoring/performance-budget.test.ts",
  "tests/unit/monitoring/phase-17-complete.test.ts"
]);

run(pm, ["test"]);
run(pm, ["run", "lint"]);
run(pm, ["run", "build"]);
run(pm, ["run", "monitoring:report"]);
run(pm, ["run", "monitoring:budget"]);

console.log(`
✅ Phase 17 final verification passed
Phase 17 is complete.
`);
