/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/quiz/quiz-history.ts",
  "lib/quiz/quiz-history-repository.ts",

  "components/quiz/SavedQuizHistory.tsx",
  "components/quiz/QuizActionBar.tsx",
  "components/quiz/GeneratedQuizPreview.tsx",
  "components/quiz/index.ts",

  "app/page.tsx",

  "tests/unit/quiz/quiz-history.test.ts",
  "tests/unit/quiz/quiz-history-repository.test.ts",
  "tests/unit/quiz/phase-10-complete.test.ts",

  "tests/unit/components/SavedQuizHistory.test.tsx",
  "tests/unit/components/QuizActionBar.test.tsx",

  "tests/unit/pages/HomePageHistoryFlow.test.tsx",

  "tests/integration/saved-quiz-history-flow.test.tsx"
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

console.log("\n=== Checking Phase 10 files ===");

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

console.log("\n=== Running Phase 10 focused tests ===");

run(pm, [
  "test",
  "tests/unit/quiz/quiz-history.test.ts",
  "tests/unit/quiz/quiz-history-repository.test.ts",
  "tests/unit/quiz/phase-10-complete.test.ts",
  "tests/unit/components/SavedQuizHistory.test.tsx",
  "tests/unit/components/QuizActionBar.test.tsx",
  "tests/unit/pages/HomePageHistoryFlow.test.tsx",
  "tests/integration/saved-quiz-history-flow.test.tsx"
]);

console.log("\n=== Running full project verification ===");

run(pm, ["test"]);
run(pm, ["run", "lint"]);
run(pm, ["run", "build"]);

console.log(`
✅ Phase 10.1 local history types verified
✅ Phase 10.2 localStorage repository verified
✅ Phase 10.3 saved history UI verified
✅ Phase 10.4 save/open/delete/clear flow verified
✅ Phase 10.5 final verification passed

Phase 10 is complete.
`);
