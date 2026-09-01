const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/quiz/line-tokenizer.ts",
  "lib/quiz/line-selection.ts",
  "lib/quiz/hide-line-engine.ts",

  "tests/unit/quiz/line-tokenizer.test.ts",
  "tests/unit/quiz/line-selection.test.ts",
  "tests/unit/quiz/hide-line-engine.test.ts",
  "tests/unit/quiz/hide-line-edge-cases.test.ts",
  "tests/unit/quiz/phase-6-complete.test.ts"
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

console.log("\n=== Checking Phase 6 files ===");

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

console.log("\n=== Running Phase 6 focused tests ===");

run(pm, [
  "test",
  "tests/unit/quiz/line-tokenizer.test.ts",
  "tests/unit/quiz/line-selection.test.ts",
  "tests/unit/quiz/hide-line-engine.test.ts",
  "tests/unit/quiz/hide-line-edge-cases.test.ts",
  "tests/unit/quiz/phase-6-complete.test.ts"
]);

console.log("\n=== Running full project verification ===");

run(pm, ["test"]);
run(pm, ["run", "lint"]);
run(pm, ["run", "build"]);

console.log(`
✅ Phase 6.1 line tokenizer verified
✅ Phase 6.2 line selection verified
✅ Phase 6.3 hide line engine verified
✅ Phase 6.4 edge cases verified
✅ Phase 6.5 final verification passed

Phase 6 is complete.
`);
