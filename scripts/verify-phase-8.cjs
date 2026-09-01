/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/quiz/study-session.ts",
  "lib/quiz/quiz-export.ts",

  "components/quiz/AnswerRevealControls.tsx",
  "components/quiz/GeneratedQuizPreview.tsx",
  "components/quiz/QuizActionBar.tsx",
  "components/quiz/index.ts",
  "app/page.tsx",

  "tests/unit/quiz/study-session.test.ts",
  "tests/unit/quiz/quiz-export.test.ts",
  "tests/unit/quiz/phase-8-complete.test.ts",

  "tests/unit/components/AnswerRevealControls.test.tsx",
  "tests/unit/components/GeneratedQuizPreview.test.tsx",
  "tests/unit/components/QuizActionBar.test.tsx",

  "tests/integration/quiz-study-display-flow.test.tsx"
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

console.log("\n=== Checking Phase 8 files ===");

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) {
    fail(`Missing required file: ${file}`);
  }

  pass(file);
}

console.log("\n=== Checking package scripts ===");

const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

for (const scriptName of ["test", "lint", "build"]) {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    fail(`Missing package.json script: ${scriptName}`);
  }

  pass(`script: ${scriptName}`);
}

const pm = detectPackageManager();

console.log(`\nUsing package manager: ${pm}`);

console.log("\n=== Running Phase 8 focused tests ===");

run(pm, [
  "test",
  "tests/unit/quiz/study-session.test.ts",
  "tests/unit/quiz/quiz-export.test.ts",
  "tests/unit/quiz/phase-8-complete.test.ts",
  "tests/unit/components/AnswerRevealControls.test.tsx",
  "tests/unit/components/GeneratedQuizPreview.test.tsx",
  "tests/unit/components/QuizActionBar.test.tsx",
  "tests/integration/quiz-study-display-flow.test.tsx"
]);

console.log("\n=== Running full project verification ===");

run(pm, ["test"]);
run(pm, ["run", "lint"]);
run(pm, ["run", "build"]);

console.log(`
✅ Phase 8.1 study session utilities verified
✅ Phase 8.2 answer reveal controls verified
✅ Phase 8.3 improved study display verified
✅ Phase 8.4 copy/reset/export actions verified
✅ Phase 8.5 final verification passed

Phase 8 is complete.
`);
