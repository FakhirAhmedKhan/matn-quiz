/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/quiz/review-session.ts",

  "components/quiz/ReviewAnswerControls.tsx",
  "components/quiz/ReviewProgressSummary.tsx",
  "components/quiz/GeneratedQuizPreview.tsx",
  "components/quiz/index.ts",

  "tests/unit/quiz/review-session.test.ts",
  "tests/unit/quiz/phase-12-complete.test.ts",

  "tests/unit/components/ReviewAnswerControls.test.tsx",
  "tests/unit/components/ReviewProgressSummary.test.tsx",
  "tests/unit/components/GeneratedQuizPreviewReview.test.tsx",

  "tests/integration/review-mode-study-flow.test.tsx"
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

console.log("\n=== Checking Phase 12 files ===");

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

for (const scriptName of ["test", "lint", "build"]) {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    fail(`Missing package.json script: ${scriptName}`);
  }

  pass(`script: ${scriptName}`);
}

const pm = detectPackageManager();

console.log(`\nUsing package manager: ${pm}`);

console.log("\n=== Running Phase 12 focused tests ===");

run(pm, [
  "test",

  "tests/unit/quiz/review-session.test.ts",
  "tests/unit/quiz/phase-12-complete.test.ts",

  "tests/unit/components/ReviewAnswerControls.test.tsx",
  "tests/unit/components/ReviewProgressSummary.test.tsx",
  "tests/unit/components/GeneratedQuizPreviewReview.test.tsx",

  "tests/integration/review-mode-study-flow.test.tsx"
]);

console.log("\n=== Running full project verification ===");

run(pm, ["test"]);
run(pm, ["run", "lint"]);
run(pm, ["run", "build"]);

console.log(`
✅ Phase 12.1 review session utilities verified
✅ Phase 12.2 review answer controls verified
✅ Phase 12.3 review progress summary verified
✅ Phase 12.4 review mode UI integration verified
✅ Phase 12.5 final verification passed

Phase 12 is complete.
`);
