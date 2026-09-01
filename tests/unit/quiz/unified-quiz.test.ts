import { describe, expect, it } from "vitest";
import {
  createGenerateQuizInput,
  getGeneratedQuizAnswerCount,
  getGeneratedQuizAnswerKind,
  getGeneratedQuizMethodLabel,
  getGeneratedQuizSummary,
  hasGeneratedQuizContent,
  isGeneratedHideLineQuiz,
  isGeneratedHideWordQuiz,
} from "@/lib/quiz/unified-quiz";
import type {
  GenerateQuizInput,
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
  GeneratedQuiz,
  GeneratedQuizAnswer,
} from "@/types/quiz";

describe("unified quiz types and helpers", () => {
  const wordQuiz: GeneratedHideWordQuiz = {
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

  const lineQuiz: GeneratedHideLineQuiz = {
    originalText: "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ",
    quizText: "____\nالرَّحْمَٰنِ",
    method: "HIDE_LINE",
    requestedCount: 1,
    hiddenCount: 1,
    selectedTokenIndexes: [0],
    selectedLineIndexes: [0],
    answers: [
      {
        index: 1,
        kind: "line",
        lineIndex: 0,
        tokenIndex: 0,
        answer: "بِسْمِ اللَّهِ",
      },
    ],
  };

  it("supports GenerateQuizInput shape", () => {
    const input: GenerateQuizInput = createGenerateQuizInput(
      "بِسْمِ اللَّهِ",
      "HIDE_WORD",
      1,
    );

    expect(input).toEqual({
      text: "بِسْمِ اللَّهِ",
      method: "HIDE_WORD",
      hideCount: 1,
    });
  });

  it("returns answer kind for Hide Words", () => {
    expect(getGeneratedQuizAnswerKind("HIDE_WORD")).toBe("word");
  });

  it("returns answer kind for Hide Lines", () => {
    expect(getGeneratedQuizAnswerKind("HIDE_LINE")).toBe("line");
  });

  it("supports generated word answer shape", () => {
    const answer: GeneratedQuizAnswer = {
      index: 1,
      kind: "word",
      wordIndex: 0,
      tokenIndex: 0,
      answer: "بِسْمِ",
    };

    expect(answer.kind).toBe("word");
    expect(answer.answer).toBe("بِسْمِ");
  });

  it("supports generated line answer shape", () => {
    const answer: GeneratedQuizAnswer = {
      index: 1,
      kind: "line",
      lineIndex: 0,
      tokenIndex: 0,
      answer: "بِسْمِ اللَّهِ",
    };

    expect(answer.kind).toBe("line");
    expect(answer.answer).toBe("بِسْمِ اللَّهِ");
  });

  it("detects Hide Word generated quiz", () => {
    const quiz: GeneratedQuiz = wordQuiz;

    expect(isGeneratedHideWordQuiz(quiz)).toBe(true);
    expect(isGeneratedHideLineQuiz(quiz)).toBe(false);
  });

  it("detects Hide Line generated quiz", () => {
    const quiz: GeneratedQuiz = lineQuiz;

    expect(isGeneratedHideLineQuiz(quiz)).toBe(true);
    expect(isGeneratedHideWordQuiz(quiz)).toBe(false);
  });

  it("checks whether generated quiz has hidden content", () => {
    expect(hasGeneratedQuizContent(wordQuiz)).toBe(true);
    expect(hasGeneratedQuizContent(lineQuiz)).toBe(true);
  });

  it("returns false when generated quiz has no hidden content", () => {
    const emptyQuiz: GeneratedHideWordQuiz = {
      originalText: "بِسْمِ اللَّهِ",
      quizText: "بِسْمِ اللَّهِ",
      method: "HIDE_WORD",
      requestedCount: 0,
      hiddenCount: 0,
      selectedTokenIndexes: [],
      answers: [],
    };

    expect(hasGeneratedQuizContent(emptyQuiz)).toBe(false);
  });

  it("gets generated quiz answer count", () => {
    expect(getGeneratedQuizAnswerCount(wordQuiz)).toBe(1);
    expect(getGeneratedQuizAnswerCount(lineQuiz)).toBe(1);
  });

  it("gets generated quiz method labels", () => {
    expect(getGeneratedQuizMethodLabel("HIDE_WORD")).toBe("Hide Words");
    expect(getGeneratedQuizMethodLabel("HIDE_LINE")).toBe("Hide Lines");
  });

  it("gets generated quiz summary for word quiz", () => {
    expect(getGeneratedQuizSummary(wordQuiz)).toBe(
      "Hide Words: 1 hidden item",
    );
  });

  it("gets generated quiz summary for line quiz", () => {
    const quiz: GeneratedHideLineQuiz = {
      ...lineQuiz,
      requestedCount: 2,
      hiddenCount: 2,
      selectedTokenIndexes: [0, 2],
      selectedLineIndexes: [0, 1],
      answers: [
        {
          index: 1,
          kind: "line",
          lineIndex: 0,
          tokenIndex: 0,
          answer: "بِسْمِ اللَّهِ",
        },
        {
          index: 2,
          kind: "line",
          lineIndex: 1,
          tokenIndex: 2,
          answer: "الرَّحْمَٰنِ",
        },
      ],
    };

    expect(getGeneratedQuizSummary(quiz)).toBe(
      "Hide Lines: 2 hidden items",
    );
  });
});

















