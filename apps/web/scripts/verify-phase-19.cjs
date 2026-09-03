/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "app/page.tsx",
  "app/page.phase19-backup.tsx",
  "components/page/home/types.ts",
  "components/page/home/HomePageView.tsx",
  "components/page/home/HomeHeroSection.tsx",
  "components/page/home/QuranTextSection.tsx",
  "components/page/home/QuizOptionsSection.tsx",
  "components/page/home/QuizSetupSummarySection.tsx",
  "components/page/home/GeneratedQuizSection.tsx",
  "components/page/home/ResumeStudySection.tsx",
  "components/page/home/ShareableQuizSection.tsx",
  "components/page/home/SavedHistorySection.tsx",
  "components/page/home/index.ts",
  "tests/unit/pages/HomePageArchitecture.test.ts",
  "tests/unit/pages/HomePageSections.test.tsx",
  "PHASE-19-STATUS.md"
];

function fail(message) {
  console.error(`\nFAILED: ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`OK ${message}`);
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

console.log("\n=== Checking Phase 19 files ===");

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) {
    fail(`Missing required file: ${file}`);
  }

  pass(file);
}

const pageSource = readFileSync(path.join(root, "app/page.tsx"), "utf8");

if (!pageSource.includes("HomePageView") || !pageSource.includes("usePage")) {
  fail("app/page.tsx is not using HomePageView and usePage.");
}

if (
  pageSource.includes("QuranTextInput") ||
  pageSource.includes("QuizMethodSelector") ||
  pageSource.includes("SavedQuizHistory")
) {
  fail("app/page.tsx still contains page UI component imports.");
}

pass("app/page.tsx is a small connector");

console.log("\n=== Checking package scripts ===");

const packageJson = JSON.parse(
  readFileSync(path.join(root, "package.json"), "utf8"),
);

for (const scriptName of ["test", "lint", "build", "verify:phase19"]) {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    fail(`Missing package.json script: ${scriptName}`);
  }

  pass(`script: ${scriptName}`);
}

const pm = detectPackageManager();

console.log(`\nUsing package manager: ${pm}`);

run(pm, [
  "test",
  "tests/unit/pages/HomePageArchitecture.test.ts",
  "tests/unit/pages/HomePageSections.test.tsx"
]);

run(pm, ["test"]);
run(pm, ["run", "build"]);
run(pm, ["run", "lint"]);

console.log("\nPhase 19 verification passed.");
