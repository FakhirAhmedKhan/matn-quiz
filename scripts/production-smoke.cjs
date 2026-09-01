/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "public/icon.svg",
  "public/apple-icon.svg",
  "public/maskable-icon.svg",
  "README.md"
];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`✅ ${message}`);
}

console.log("\n=== Production smoke checks ===");

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) {
    fail(`Missing required release file: ${file}`);
  }

  pass(file);
}

const packageJson = JSON.parse(
  readFileSync(path.join(root, "package.json"), "utf8"),
);

for (const scriptName of ["test", "lint", "build"]) {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    fail(`Missing package script: ${scriptName}`);
  }

  pass(`script: ${scriptName}`);
}

if (!existsSync(path.join(root, ".next"))) {
  fail("Missing .next build output. Run pnpm run build before smoke test.");
}

pass(".next build output exists");
console.log("\n✅ Production smoke checks passed.");
