/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "types/quiz.ts",

  "lib/quiz/unified-quiz.ts",
  "lib/quiz/generate-quiz.ts",
  "lib/quiz/generate-quiz-validation.ts",

  "components/quiz/GeneratedQuizPreview.tsx",
  "components/quiz/index.ts",
  "app/page.tsx",

  "tests/unit/quiz/unified-quiz.test.ts",
  "tests/unit/quiz/generate-quiz.test.ts",
  "tests/unit/quiz/generate-quiz-validation.test.ts",
  "tests/unit/quiz/phase-7-complete.test.ts",

  "tests/unit/components/GeneratedQuizPreview.test.tsx",
  "tests/unit/pages/HomePage.test.tsx",
  "tests/integration/unified-quiz-generation-flow.test.tsx"
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

console.log("\n=== Checking Phase 7 files ===");

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

console.log("\n=== Running Phase 7 focused tests ===");

run(pm, [
  "test",
  "tests/unit/quiz/unified-quiz.test.ts",
  "tests/unit/quiz/generate-quiz.test.ts",
  "tests/unit/quiz/generate-quiz-validation.test.ts",
  "tests/unit/quiz/phase-7-complete.test.ts",
  "tests/unit/components/GeneratedQuizPreview.test.tsx",
  "tests/unit/pages/HomePage.test.tsx",
  "tests/integration/unified-quiz-generation-flow.test.tsx"
]);

console.log("\n=== Running full project verification ===");

run(pm, ["test"]);
run(pm, ["run", "lint"]);
run(pm, ["run", "build"]);

console.log(`
✅ Phase 7.1 unified quiz types and helpers verified
✅ Phase 7.2 generator dispatcher verified
✅ Phase 7.3 validation and safe generation verified
✅ Phase 7.4 homepage generation flow verified
✅ Phase 7.5 final verification passed

Phase 7 is complete.
`);
