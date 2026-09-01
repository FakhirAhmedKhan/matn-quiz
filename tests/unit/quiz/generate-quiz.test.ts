import { describe, expect, it } from "vitest";
import {
  generateQuiz,
  generateQuizFromValues,
  mapHideLineResultToGeneratedQuiz,
  mapHideWordResultToGeneratedQuiz,
} from "@/lib/quiz/generate-quiz";
import { generateHideLineQuiz } from "@/lib/quiz/hide-line-engine";
import { generateHideWordQuiz } from "@/lib/quiz/hide-word-engine";

describe("unified quiz generator dispatcher", () => {
  const wordText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  const lineText =
    "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ";

  it("generates Hide Word quiz when method is HIDE_WORD", () => {
    const result = generateQuiz(
      {
        text: wordText,
        method: "HIDE_WORD",
        hideCount: 2,
      },
      () => 0,
    );

    expect(result.method).toBe("HIDE_WORD");
    expect(result.originalText).toBe(wordText);
    expect(result.quizText).toBe(
      "بِسْمِ ____ ____ الرَّحِيمِ",
    );
    expect(result.hiddenCount).toBe(2);
    expect(result.answers).toHaveLength(2);
    expect(result.answers[0]?.kind).toBe("word");
    expect(result.answers[1]?.kind).toBe("word");
  });

  it("generates Hide Line quiz when method is HIDE_LINE", () => {
    const result = generateQuiz(
      {
        text: lineText,
        method: "HIDE_LINE",
        hideCount: 2,
      },
      () => 0,
    );

    expect(result.method).toBe("HIDE_LINE");
    expect(result.originalText).toBe(lineText);
    expect(result.quizText).toBe(
      "بِسْمِ اللَّهِ\n____\n____",
    );
    expect(result.hiddenCount).toBe(2);
    expect(result.answers).toHaveLength(2);
    expect(result.answers[0]?.kind).toBe("line");
    expect(result.answers[1]?.kind).toBe("line");
  });

  it("supports generateQuizFromValues helper for Hide Words", () => {
    const result = generateQuizFromValues(
      wordText,
      "HIDE_WORD",
      1,
      () => 0,
    );

    expect(result.method).toBe("HIDE_WORD");
    expect(result.hiddenCount).toBe(1);
    expect(result.answers[0]?.kind).toBe("word");
  });

  it("supports generateQuizFromValues helper for Hide Lines", () => {
    const result = generateQuizFromValues(
      lineText,
      "HIDE_LINE",
      1,
      () => 0,
    );

    expect(result.method).toBe("HIDE_LINE");
    expect(result.hiddenCount).toBe(1);
    expect(result.answers[0]?.kind).toBe("line");
  });

  it("maps Hide Word engine result to unified generated quiz shape", () => {
    const engineResult = generateHideWordQuiz(wordText, 2, () => 0);
    const result = mapHideWordResultToGeneratedQuiz(engineResult);

    expect(result.method).toBe("HIDE_WORD");
    expect(result.selectedTokenIndexes).toEqual([2, 4]);
    expect(result.answers).toEqual([
      {
        index: 1,
        kind: "word",
        wordIndex: 1,
        tokenIndex: 2,
        answer: "اللَّهِ",
      },
      {
        index: 2,
        kind: "word",
        wordIndex: 2,
        tokenIndex: 4,
        answer: "الرَّحْمَٰنِ",
      },
    ]);
  });

  it("maps Hide Line engine result to unified generated quiz shape", () => {
    const engineResult = generateHideLineQuiz(lineText, 2, () => 0);
    const result = mapHideLineResultToGeneratedQuiz(engineResult);

    expect(result.method).toBe("HIDE_LINE");
    expect(result.selectedTokenIndexes).toEqual([2, 4]);
    expect(result.selectedLineIndexes).toEqual([1, 2]);
    expect(result.answers).toEqual([
      {
        index: 1,
        kind: "line",
        lineIndex: 1,
        tokenIndex: 2,
        answer: "الرَّحْمَٰنِ الرَّحِيمِ",
      },
      {
        index: 2,
        kind: "line",
        lineIndex: 2,
        tokenIndex: 4,
        answer: "الْحَمْدُ لِلَّهِ",
      },
    ]);
  });

  it("preserves original text in unified Hide Word output", () => {
    const result = generateQuiz(
      {
        text: wordText,
        method: "HIDE_WORD",
        hideCount: 2,
      },
      () => 0,
    );

    expect(result.originalText).toBe(wordText);
  });

  it("preserves original text in unified Hide Line output", () => {
    const result = generateQuiz(
      {
        text: lineText,
        method: "HIDE_LINE",
        hideCount: 2,
      },
      () => 0,
    );

    expect(result.originalText).toBe(lineText);
  });

  it("clamps Hide Word count through dispatcher", () => {
    const result = generateQuiz(
      {
        text: wordText,
        method: "HIDE_WORD",
        hideCount: 99,
      },
      () => 0,
    );

    expect(result.requestedCount).toBe(99);
    expect(result.hiddenCount).toBe(4);
    expect(result.answers).toHaveLength(4);
  });

  it("clamps Hide Line count through dispatcher", () => {
    const result = generateQuiz(
      {
        text: lineText,
        method: "HIDE_LINE",
        hideCount: 99,
      },
      () => 0,
    );

    expect(result.requestedCount).toBe(99);
    expect(result.hiddenCount).toBe(3);
    expect(result.answers).toHaveLength(3);
  });

  it("returns no hidden content for zero Hide Word count", () => {
    const result = generateQuiz(
      {
        text: wordText,
        method: "HIDE_WORD",
        hideCount: 0,
      },
      () => 0,
    );

    expect(result.quizText).toBe(wordText);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("returns no hidden content for zero Hide Line count", () => {
    const result = generateQuiz(
      {
        text: lineText,
        method: "HIDE_LINE",
        hideCount: 0,
      },
      () => 0,
    );

    expect(result.quizText).toBe(lineText);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("keeps deterministic output with injected random", () => {
    const first = generateQuiz(
      {
        text: wordText,
        method: "HIDE_WORD",
        hideCount: 2,
      },
      () => 0,
    );

    const second = generateQuiz(
      {
        text: wordText,
        method: "HIDE_WORD",
        hideCount: 2,
      },
      () => 0,
    );

    expect(first).toEqual(second);
  });
});

















