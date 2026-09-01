import { describe, expect, it } from "vitest";
import {
  assertValidGenerateQuizInput,
  GenerateQuizValidationError,
  getGenerateQuizInputError,
  validateGenerateQuizInput,
} from "@/lib/quiz/generate-quiz-validation";
import {
  generateValidatedQuiz,
  safeGenerateQuiz,
} from "@/lib/quiz/generate-quiz";

describe("generate quiz validation", () => {
  const wordText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  const lineText =
    "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ";

  it("validates correct Hide Word input", () => {
    const result = validateGenerateQuizInput({
      text: wordText,
      method: "HIDE_WORD",
      hideCount: 2,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.availableCount).toBe(4);
    expect(result.method).toBe("HIDE_WORD");
  });

  it("validates correct Hide Line input", () => {
    const result = validateGenerateQuizInput({
      text: lineText,
      method: "HIDE_LINE",
      hideCount: 2,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.availableCount).toBe(3);
    expect(result.method).toBe("HIDE_LINE");
  });

  it("rejects empty text", () => {
    const result = validateGenerateQuizInput({
      text: "",
      method: "HIDE_WORD",
      hideCount: 1,
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("EMPTY_TEXT");
    expect(result.errors[0]?.path).toBe("text");
  });

  it("rejects non-Arabic text", () => {
    const result = validateGenerateQuizInput({
      text: "hello world",
      method: "HIDE_WORD",
      hideCount: 1,
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("NO_ARABIC_TEXT");
    expect(result.errors[0]?.path).toBe("text");
  });

  it("rejects invalid method", () => {
    const result = validateGenerateQuizInput({
      text: wordText,
      method: "INVALID",
      hideCount: 1,
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("INVALID_METHOD");
    expect(result.errors[0]?.path).toBe("method");
  });

  it("rejects missing method", () => {
    const result = validateGenerateQuizInput({
      text: wordText,
      hideCount: 1,
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("INVALID_METHOD");
  });

  it("rejects missing hide count", () => {
    const result = validateGenerateQuizInput({
      text: wordText,
      method: "HIDE_WORD",
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("INVALID_HIDE_COUNT");
    expect(result.errors[0]?.path).toBe("hideCount");
  });

  it("rejects NaN hide count", () => {
    const result = validateGenerateQuizInput({
      text: wordText,
      method: "HIDE_WORD",
      hideCount: Number.NaN,
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("INVALID_HIDE_COUNT");
  });

  it("rejects decimal hide count", () => {
    const result = validateGenerateQuizInput({
      text: wordText,
      method: "HIDE_WORD",
      hideCount: 1.5,
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("INVALID_HIDE_COUNT");
  });

  it("rejects hide count below minimum", () => {
    const result = validateGenerateQuizInput({
      text: wordText,
      method: "HIDE_WORD",
      hideCount: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("HIDE_COUNT_TOO_LOW");
  });

  it("rejects hide count above available words", () => {
    const result = validateGenerateQuizInput({
      text: wordText,
      method: "HIDE_WORD",
      hideCount: 5,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.at(-1)?.code).toBe("HIDE_COUNT_TOO_HIGH");
    expect(result.availableCount).toBe(4);
  });

  it("rejects hide count above available lines", () => {
    const result = validateGenerateQuizInput({
      text: lineText,
      method: "HIDE_LINE",
      hideCount: 4,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.at(-1)?.code).toBe("HIDE_COUNT_TOO_HIGH");
    expect(result.availableCount).toBe(3);
  });

  it("returns first input error message", () => {
    expect(
      getGenerateQuizInputError({
        text: "",
        method: "HIDE_WORD",
        hideCount: 1,
      }),
    ).toBe("Paste Arabic Quran or matn text before generating a quiz.");
  });

  it("throws validation error from assert helper", () => {
    expect(() =>
      assertValidGenerateQuizInput({
        text: "",
        method: "HIDE_WORD",
        hideCount: 1,
      }),
    ).toThrow(GenerateQuizValidationError);
  });

  it("does not throw from assert helper for valid input", () => {
    expect(() =>
      assertValidGenerateQuizInput({
        text: wordText,
        method: "HIDE_WORD",
        hideCount: 1,
      }),
    ).not.toThrow();
  });

  it("generates validated Hide Word quiz", () => {
    const quiz = generateValidatedQuiz(
      {
        text: wordText,
        method: "HIDE_WORD",
        hideCount: 1,
      },
      () => 0,
    );

    expect(quiz.method).toBe("HIDE_WORD");
    expect(quiz.hiddenCount).toBe(1);
    expect(quiz.answers[0]?.kind).toBe("word");
  });

  it("generates validated Hide Line quiz", () => {
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

  it("throws when validated generation receives invalid input", () => {
    expect(() =>
      generateValidatedQuiz({
        text: "",
        method: "HIDE_WORD",
        hideCount: 1,
      }),
    ).toThrow(GenerateQuizValidationError);
  });

  it("returns safe success result", () => {
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

  it("returns safe failure result", () => {
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








