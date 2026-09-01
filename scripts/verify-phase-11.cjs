const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/quiz/shareable-quiz.ts",
  "lib/quiz/shareable-quiz-export.ts",
  "lib/quiz/shareable-quiz-import.ts",

  "components/quiz/ShareableQuizPanel.tsx",
  "components/quiz/index.ts",

  "app/page.tsx",

  "tests/unit/quiz/shareable-quiz.test.ts",
  "tests/unit/quiz/shareable-quiz-export.test.ts",
  "tests/unit/quiz/shareable-quiz-import.test.ts",
  "tests/unit/quiz/phase-11-complete.test.ts",

  "tests/unit/components/ShareableQuizPanel.test.tsx",

  "tests/integration/shareable-quiz-import-export-flow.test.tsx"
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

console.log("\n=== Checking Phase 11 files ===");

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

console.log("\n=== Running Phase 11 focused tests ===");

run(pm, [
  "test",

  "tests/unit/quiz/shareable-quiz.test.ts",
  "tests/unit/quiz/shareable-quiz-export.test.ts",
  "tests/unit/quiz/shareable-quiz-import.test.ts",
  "tests/unit/quiz/phase-11-complete.test.ts",

  "tests/unit/components/ShareableQuizPanel.test.tsx",

  "tests/integration/shareable-quiz-import-export-flow.test.tsx"
]);

console.log("\n=== Running full project verification ===");

run(pm, ["test"]);
run(pm, ["run", "lint"]);
run(pm, ["run", "build"]);

console.log(`
✅ Phase 11.1 shareable quiz JSON model verified
✅ Phase 11.2 export JSON utilities verified
✅ Phase 11.3 import JSON validation verified
✅ Phase 11.4 import/export UI flow verified
✅ Phase 11.5 final verification passed

Phase 11 is complete.
`);
