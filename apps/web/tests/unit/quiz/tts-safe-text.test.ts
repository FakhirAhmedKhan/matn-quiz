import { describe, expect, it } from "vitest";
import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
} from "@/types/quiz";
import {
  assertSpeakableTextDoesNotLeakHiddenAnswers,
  buildSpeakableTextForVisibleLine,
  buildSpeakableTextForVisibleWords,
  buildSpeakableTextFromQuiz,
  buildTtsLineOptions,
  buildTtsWordTokens,
  canSpeakQuizText,
  containsHiddenAnswerText,
  getHiddenAnswerValues,
  normalizeSpeakableArabicText,
} from "@/lib/quiz/tts-safe-text";

const wordQuiz: GeneratedHideWordQuiz = {
  originalText: "بسم الله الرحمن الرحيم",
  quizText: "بسم ____ الرحمن الرحيم",
  method: "HIDE_WORD",
  requestedCount: 1,
  hiddenCount: 1,
  selectedTokenIndexes: [2],
  answers: [
    {
      index: 1,
      tokenIndex: 2,
      wordIndex: 1,
      answer: "الله",
      kind: "word",
    },
  ],
};

const lineQuiz: GeneratedHideLineQuiz = {
  originalText: "بسم الله\nالرحمن الرحيم\nالحمد لله",
  quizText: "بسم الله\n____\nالحمد لله",
  method: "HIDE_LINE",
  requestedCount: 1,
  hiddenCount: 1,
  selectedTokenIndexes: [2],
  selectedLineIndexes: [2],
  answers: [
    {
      index: 1,
      tokenIndex: 2,
      lineIndex: 1,
      answer: "الرحمن الرحيم",
      kind: "line",
    },
  ],
};

describe("tts-safe-text", () => {
  it("normalizes speakable Arabic text", () => {
    expect(normalizeSpeakableArabicText("  بسم   الله  \n\n الرحمن  ")).toBe(
      "بسم الله\nالرحمن",
    );
  });

  it("builds word tokens and marks hidden selectedTokenIndexes", () => {
    const tokens = buildTtsWordTokens(wordQuiz);

    expect(tokens[2]).toMatchObject({
      index: 2,
      value: "الله",
      hidden: true,
    });
  });

  it("removes hidden words before speech", () => {
    const speakableText = buildSpeakableTextForVisibleWords(wordQuiz);

    expect(speakableText).toBe("بسم الرحمن الرحيم");
    expect(speakableText).not.toContain("الله");
  });

  it("never speaks selectedTokenIndexes", () => {
    const tokens = buildTtsWordTokens(wordQuiz);
    const hiddenTokenValues = tokens
      .filter((token) => wordQuiz.selectedTokenIndexes.includes(token.index))
      .map((token) => token.value.trim())
      .filter(Boolean);

    const speakableText = buildSpeakableTextForVisibleWords(wordQuiz);

    for (const hiddenValue of hiddenTokenValues) {
      expect(speakableText).not.toContain(hiddenValue);
    }
  });

  it("never speaks placeholders", () => {
    const speakableText = buildSpeakableTextForVisibleWords(wordQuiz);

    expect(speakableText).not.toContain("____");
  });

  it("detects hidden answer leakage", () => {
    expect(getHiddenAnswerValues(wordQuiz)).toEqual(["الله"]);
    expect(containsHiddenAnswerText("بسم الله", ["الله"])).toBe(true);
    expect(containsHiddenAnswerText("بسم الرحمن", ["الله"])).toBe(false);
  });

  it("builds line options with hidden line disabled", () => {
    const lines = buildTtsLineOptions(lineQuiz);

    expect(lines).toEqual([
      {
        tokenIndex: 0,
        lineNumber: 1,
        text: "بسم الله",
        hidden: false,
        speakableText: "بسم الله",
      },
      {
        tokenIndex: 2,
        lineNumber: 2,
        text: "الرحمن الرحيم",
        hidden: true,
        speakableText: "",
      },
      {
        tokenIndex: 4,
        lineNumber: 3,
        text: "الحمد لله",
        hidden: false,
        speakableText: "الحمد لله",
      },
    ]);
  });

  it("speaks only the current visible line", () => {
    expect(buildSpeakableTextForVisibleLine(lineQuiz, 0)).toBe("بسم الله");
    expect(buildSpeakableTextForVisibleLine(lineQuiz, 4)).toBe("الحمد لله");
  });

  it("returns empty text for hidden line", () => {
    expect(buildSpeakableTextForVisibleLine(lineQuiz, 2)).toBe("");
  });

  it("builds speakable text from quiz without leaking hidden answers", () => {
    const wordText = buildSpeakableTextFromQuiz({ quiz: wordQuiz });
    const firstLineText = buildSpeakableTextFromQuiz({
      quiz: lineQuiz,
      lineTokenIndex: 0,
    });
    const hiddenLineText = buildSpeakableTextFromQuiz({
      quiz: lineQuiz,
      lineTokenIndex: 2,
    });

    expect(wordText).toBe("بسم الرحمن الرحيم");
    expect(firstLineText).toBe("بسم الله");
    expect(hiddenLineText).toBe("");

    expect(assertSpeakableTextDoesNotLeakHiddenAnswers(wordQuiz, wordText)).toBe(
      true,
    );
    expect(assertSpeakableTextDoesNotLeakHiddenAnswers(lineQuiz, firstLineText))
      .toBe(true);
  });

  it("reports whether quiz has speakable text", () => {
    expect(canSpeakQuizText(wordQuiz)).toBe(true);
    expect(canSpeakQuizText(lineQuiz)).toBe(true);
  });
});
