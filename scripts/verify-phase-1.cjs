/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",

  "components/ui/Button.tsx",
  "components/ui/Card.tsx",
  "components/ui/Input.tsx",
  "components/ui/Textarea.tsx",
  "components/ui/Badge.tsx",
  "components/ui/RadioCard.tsx",
  "components/ui/Counter.tsx",
  "components/ui/Container.tsx",
  "components/ui/SectionTitle.tsx",
  "components/ui/Divider.tsx",
  "components/ui/EmptyState.tsx",
  "components/ui/Spinner.tsx",
  "components/ui/index.ts",

  "components/layout/AppContainer.tsx",
  "components/layout/PageHeader.tsx",
  "components/layout/PageSection.tsx",

  "lib/utils/cn.ts",
  "lib/utils/arabic.ts",
  "lib/utils/random.ts",
  "lib/constants/quiz.ts",

  "hooks/useQuiz.ts",
  "types/quiz.ts",

  "tests/setup.ts",
  "tests/unit/components/Button.test.tsx",
  "tests/unit/components/Input.test.tsx",
  "tests/unit/components/Textarea.test.tsx",
  "tests/unit/components/Counter.test.tsx",
  "tests/unit/components/RadioCard.test.tsx",
  "tests/unit/components/Card.test.tsx",
  "tests/unit/components/EmptyState.test.tsx",
  "tests/unit/pages/HomePage.test.tsx",

  "vitest.config.ts",
  "package.json",
  "tsconfig.json"
];

const requiredPackageScripts = [
  "dev",
  "build",
  "lint",
  "test",
  "test:watch",
  "verify:phase1"
];

function log(title) {
  console.log(`\n=== ${title} ===`);
}

function fail(message) {
  console.error(`\n❌ ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`✅ ${message}`);
}

function run(command, args) {
  console.log(`\n> ${command} ${args.join(" ")}`);

  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    cwd: root
  });

  if (result.status !== 0) {
    fail(`Command failed: ${command} ${args.join(" ")}`);
  }
}

log("Checking required files");

for (const file of requiredFiles) {
  const fullPath = path.join(root, file);

  if (!existsSync(fullPath)) {
    fail(`Missing required file: ${file}`);
  }

  pass(file);
}

log("Checking package.json scripts");

const packageJsonPath = path.join(root, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

for (const scriptName of requiredPackageScripts) {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    fail(`Missing package.json script: ${scriptName}`);
  }

  pass(`script: ${scriptName}`);
}

log("Running final Phase 1 checks");

run("npm", ["run", "lint"]);
run("npm", ["test"]);
run("npm", ["run", "build"]);

log("Phase 1 verification complete");

console.log(`
✅ Phase 1.1 foundation verified
✅ Phase 1.2 UI components verified
✅ Phase 1.3 testing setup verified
✅ Phase 1.4 final verification passed

Phase 1 is complete.
`);
