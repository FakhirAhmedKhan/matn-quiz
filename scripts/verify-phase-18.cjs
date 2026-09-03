/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "lib/quiz/tts-safe-text.ts",
  "hooks/useArabicTts.ts",
  "components/quiz/ArabicTtsControls.tsx",
  "components/quiz/QuizTtsPanel.tsx",
  "tests/unit/quiz/tts-safe-text.test.ts",
  "tests/unit/components/ArabicTtsControls.test.tsx",
  "tests/unit/components/QuizTtsPanel.test.tsx",
  "tests/integration/tts-hidden-text-safety-flow.test.tsx",
  "tests/unit/quiz/phase-18-complete.test.ts",
  "PHASE-18-STATUS.md",
  "TTS-SAFETY.md"
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

console.log("\n=== Checking Phase 18 files ===");

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

for (const scriptName of ["test", "lint", "build", "verify:phase18"]) {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    fail(`Missing package.json script: ${scriptName}`);
  }

  pass(`script: ${scriptName}`);
}

const pm = detectPackageManager();

console.log(`\nUsing package manager: ${pm}`);

run(pm, [
  "test",
  "tests/unit/quiz/tts-safe-text.test.ts",
  "tests/unit/components/ArabicTtsControls.test.tsx",
  "tests/unit/components/QuizTtsPanel.test.tsx",
  "tests/integration/tts-hidden-text-safety-flow.test.tsx",
  "tests/unit/quiz/phase-18-complete.test.ts"
]);

run(pm, ["test"]);
run(pm, ["run", "build"]);
run(pm, ["run", "lint"]);

console.log("\nPhase 18 verification passed.");
