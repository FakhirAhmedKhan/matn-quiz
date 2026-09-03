import { describe, expect, it } from "vitest";
import {
  assertValidImportedShareableQuizText,
  extractImportedQuizFromText,
  getImportShareableQuizErrorMessage,
  getImportShareableQuizIssueSummary,
  ImportShareableQuizValidationError,
  validateImportedGeneratedQuiz,
  validateImportedShareableQuizText,
  validateImportedShareableQuizValue,
} from "@/lib/quiz/shareable-quiz-import";
import {
  createShareableQuizDocument,
  serializeShareableQuizDocument,
} from "@/lib/quiz/shareable-quiz";
import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
} from "@/types/quiz";

describe("shareable quiz import validation utilities", () => {
  const exportedAt = new Date("2026-09-01T00:00:00.000Z");

  const wordQuiz: GeneratedHideWordQuiz = {
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

  const lineQuiz: GeneratedHideLineQuiz = {
    originalText: "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ",
    quizText: "____\nالرَّحْمَٰنِ الرَّحِيمِ",
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

  function createValidJson() {
    return serializeShareableQuizDocument(
      createShareableQuizDocument(wordQuiz, {
        exportedAt,
      }),
    );
  }

  it("validates imported shareable quiz text", () => {
    const result = validateImportedShareableQuizText(createValidJson());

    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.document.appId).toBe("matn-quiz");
      expect(result.quiz).toEqual(wordQuiz);
      expect(result.issues).toEqual([]);
    }
  });

  it("validates imported shareable quiz object", () => {
    const document = createShareableQuizDocument(wordQuiz, {
      exportedAt,
    });

    const result = validateImportedShareableQuizValue(document);

    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.document).toEqual(document);
      expect(result.quiz).toEqual(wordQuiz);
    }
  });

  it("rejects empty input", () => {
    const result = validateImportedShareableQuizText("");

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.issues[0]).toMatchObject({
        code: "EMPTY_INPUT",
        path: "root",
      });
    }
  });

  it("rejects invalid JSON", () => {
    const result = validateImportedShareableQuizText("{bad json");

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.issues[0]).toMatchObject({
        code: "INVALID_JSON",
        path: "root",
      });
    }
  });

  it("rejects non-object JSON", () => {
    const result = validateImportedShareableQuizText(JSON.stringify([]));

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.issues[0]).toMatchObject({
        code: "INVALID_DOCUMENT",
        path: "root",
      });
    }
  });

  it("rejects wrong app id", () => {
    const document = {
      ...createShareableQuizDocument(wordQuiz, {
        exportedAt,
      }),
      appId: "other-app",
    };

    const result = validateImportedShareableQuizValue(document);

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "WRONG_APP",
            path: "appId",
          }),
        ]),
      );
    }
  });

  it("rejects unsupported version", () => {
    const document = {
      ...createShareableQuizDocument(wordQuiz, {
        exportedAt,
      }),
      version: 999,
    };

    const result = validateImportedShareableQuizValue(document);

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "UNSUPPORTED_VERSION",
            path: "version",
          }),
        ]),
      );
    }
  });

  it("rejects invalid exportedAt", () => {
    const document = {
      ...createShareableQuizDocument(wordQuiz, {
        exportedAt,
      }),
      exportedAt: "",
    };

    const result = validateImportedShareableQuizValue(document);

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "INVALID_EXPORTED_AT",
            path: "exportedAt",
          }),
        ]),
      );
    }
  });

  it("rejects invalid metadata", () => {
    const document = {
      ...createShareableQuizDocument(wordQuiz, {
        exportedAt,
      }),
      metadata: {},
    };

    const result = validateImportedShareableQuizValue(document);

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "INVALID_METADATA",
            path: "metadata",
          }),
        ]),
      );
    }
  });

  it("rejects invalid quiz object", () => {
    const result = validateImportedGeneratedQuiz({});

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_QUIZ_METHOD",
          path: "quiz.method",
        }),
        expect.objectContaining({
          code: "INVALID_QUIZ_TEXT",
          path: "quiz.originalText",
        }),
      ]),
    );
  });

  it("rejects invalid quiz method", () => {
    const result = validateImportedGeneratedQuiz({
      ...wordQuiz,
      method: "UNKNOWN",
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_QUIZ_METHOD",
          path: "quiz.method",
        }),
      ]),
    );
  });

  it("rejects invalid selected token indexes", () => {
    const result = validateImportedGeneratedQuiz({
      ...wordQuiz,
      selectedTokenIndexes: ["bad"],
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_SELECTED_TOKENS",
          path: "quiz.selectedTokenIndexes",
        }),
      ]),
    );
  });

  it("rejects missing selected line indexes for Hide Lines", () => {
    const result = validateImportedGeneratedQuiz({
      ...lineQuiz,
      selectedLineIndexes: undefined,
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_SELECTED_LINES",
          path: "quiz.selectedLineIndexes",
        }),
      ]),
    );
  });

  it("rejects empty answers", () => {
    const result = validateImportedGeneratedQuiz({
      ...wordQuiz,
      answers: [],
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_ANSWERS",
          path: "quiz.answers",
        }),
      ]),
    );
  });

  it("rejects answer count mismatch", () => {
    const result = validateImportedGeneratedQuiz({
      ...wordQuiz,
      hiddenCount: 3,
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_ANSWERS",
          path: "quiz.answers",
        }),
      ]),
    );
  });

  it("rejects invalid word answer", () => {
    const result = validateImportedGeneratedQuiz({
      ...wordQuiz,
      answers: [
        {
          index: 1,
          kind: "line",
          tokenIndex: 0,
          answer: "",
        },
      ],
      hiddenCount: 1,
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_ANSWER",
          path: "quiz.answers.0.kind",
        }),
        expect.objectContaining({
          code: "INVALID_ANSWER",
          path: "quiz.answers.0.answer",
        }),
        expect.objectContaining({
          code: "INVALID_ANSWER",
          path: "quiz.answers.0.wordIndex",
        }),
      ]),
    );
  });

  it("rejects invalid line answer", () => {
    const result = validateImportedGeneratedQuiz({
      ...lineQuiz,
      answers: [
        {
          index: 1,
          kind: "word",
          tokenIndex: 0,
          answer: "بِسْمِ",
        },
      ],
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "INVALID_ANSWER",
          path: "quiz.answers.0.kind",
        }),
        expect.objectContaining({
          code: "INVALID_ANSWER",
          path: "quiz.answers.0.lineIndex",
        }),
      ]),
    );
  });

  it("gets first import error message", () => {
    const result = validateImportedShareableQuizText("");

    expect(getImportShareableQuizErrorMessage(result)).toBe(
      "Paste or choose a Matn Quiz JSON file before importing.",
    );
  });

  it("returns undefined error message for valid import", () => {
    const result = validateImportedShareableQuizText(createValidJson());

    expect(getImportShareableQuizErrorMessage(result)).toBeUndefined();
  });

  it("creates issue summary", () => {
    const result = validateImportedShareableQuizValue({
      appId: "wrong-app",
      version: 999,
      quiz: {},
    });

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(getImportShareableQuizIssueSummary(result.issues)).toContain(
        "+",
      );
    }
  });

  it("creates no issue summary", () => {
    expect(getImportShareableQuizIssueSummary([])).toBe("No import issues found.");
  });

  it("asserts valid imported shareable quiz text", () => {
    const document = assertValidImportedShareableQuizText(createValidJson());

    expect(document.quiz).toEqual(wordQuiz);
  });

  it("throws validation error for invalid imported text", () => {
    expect(() => assertValidImportedShareableQuizText("")).toThrow(
      ImportShareableQuizValidationError,
    );

    try {
      assertValidImportedShareableQuizText("");
    } catch (error) {
      expect(error).toBeInstanceOf(ImportShareableQuizValidationError);
      expect((error as ImportShareableQuizValidationError).issues[0]?.code).toBe(
        "EMPTY_INPUT",
      );
    }
  });

  it("extracts imported quiz from text", () => {
    expect(extractImportedQuizFromText(createValidJson())).toEqual(wordQuiz);
  });

  it("returns null when extracting invalid import", () => {
    expect(extractImportedQuizFromText("{bad json")).toBeNull();
  });
});





















