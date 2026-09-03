import { describe, expect, it } from "vitest";
import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
} from "@/types/quiz";
import {
  assertSpeakableTextDoesNotLeakHiddenAnswers,
  buildSpeakableTextForVisibleLine,
  buildSpeakableTextForVisibleWords,
} from "@/lib/quiz/tts-safe-text";

describe("Phase 18 complete verification", () => {
  it("guarantees word-level TTS removes hidden words", () => {
    const quiz: GeneratedHideWordQuiz = {
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

    const speakableText = buildSpeakableTextForVisibleWords(quiz);

    expect(speakableText).toBe("بسم الرحمن الرحيم");
    expect(assertSpeakableTextDoesNotLeakHiddenAnswers(quiz, speakableText)).toBe(
      true,
    );
  });

  it("guarantees line-level TTS never speaks hidden line text", () => {
    const quiz: GeneratedHideLineQuiz = {
      originalText: "بسم الله\nالرحمن الرحيم",
      quizText: "بسم الله\n____",
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

    expect(buildSpeakableTextForVisibleLine(quiz, 0)).toBe("بسم الله");
    expect(buildSpeakableTextForVisibleLine(quiz, 2)).toBe("");
  });
});

