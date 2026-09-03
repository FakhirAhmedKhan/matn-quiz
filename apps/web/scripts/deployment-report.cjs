/* eslint-disable @typescript-eslint/no-require-imports */
const { writeFileSync } = require("node:fs");

const now = new Date().toISOString();

const content = [
  "# Matn Quiz Deployment Report",
  "",
  `Generated at: ${now}`,
  "",
  "Target: Vercel",
  "Build command: pnpm run build",
  "Output directory: .next",
  "",
  "## Required Environment Variables",
  "",
  "- NEXT_PUBLIC_SITE_URL",
  "",
  "## Verification Commands",
  "",
  "- pnpm test",
  "- pnpm run lint",
  "- pnpm run build",
  "- pnpm run smoke:production",
  "- pnpm run smoke:deployment",
  "- pnpm run verify:phase16",
  "",
  "## Status",
  "",
  "Deployment report generated successfully.",
  "",
].join("\n");

writeFileSync("DEPLOYMENT-REPORT.md", content, "utf8");

console.log("✅ DEPLOYMENT-REPORT.md generated.");

