import { describe, expect, it } from "vitest";
import {
  createShareableQuizDocument,
  extractQuizFromShareableDocument,
  getShareableQuizDocumentSummary,
  parseShareableQuizDocument,
  serializeShareableQuizDocument,
  SHAREABLE_QUIZ_APP_ID,
  SHAREABLE_QUIZ_VERSION,
} from "@/lib/quiz/shareable-quiz";
import {
  createShareableQuizDownloadPayload,
  createShareableQuizJsonText,
} from "@/lib/quiz/shareable-quiz-export";
import {
  extractImportedQuizFromText,
  validateImportedShareableQuizText,
} from "@/lib/quiz/shareable-quiz-import";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("Phase 11 complete verification", () => {
  const exportedAt = new Date("2026-09-01T00:00:00.000Z");

  const quiz: GeneratedHideWordQuiz = {
    originalText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    quizText: "بِسْمِ ____ ____ الرَّحِيمِ",
    method: "HIDE_WORD",
    requestedCount: 2,
    hiddenCount: 2,
    selectedTokenIndexes: [2, 4],
    answers: [
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
    ],
  };

  it("has stable shareable quiz constants", () => {
    expect(SHAREABLE_QUIZ_APP_ID).toBe("matn-quiz");
    expect(SHAREABLE_QUIZ_VERSION).toBe(1);
  });

  it("creates a shareable quiz document", () => {
    const document = createShareableQuizDocument(quiz, {
      exportedAt,
    });

    expect(document.appId).toBe("matn-quiz");
    expect(document.version).toBe(1);
    expect(document.exportedAt).toBe("2026-09-01T00:00:00.000Z");
    expect(document.quiz).toEqual(quiz);
  });

  it("serializes and parses shareable quiz JSON", () => {
    const document = createShareableQuizDocument(quiz, {
      exportedAt,
    });

    const json = serializeShareableQuizDocument(document);

    expect(parseShareableQuizDocument(json)).toEqual(document);
  });

  it("creates export JSON text", () => {
    const json = createShareableQuizJsonText(quiz, {
      exportedAt,
    });

    const parsed = parseShareableQuizDocument(json);

    expect(parsed?.quiz).toEqual(quiz);
  });

  it("creates download payload", () => {
    const payload = createShareableQuizDownloadPayload(quiz, {
      exportedAt,
    });

    expect(payload.fileName).toBe("matn-quiz-hide-words-2026-09-01.json");
    expect(payload.mimeType).toBe("application/json;charset=utf-8");
    expect(parseShareableQuizDocument(payload.content)?.quiz).toEqual(quiz);
  });

  it("validates imported JSON text", () => {
    const json = createShareableQuizJsonText(quiz, {
      exportedAt,
    });

    const result = validateImportedShareableQuizText(json);

    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.quiz).toEqual(quiz);
      expect(result.document.appId).toBe("matn-quiz");
    }
  });

  it("rejects invalid imported JSON text", () => {
    const result = validateImportedShareableQuizText("{bad json");

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.issues[0]?.code).toBe("INVALID_JSON");
    }
  });

  it("extracts imported quiz from JSON text", () => {
    const json = createShareableQuizJsonText(quiz, {
      exportedAt,
    });

    expect(extractImportedQuizFromText(json)).toEqual(quiz);
  });

  it("extracts quiz from shareable document", () => {
    const document = createShareableQuizDocument(quiz, {
      exportedAt,
    });

    expect(extractQuizFromShareableDocument(document)).toEqual(quiz);
  });

  it("creates shareable document summary", () => {
    const document = createShareableQuizDocument(quiz, {
      exportedAt,
    });

    expect(getShareableQuizDocumentSummary(document)).toBe(
      "Hide Words: 2 hidden, 2 answers",
    );
  });
});




















