/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/manifest.ts",
  "app/robots.ts",
  "app/sitemap.ts",
  "app/not-found.tsx",
  "app/error.tsx",

  "lib/deploy/deployment-config.ts",
  "lib/deploy/deployment-report.ts",
  "lib/release/product-metadata.ts",

  ".env.example",
  ".github/workflows/ci.yml",

  "DEPLOYMENT.md",
  "DEPLOYMENT-CHECKLIST.md",
  "DEPLOYMENT-REPORT.md",
  "README.md",
  "RELEASE-CHECKLIST.md",

  "public/icon.svg",
  "public/apple-icon.svg",
  "public/maskable-icon.svg"
];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`✅ ${message}`);
}

console.log("\n=== Deployment smoke checks ===");

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) {
    fail(`Missing deployment file: ${file}`);
  }

  pass(file);
}

const packageJson = JSON.parse(
  readFileSync(path.join(root, "package.json"), "utf8"),
);

for (const scriptName of [
  "test",
  "lint",
  "build",
  "smoke:production",
  "smoke:deployment",
  "deployment:report",
  "verify:phase16"
]) {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    fail(`Missing package script: ${scriptName}`);
  }

  pass(`script: ${scriptName}`);
}

const nextBuildDir = path.join(root, ".next");

if (!existsSync(nextBuildDir)) {
  fail("Missing .next build output. Run pnpm run build before deployment smoke.");
}

pass(".next build output exists");

const envExample = readFileSync(path.join(root, ".env.example"), "utf8");

if (!envExample.includes("NEXT_PUBLIC_SITE_URL")) {
  fail(".env.example must document NEXT_PUBLIC_SITE_URL");
}

pass("NEXT_PUBLIC_SITE_URL documented");

const workflow = readFileSync(path.join(root, ".github/workflows/ci.yml"), "utf8");

for (const command of [
  "pnpm test",
  "pnpm run lint",
  "pnpm run build",
  "pnpm run smoke:production",
  "pnpm run smoke:deployment"
]) {
  if (!workflow.includes(command)) {
    fail(`CI workflow missing command: ${command}`);
  }

  pass(`CI command: ${command}`);
}

console.log("\n✅ Deployment smoke checks passed.");

