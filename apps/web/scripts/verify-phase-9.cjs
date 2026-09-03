/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/ui/design-system.ts",
  "lib/ui/accessibility.ts",
  "lib/quiz/arabic-reading.ts",

  "components/layout/AppResponsiveLayout.tsx",
  "components/layout/index.ts",

  "components/quiz/ArabicReadingPanel.tsx",
  "components/quiz/AnswerRevealControls.tsx",
  "components/quiz/GeneratedQuizPreview.tsx",
  "components/quiz/QuizActionBar.tsx",
  "components/quiz/index.ts",

  "app/page.tsx",

  "tests/unit/ui/design-system.test.ts",
  "tests/unit/ui/accessibility.test.ts",
  "tests/unit/ui/phase-9-complete.test.ts",

  "tests/unit/layout/AppResponsiveLayout.test.tsx",

  "tests/unit/quiz/arabic-reading.test.ts",

  "tests/unit/components/ArabicReadingPanel.test.tsx",
  "tests/unit/components/AnswerRevealControls.test.tsx",
  "tests/unit/components/GeneratedQuizPreview.test.tsx",

  "tests/unit/pages/HomePageResponsiveLayout.test.tsx",

  "tests/integration/arabic-reading-ux-flow.test.tsx",
  "tests/integration/accessibility-study-flow.test.tsx"
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

console.log("\n=== Checking Phase 9 files ===");

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

console.log("\n=== Running Phase 9 focused tests ===");

run(pm, [
  "test",
  "tests/unit/ui/design-system.test.ts",
  "tests/unit/ui/accessibility.test.ts",
  "tests/unit/ui/phase-9-complete.test.ts",
  "tests/unit/layout/AppResponsiveLayout.test.tsx",
  "tests/unit/quiz/arabic-reading.test.ts",
  "tests/unit/components/ArabicReadingPanel.test.tsx",
  "tests/unit/components/AnswerRevealControls.test.tsx",
  "tests/unit/components/GeneratedQuizPreview.test.tsx",
  "tests/unit/pages/HomePageResponsiveLayout.test.tsx",
  "tests/integration/arabic-reading-ux-flow.test.tsx",
  "tests/integration/accessibility-study-flow.test.tsx"
]);

console.log("\n=== Running full project verification ===");

run(pm, ["test"]);
run(pm, ["run", "lint"]);
run(pm, ["run", "build"]);

console.log(`
✅ Phase 9.1 design tokens verified
✅ Phase 9.2 responsive layout verified
✅ Phase 9.3 Arabic reading UX verified
✅ Phase 9.4 accessibility and micro-interactions verified
✅ Phase 9.5 final verification passed

Phase 9 is complete.
`);
