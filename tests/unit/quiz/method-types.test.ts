import { describe, expect, it } from "vitest";
import {
  DEFAULT_QUIZ_METHOD,
  QUIZ_METHOD_OPTIONS,
  QUIZ_METHODS,
  isQuizMethod,
} from "@/lib/constants/quiz";
import type { QuranQuiz, QuizMethod } from "@/types/quiz";

describe("Quiz method types and constants", () => {
  it("defines Hide Word method", () => {
    expect(QUIZ_METHODS.HIDE_WORD).toBe("HIDE_WORD");
  });

  it("defines Hide Line method", () => {
    expect(QUIZ_METHODS.HIDE_LINE).toBe("HIDE_LINE");
  });

  it("uses Hide Word as the default method", () => {
    expect(DEFAULT_QUIZ_METHOD).toBe("HIDE_WORD");
  });

  it("has exactly two quiz method options", () => {
    expect(QUIZ_METHOD_OPTIONS).toHaveLength(2);
  });

  it("contains Hide Words option", () => {
    expect(QUIZ_METHOD_OPTIONS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: "HIDE_WORD",
          label: "Hide Words",
        }),
      ]),
    );
  });

  it("contains Hide Lines option", () => {
    expect(QUIZ_METHOD_OPTIONS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: "HIDE_LINE",
          label: "Hide Lines",
        }),
      ]),
    );
  });

  it("validates quiz method values", () => {
    expect(isQuizMethod("HIDE_WORD")).toBe(true);
    expect(isQuizMethod("HIDE_LINE")).toBe(true);
    expect(isQuizMethod("INVALID")).toBe(false);
    expect(isQuizMethod(null)).toBe(false);
    expect(isQuizMethod(undefined)).toBe(false);
  });

  it("supports QuizMethod type usage", () => {
    const method: QuizMethod = "HIDE_WORD";

    expect(method).toBe("HIDE_WORD");
  });

  it("supports QuranQuiz type shape", () => {
    const quiz: QuranQuiz = {
      originalText: "بِسْمِ اللَّهِ",
      quizText: "بِسْمِ □□□□",
      method: "HIDE_WORD",
      answers: [
        {
          index: 1,
          answer: "اللَّهِ",
        },
      ],
    };

    expect(quiz.method).toBe("HIDE_WORD");
    expect(quiz.answers[0]?.answer).toBe("اللَّهِ");
  });
});
