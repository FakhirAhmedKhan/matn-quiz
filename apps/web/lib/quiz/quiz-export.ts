import { getGeneratedQuizMethodLabel } from "@/lib/quiz/unified-quiz";
import type { GeneratedQuiz } from "@/types/quiz";

export function formatGeneratedQuizAnswers(quiz: GeneratedQuiz): string {
  return quiz.answers.map((answer) => `${answer.index}. ${answer.answer}`).join("\n");
}

export function formatGeneratedQuizAsText(quiz: GeneratedQuiz): string {
  const methodLabel = getGeneratedQuizMethodLabel(quiz.method);
  const answers = formatGeneratedQuizAnswers(quiz);

  return [
    "Matn Quiz",
    "",
    `Method: ${methodLabel}`,
    `Hidden Count: ${quiz.hiddenCount}`,
    "",
    "Quiz Text:",
    quiz.quizText,
    "",
    "Answers:",
    answers,
  ].join("\n");
}

export function createQuizExportFileName(
  quiz: GeneratedQuiz,
  now = new Date(),
): string {
  const method = quiz.method === "HIDE_WORD" ? "hide-words" : "hide-lines";
  const date = now.toISOString().slice(0, 10);

  return `matn-quiz-${method}-${date}.txt`;
}

export async function copyTextToClipboard(value: string): Promise<boolean> {
  if (
    typeof navigator === "undefined" ||
    !navigator.clipboard ||
    typeof navigator.clipboard.writeText !== "function"
  ) {
    return false;
  }

  await navigator.clipboard.writeText(value);
  return true;
}

export function exportQuizAsTextFile(quiz: GeneratedQuiz): void {
  if (typeof document === "undefined") {
    return;
  }

  const content = formatGeneratedQuizAsText(quiz);
  const fileName = createQuizExportFileName(quiz);
  const blob = new Blob([content], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}
