import { describe, expect, it } from "vitest";
import { buildAzureSpeechSsml } from "@/lib/tts/azure-speech";
import type { GeneratedHideWordQuiz } from "@/types/quiz";
import {
  assertSpeakableTextDoesNotLeakHiddenAnswers,
  buildSpeakableTextForVisibleWords,
} from "@/lib/quiz/tts-safe-text";

describe("Phase 20 complete verification", () => {
  it("keeps provider payload limited to safe visible text", () => {
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
    const ssml = buildAzureSpeechSsml(speakableText, "ar-AE-FatimaNeural");

    expect(speakableText).toBe("بسم الرحمن الرحيم");
    expect(assertSpeakableTextDoesNotLeakHiddenAnswers(quiz, speakableText)).toBe(
      true,
    );
    expect(ssml).toContain("بسم الرحمن الرحيم");
    expect(ssml).not.toContain("____");
  });
});
