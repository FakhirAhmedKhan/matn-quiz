/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, readFileSync, writeFileSync } = require("node:fs");

const file = "components/quiz/GeneratedQuizPreview.tsx";

if (!existsSync(file)) {
  console.log("⚠️ GeneratedQuizPreview.tsx not found, skipping UI insertion.");
  process.exit(0);
}

let content = readFileSync(file, "utf8");

if (!content.includes("@/components/quiz/QuizTtsPanel")) {
  content = content.replace(
    /((?:import[\s\S]*?;\r?\n)+)/,
    '$1import { QuizTtsPanel } from "@/components/quiz/QuizTtsPanel";\n',
  );
}

if (!content.includes("<QuizTtsPanel")) {
  if (content.includes("<AnswerRevealControls")) {
    content = content.replace(
      "<AnswerRevealControls",
      "<QuizTtsPanel quiz={quiz} />\n\n      <AnswerRevealControls",
    );
  } else if (content.includes("<ArabicReadingPanel")) {
    content = content.replace(
      "<ArabicReadingPanel",
      "<QuizTtsPanel quiz={quiz} />\n\n      <ArabicReadingPanel",
    );
  } else {
    console.log("⚠️ Could not find insertion point for QuizTtsPanel.");
  }
}

writeFileSync(file, content);
console.log("✅ GeneratedQuizPreview TTS insertion checked.");

