/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/ui/mobile-ux.ts",
  "lib/ui/feedback-state.ts",
  "lib/ui/accessibility-final-pass.ts",

  "components/ui/FeedbackStatePanel.tsx",
  "components/ui/AccessibleSkipLink.tsx",
  "components/ui/index.ts",

  "components/layout/AppResponsiveLayout.tsx",
  "components/layout/index.ts",

  "components/quiz/SavedQuizHistory.tsx",
  "components/quiz/StudySessionResumePanel.tsx",

  "app/page.tsx",

  "tests/unit/ui/mobile-ux.test.ts",
  "tests/unit/ui/feedback-state.test.ts",
  "tests/unit/ui/accessibility-final-pass.test.ts",
  "tests/unit/ui/phase-14-complete.test.ts",

  "tests/unit/components/FeedbackStatePanel.test.tsx",
  "tests/unit/components/AccessibleSkipLink.test.tsx",

  "tests/unit/layout/AppResponsiveLayout.test.tsx",

  "tests/unit/pages/HomePageMobileLayout.test.tsx",
  "tests/unit/pages/HomePageFeedbackPolish.test.tsx",
  "tests/unit/pages/HomePageAccessibilityFinalPass.test.tsx"
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

console.log("\n=== Checking Phase 14 files ===");

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

console.log("\n=== Running Phase 14 focused tests ===");

run(pm, [
  "test",

  "tests/unit/ui/mobile-ux.test.ts",
  "tests/unit/ui/feedback-state.test.ts",
  "tests/unit/ui/accessibility-final-pass.test.ts",
  "tests/unit/ui/phase-14-complete.test.ts",

  "tests/unit/components/FeedbackStatePanel.test.tsx",
  "tests/unit/components/AccessibleSkipLink.test.tsx",

  "tests/unit/layout/AppResponsiveLayout.test.tsx",

  "tests/unit/pages/HomePageMobileLayout.test.tsx",
  "tests/unit/pages/HomePageFeedbackPolish.test.tsx",
  "tests/unit/pages/HomePageAccessibilityFinalPass.test.tsx"
]);

console.log("\n=== Running full product readiness verification ===");

run(pm, ["test"]);
run(pm, ["run", "lint"]);
run(pm, ["run", "build"]);

console.log(`
✅ Phase 14.1 mobile UX tokens verified
✅ Phase 14.2 mobile-first layout verified
✅ Phase 14.3 empty/loading/error states verified
✅ Phase 14.4 accessibility and touch targets verified
✅ Phase 14.5 final product readiness passed

Phase 14 is complete.
`);
