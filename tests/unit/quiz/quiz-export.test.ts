import { describe, expect, it } from "vitest";
import {
  createQuizExportFileName,
  formatGeneratedQuizAnswers,
  formatGeneratedQuizAsText,
} from "@/lib/quiz/quiz-export";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("quiz export utilities", () => {
  const quiz: GeneratedHideWordQuiz = {
    originalText: "بِسْمِ اللَّهِ",
    quizText: "____ اللَّهِ",
    method: "HIDE_WORD",
    requestedCount: 1,
    hiddenCount: 1,
    selectedTokenIndexes: [0],
    answers: [
      {
        index: 1,
        kind: "word",
        wordIndex: 0,
        tokenIndex: 0,
        answer: "بِسْمِ",
      },
    ],
  };

  it("formats answers", () => {
    expect(formatGeneratedQuizAnswers(quiz)).toBe("1. بِسْمِ");
  });

  it("formats complete quiz text", () => {
    const text = formatGeneratedQuizAsText(quiz);

    expect(text).toContain("Matn Quiz");
    expect(text).toContain("Method: Hide Words");
    expect(text).toContain("Quiz Text:");
    expect(text).toContain("Answers:");
  });

  it("creates export file name", () => {
    expect(
      createQuizExportFileName(quiz, new Date("2026-09-01T00:00:00.000Z")),
    ).toBe("matn-quiz-hide-words-2026-09-01.txt");
  });
});
















