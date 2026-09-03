import { describe, expect, it } from "vitest";
import type { GeneratedHideWordQuiz } from "@/types/quiz";
import {
  assertSpeakableTextDoesNotLeakHiddenAnswers,
  buildSpeakableTextForVisibleWords,
} from "@/lib/quiz/tts-safe-text";
import {
  buildGoogleTranslateTtsUrl,
  getGoogleTranslateTtsConfig,
} from "@/lib/tts/google-translate-tts";

describe("Phase 20 complete verification", () => {
  it("uses no-key Google demo TTS and keeps payload limited to safe visible text", () => {
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
    const config = getGoogleTranslateTtsConfig({});
    const url = buildGoogleTranslateTtsUrl(speakableText, config);

    expect(config.configured).toBe(true);
    expect(config.provider).toBe("google-translate-demo");
    expect(url).toContain("translate_tts");
    expect(speakableText).toBe("بسم الرحمن الرحيم");
    expect(assertSpeakableTextDoesNotLeakHiddenAnswers(quiz, speakableText)).toBe(
      true,
    );
    expect(speakableText).not.toContain("____");
  });
});
