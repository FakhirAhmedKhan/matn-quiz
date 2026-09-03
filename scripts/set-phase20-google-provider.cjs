/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

pkg.scripts = pkg.scripts || {};
pkg.scripts.test = "vitest run";
pkg.scripts["verify:phase20"] =
  "pnpm test tests/unit/tts/google-translate-tts.test.ts tests/unit/api/tts-route.test.ts tests/unit/components/ArabicTtsControls.test.tsx tests/unit/components/QuizTtsPanel.test.tsx tests/unit/hooks/useArabicTts.test.ts tests/integration/tts-hidden-text-safety-flow.test.tsx tests/unit/tts/phase-20-complete.test.ts && pnpm run build && pnpm run lint";

fs.writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
