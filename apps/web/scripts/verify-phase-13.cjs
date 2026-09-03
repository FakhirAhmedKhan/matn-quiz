/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/quiz/study-session-persistence.ts",
  "lib/quiz/study-session-repository.ts",

  "components/quiz/GeneratedQuizPreview.tsx",
  "components/quiz/StudySessionResumePanel.tsx",
  "components/quiz/index.ts",
  "app/page.tsx",

  "tests/unit/quiz/study-session-persistence.test.ts",
  "tests/unit/quiz/study-session-repository.test.ts",
  "tests/unit/quiz/phase-13-complete.test.ts",

  "tests/unit/components/GeneratedQuizPreviewAutoSave.test.tsx",
  "tests/unit/components/StudySessionResumePanel.test.tsx",

  "tests/integration/study-session-auto-save-flow.test.tsx",
  "tests/integration/study-session-resume-flow.test.tsx"
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

console.log("\n=== Checking Phase 13 files ===");

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

console.log("\n=== Running Phase 13 focused tests ===");

run(pm, [
  "test",

  "tests/unit/quiz/study-session-persistence.test.ts",
  "tests/unit/quiz/study-session-repository.test.ts",
  "tests/unit/quiz/phase-13-complete.test.ts",

  "tests/unit/components/GeneratedQuizPreviewAutoSave.test.tsx",
  "tests/unit/components/StudySessionResumePanel.test.tsx",

  "tests/integration/study-session-auto-save-flow.test.tsx",
  "tests/integration/study-session-resume-flow.test.tsx"
]);

console.log("\n=== Running full project verification ===");

run(pm, ["test"]);
run(pm, ["run", "lint"]);
run(pm, ["run", "build"]);

console.log(`
✅ Phase 13.1 persisted study session model verified
✅ Phase 13.2 study session repository verified
✅ Phase 13.3 auto-save flow verified
✅ Phase 13.4 resume / clear flow verified
✅ Phase 13.5 final verification passed

Phase 13 is complete.
`);
