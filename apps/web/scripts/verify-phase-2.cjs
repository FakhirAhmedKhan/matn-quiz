/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "components/quiz/QuranTextInput.tsx",
  "components/quiz/index.ts",
  "lib/utils/arabic.ts",
  "lib/quiz/validation.ts",
  "lib/constants/quiz.ts",
  "tests/unit/utils/arabic.test.ts",
  "tests/unit/quiz/validation.test.ts",
  "tests/unit/components/QuranTextInput.test.tsx",
  "tests/integration/quran-text-input-flow.test.tsx",
  "app/page.tsx"
];

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

console.log("\n=== Checking Phase 2 files ===");

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) {
    fail(`Missing required file: ${file}`);
  }

  pass(file);
}

console.log("\n=== Running Phase 2 verification ===");

run("npm", ["test"]);
run("npm", ["run", "lint"]);
run("npm", ["run", "build"]);

console.log(`
✅ Phase 2.1 QuranTextInput verified
✅ Phase 2.2 Arabic utilities verified
✅ Phase 2.3 validation verified
✅ Phase 2.4 home page integration verified
✅ Phase 2.5 tests verified

Phase 2 is complete.
`);
