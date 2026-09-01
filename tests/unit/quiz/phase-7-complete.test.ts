import { describe, expect, it } from "vitest";
import {
  generateQuiz,
  generateQuizFromValues,
  generateValidatedQuiz,
  safeGenerateQuiz,
} from "@/lib/quiz/generate-quiz";
import {
  getGeneratedQuizSummary,
  hasGeneratedQuizContent,
  isGeneratedHideLineQuiz,
  isGeneratedHideWordQuiz,
} from "@/lib/quiz/unified-quiz";

describe("Phase 7 complete verification", () => {
  const wordText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  const lineText =
    "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ";

  it("generates unified Hide Words quiz", () => {
    const quiz = generateQuiz(
      {
        text: wordText,
        method: "HIDE_WORD",
        hideCount: 2,
      },
      () => 0,
    );

    expect(quiz.method).toBe("HIDE_WORD");
    expect(quiz.quizText).toBe("بِسْمِ ____ ____ الرَّحِيمِ");
    expect(quiz.hiddenCount).toBe(2);
    expect(quiz.answers).toHaveLength(2);
    expect(quiz.answers[0]?.kind).toBe("word");
    expect(isGeneratedHideWordQuiz(quiz)).toBe(true);
    expect(isGeneratedHideLineQuiz(quiz)).toBe(false);
    expect(hasGeneratedQuizContent(quiz)).toBe(true);
    expect(getGeneratedQuizSummary(quiz)).toBe(
      "Hide Words: 2 hidden items",
    );
  });

  it("generates unified Hide Lines quiz", () => {
    const quiz = generateQuiz(
      {
        text: lineText,
        method: "HIDE_LINE",
        hideCount: 2,
      },
      () => 0,
    );

    expect(quiz.method).toBe("HIDE_LINE");
    expect(quiz.quizText).toBe(
      "بِسْمِ اللَّهِ\n____\n____",
    );
    expect(quiz.hiddenCount).toBe(2);
    expect(quiz.answers).toHaveLength(2);
    expect(quiz.answers[0]?.kind).toBe("line");
    expect(isGeneratedHideLineQuiz(quiz)).toBe(true);
    expect(isGeneratedHideWordQuiz(quiz)).toBe(false);
    expect(hasGeneratedQuizContent(quiz)).toBe(true);
    expect(getGeneratedQuizSummary(quiz)).toBe(
      "Hide Lines: 2 hidden items",
    );
  });

  it("supports generateQuizFromValues helper", () => {
    const quiz = generateQuizFromValues(
      wordText,
      "HIDE_WORD",
      1,
      () => 0,
    );

    expect(quiz.method).toBe("HIDE_WORD");
    expect(quiz.hiddenCount).toBe(1);
    expect(quiz.answers[0]?.kind).toBe("word");
  });

  it("supports validated generation", () => {
    const quiz = generateValidatedQuiz(
      {
        text: lineText,
        method: "HIDE_LINE",
        hideCount: 1,
      },
      () => 0,
    );

    expect(quiz.method).toBe("HIDE_LINE");
    expect(quiz.hiddenCount).toBe(1);
    expect(quiz.answers[0]?.kind).toBe("line");
  });

  it("supports safe generation success", () => {
    const result = safeGenerateQuiz(
      {
        text: wordText,
        method: "HIDE_WORD",
        hideCount: 1,
      },
      () => 0,
    );

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.quiz.method).toBe("HIDE_WORD");
      expect(result.quiz.hiddenCount).toBe(1);
      expect(result.errors).toEqual([]);
    }
  });

  it("supports safe generation failure", () => {
    const result = safeGenerateQuiz({
      text: "",
      method: "HIDE_WORD",
      hideCount: 1,
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.quiz).toBeNull();
      expect(result.errors[0]?.code).toBe("EMPTY_TEXT");
    }
  });
});

















