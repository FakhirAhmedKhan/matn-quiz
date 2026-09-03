/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/deploy/deployment-config.ts",
  "lib/deploy/deployment-report.ts",

  ".env.example",
  ".github/workflows/ci.yml",

  "DEPLOYMENT.md",
  "DEPLOYMENT-CHECKLIST.md",
  "DEPLOYMENT-REPORT.md",

  "scripts/deployment-smoke.cjs",
  "scripts/deployment-report.cjs",

  "tests/unit/deploy/deployment-config.test.ts",
  "tests/unit/deploy/deployment-report.test.ts",
  "tests/unit/deploy/phase-16-complete.test.ts",

  "tests/unit/pages/HomePageDeploymentReadiness.test.tsx"
];

function fail(message) {
  console.error(`\n❌ ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`✅ ${message}`);
}

function detectPackageManager() {
  if (existsSync(path.join(root, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  return "npm";
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

console.log("\n=== Checking Phase 16 files ===");

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
  "smoke:production",
  "smoke:deployment",
  "deployment:report",
  "verify:phase16"
]) {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    fail(`Missing package.json script: ${scriptName}`);
  }

  pass(`script: ${scriptName}`);
}

const pm = detectPackageManager();

console.log(`\nUsing package manager: ${pm}`);

console.log("\n=== Running Phase 16 focused tests ===");

run(pm, [
  "test",
  "tests/unit/deploy/deployment-config.test.ts",
  "tests/unit/deploy/deployment-report.test.ts",
  "tests/unit/deploy/phase-16-complete.test.ts",
  "tests/unit/pages/HomePageDeploymentReadiness.test.tsx"
]);

console.log("\n=== Running final deployment verification ===");

run(pm, ["test"]);
run(pm, ["run", "lint"]);
run(pm, ["run", "build"]);
run(pm, ["run", "deployment:report"]);
run(pm, ["run", "smoke:production"]);
run(pm, ["run", "smoke:deployment"]);

console.log(`
✅ Phase 16.1 deployment config verified
✅ Phase 16.2 env example and deployment docs verified
✅ Phase 16.3 CI workflow and scripts verified
✅ Phase 16.4 deployment smoke/report checks verified
✅ Phase 16.5 final deployment verification passed

Phase 16 is complete.
`);

