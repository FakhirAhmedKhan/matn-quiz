import { describe, expect, it } from "vitest";
import { generateQuiz } from "@/lib/quiz/generate-quiz";
import {
  createQuizStudyState,
  getStudyProgress,
  revealAllAnswers,
  revealAnswer,
} from "@/lib/quiz/study-session";
import {
  createQuizExportFileName,
  formatGeneratedQuizAnswers,
  formatGeneratedQuizAsText,
} from "@/lib/quiz/quiz-export";

describe("Phase 8 complete verification", () => {
  const text = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  it("generates quiz, creates study state, and reveals answers", () => {
    const quiz = generateQuiz(
      {
        text,
        method: "HIDE_WORD",
        hideCount: 2,
      },
      () => 0,
    );

    const state = createQuizStudyState(quiz);
    const oneRevealed = revealAnswer(state, 1);
    const allRevealed = revealAllAnswers(oneRevealed);

    expect(getStudyProgress(state)).toEqual({
      total: 2,
      revealed: 0,
      hidden: 2,
      complete: false,
      percentage: 0,
    });

    expect(getStudyProgress(oneRevealed).revealed).toBe(1);

    expect(getStudyProgress(allRevealed)).toEqual({
      total: 2,
      revealed: 2,
      hidden: 0,
      complete: true,
      percentage: 100,
    });
  });

  it("formats generated quiz for copy and export", () => {
    const quiz = generateQuiz(
      {
        text,
        method: "HIDE_WORD",
        hideCount: 1,
      },
      () => 0,
    );

    expect(formatGeneratedQuizAsText(quiz)).toContain("Matn Quiz");
    expect(formatGeneratedQuizAsText(quiz)).toContain("Method: Hide Words");
    expect(formatGeneratedQuizAnswers(quiz)).toContain("1.");

    expect(
      createQuizExportFileName(quiz, new Date("2026-09-01T00:00:00.000Z")),
    ).toBe("matn-quiz-hide-words-2026-09-01.txt");
  });
});
