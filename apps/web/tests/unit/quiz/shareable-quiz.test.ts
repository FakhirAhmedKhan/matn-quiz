import { describe, expect, it } from "vitest";
import {
  createShareableQuizDocument,
  createShareableQuizMetadata,
  createShareableQuizTitle,
  extractQuizFromShareableDocument,
  getShareableQuizDocumentSummary,
  getShareableQuizFileName,
  isShareableQuizDocument,
  isShareableQuizMetadata,
  parseShareableQuizDocument,
  serializeShareableQuizDocument,
  SHAREABLE_QUIZ_APP_ID,
  SHAREABLE_QUIZ_FILE_EXTENSION,
  SHAREABLE_QUIZ_MIME_TYPE,
  SHAREABLE_QUIZ_VERSION,
} from "@/lib/quiz/shareable-quiz";
import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
} from "@/types/quiz";

describe("shareable quiz data utilities", () => {
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

  it("defines stable shareable quiz constants", () => {
    expect(SHAREABLE_QUIZ_APP_ID).toBe("matn-quiz");
    expect(SHAREABLE_QUIZ_VERSION).toBe(1);
    expect(SHAREABLE_QUIZ_FILE_EXTENSION).toBe(".json");
    expect(SHAREABLE_QUIZ_MIME_TYPE).toBe("application/json;charset=utf-8");
  });

  it("creates Hide Words title", () => {
    expect(createShareableQuizTitle(wordQuiz)).toBe(
      "Hide Words · 2 hidden · بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );
  });

  it("creates Hide Lines title", () => {
    expect(createShareableQuizTitle(lineQuiz)).toBe(
      "Hide Lines · 1 hidden · بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );
  });

  it("truncates long title preview", () => {
    expect(
      createShareableQuizTitle({
        ...wordQuiz,
        originalText: "ا".repeat(80),
      }),
    ).toContain("...");
  });

  it("creates metadata", () => {
    expect(createShareableQuizMetadata(wordQuiz)).toEqual({
      title: "Hide Words · 2 hidden · بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      methodLabel: "Hide Words",
      hiddenCount: 2,
      answerCount: 2,
    });
  });

  it("supports custom metadata title", () => {
    expect(createShareableQuizMetadata(wordQuiz, "My Quiz")).toEqual({
      title: "My Quiz",
      methodLabel: "Hide Words",
      hiddenCount: 2,
      answerCount: 2,
    });
  });

  it("creates document", () => {
    expect(
      createShareableQuizDocument(wordQuiz, {
        exportedAt,
      }),
    ).toEqual({
      appId: "matn-quiz",
      version: 1,
      exportedAt: "2026-09-01T00:00:00.000Z",
      metadata: {
        title: "Hide Words · 2 hidden · بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        methodLabel: "Hide Words",
        hiddenCount: 2,
        answerCount: 2,
      },
      quiz: wordQuiz,
    });
  });

  it("serializes and parses document", () => {
    const document = createShareableQuizDocument(wordQuiz, {
      exportedAt,
    });

    const serialized = serializeShareableQuizDocument(document);

    expect(JSON.parse(serialized)).toEqual(document);
    expect(parseShareableQuizDocument(serialized)).toEqual(document);
  });

  it("returns null for empty or invalid JSON", () => {
    expect(parseShareableQuizDocument("")).toBeNull();
    expect(parseShareableQuizDocument(null)).toBeNull();
    expect(parseShareableQuizDocument(undefined)).toBeNull();
    expect(parseShareableQuizDocument("{bad json")).toBeNull();
  });

  it("returns null for invalid document shape", () => {
    expect(parseShareableQuizDocument(JSON.stringify({ appId: "wrong" }))).toBeNull();
  });

  it("validates metadata", () => {
    expect(isShareableQuizMetadata(createShareableQuizMetadata(wordQuiz))).toBe(
      true,
    );
    expect(isShareableQuizMetadata({})).toBe(false);
  });

  it("validates shareable document", () => {
    const document = createShareableQuizDocument(wordQuiz, {
      exportedAt,
    });

    expect(isShareableQuizDocument(document)).toBe(true);
    expect(isShareableQuizDocument({ ...document, appId: "wrong" })).toBe(false);
    expect(isShareableQuizDocument({ ...document, version: 999 })).toBe(false);
    expect(isShareableQuizDocument({ ...document, quiz: {} })).toBe(false);
  });

  it("extracts quiz from document", () => {
    const document = createShareableQuizDocument(wordQuiz, {
      exportedAt,
    });

    expect(extractQuizFromShareableDocument(document)).toEqual(wordQuiz);
  });

  it("creates file names", () => {
    expect(getShareableQuizFileName(wordQuiz, exportedAt)).toBe(
      "matn-quiz-hide-words-2026-09-01.json",
    );
    expect(getShareableQuizFileName(lineQuiz, exportedAt)).toBe(
      "matn-quiz-hide-lines-2026-09-01.json",
    );
  });

  it("creates document summaries", () => {
    expect(
      getShareableQuizDocumentSummary(
        createShareableQuizDocument(wordQuiz, {
          exportedAt,
        }),
      ),
    ).toBe("Hide Words: 2 hidden, 2 answers");

    expect(
      getShareableQuizDocumentSummary(
        createShareableQuizDocument(lineQuiz, {
          exportedAt,
        }),
      ),
    ).toBe("Hide Lines: 1 hidden, 1 answer");
  });
});





















