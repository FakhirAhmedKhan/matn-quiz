import { describe, expect, it } from "vitest";
import {
  clearSavedQuizHistory,
  createEmptyQuizHistoryDocument,
  createQuizHistoryDocument,
  createSavedQuizId,
  createSavedQuizRecord,
  createSavedQuizTitle,
  isGeneratedQuiz,
  isQuizHistoryDocument,
  isSavedQuizRecord,
  MAX_SAVED_QUIZ_HISTORY,
  normalizeQuizHistoryItems,
  parseQuizHistoryDocument,
  QUIZ_HISTORY_STORAGE_KEY,
  QUIZ_HISTORY_VERSION,
  removeSavedQuizRecord,
  serializeQuizHistoryDocument,
  upsertSavedQuizRecord,
} from "@/lib/quiz/quiz-history";
import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
} from "@/types/quiz";

describe("quiz history utilities", () => {
  const now = new Date("2026-09-01T00:00:00.000Z");

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

  it("defines history constants", () => {
    expect(QUIZ_HISTORY_VERSION).toBe(1);
    expect(QUIZ_HISTORY_STORAGE_KEY).toBe("matn-quiz:history:v1");
    expect(MAX_SAVED_QUIZ_HISTORY).toBe(20);
  });

  it("creates deterministic saved quiz id", () => {
    expect(createSavedQuizId(now, () => 0)).toBe(
      "quiz_20260901000000_0000",
    );
  });

  it("creates saved quiz title for Hide Words", () => {
    expect(createSavedQuizTitle(wordQuiz)).toBe(
      "Hide Words · 2 hidden · بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );
  });

  it("creates saved quiz title for Hide Lines", () => {
    expect(createSavedQuizTitle(lineQuiz)).toBe(
      "Hide Lines · 1 hidden · بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );
  });

  it("creates saved quiz record", () => {
    const record = createSavedQuizRecord(wordQuiz, {
      id: "saved-quiz-1",
      now,
    });

    expect(record).toEqual({
      id: "saved-quiz-1",
      version: QUIZ_HISTORY_VERSION,
      title: "Hide Words · 2 hidden · بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      quiz: wordQuiz,
      createdAt: "2026-09-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
    });
  });

  it("supports custom saved quiz title", () => {
    const record = createSavedQuizRecord(wordQuiz, {
      id: "saved-quiz-1",
      now,
      title: "My custom quiz",
    });

    expect(record.title).toBe("My custom quiz");
  });

  it("creates empty history document", () => {
    expect(createEmptyQuizHistoryDocument(now)).toEqual({
      version: QUIZ_HISTORY_VERSION,
      savedAt: "2026-09-01T00:00:00.000Z",
      items: [],
    });
  });

  it("creates history document from items", () => {
    const record = createSavedQuizRecord(wordQuiz, {
      id: "saved-quiz-1",
      now,
    });

    expect(createQuizHistoryDocument([record], now)).toEqual({
      version: QUIZ_HISTORY_VERSION,
      savedAt: "2026-09-01T00:00:00.000Z",
      items: [record],
    });
  });

  it("serializes and parses history document", () => {
    const record = createSavedQuizRecord(wordQuiz, {
      id: "saved-quiz-1",
      now,
    });

    const document = createQuizHistoryDocument([record], now);
    const serialized = serializeQuizHistoryDocument(document);

    expect(parseQuizHistoryDocument(serialized)).toEqual(document);
  });

  it("returns null for missing document", () => {
    expect(parseQuizHistoryDocument(null)).toBeNull();
    expect(parseQuizHistoryDocument(undefined)).toBeNull();
    expect(parseQuizHistoryDocument("")).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    expect(parseQuizHistoryDocument("{bad json")).toBeNull();
  });

  it("returns null for invalid document shape", () => {
    expect(parseQuizHistoryDocument(JSON.stringify({ version: 999 }))).toBeNull();
  });

  it("detects generated quiz shape", () => {
    expect(isGeneratedQuiz(wordQuiz)).toBe(true);
    expect(isGeneratedQuiz(lineQuiz)).toBe(true);
    expect(isGeneratedQuiz({})).toBe(false);
  });

  it("detects saved quiz record shape", () => {
    const record = createSavedQuizRecord(wordQuiz, {
      id: "saved-quiz-1",
      now,
    });

    expect(isSavedQuizRecord(record)).toBe(true);
    expect(isSavedQuizRecord({ ...record, id: "" })).toBe(false);
    expect(isSavedQuizRecord({ ...record, quiz: {} })).toBe(false);
  });

  it("detects history document shape", () => {
    const record = createSavedQuizRecord(wordQuiz, {
      id: "saved-quiz-1",
      now,
    });

    const document = createQuizHistoryDocument([record], now);

    expect(isQuizHistoryDocument(document)).toBe(true);
    expect(isQuizHistoryDocument({ ...document, items: [{}] })).toBe(false);
  });

  it("normalizes duplicate history items", () => {
    const first = createSavedQuizRecord(wordQuiz, {
      id: "same-id",
      now,
      title: "First",
    });

    const second = createSavedQuizRecord(lineQuiz, {
      id: "same-id",
      now,
      title: "Second",
    });

    expect(normalizeQuizHistoryItems([first, second])).toEqual([first]);
  });

  it("limits normalized history items", () => {
    const items = Array.from({ length: 25 }, (_, index) =>
      createSavedQuizRecord(wordQuiz, {
        id: `quiz-${index}`,
        now,
      }),
    );

    expect(normalizeQuizHistoryItems(items)).toHaveLength(20);
  });

  it("upserts new saved quiz record at the start", () => {
    const first = createSavedQuizRecord(wordQuiz, {
      id: "first",
      now,
    });

    const second = createSavedQuizRecord(lineQuiz, {
      id: "second",
      now,
    });

    expect(upsertSavedQuizRecord([first], second)).toEqual([second, first]);
  });

  it("upserts duplicate saved quiz record by replacing old item", () => {
    const oldRecord = createSavedQuizRecord(wordQuiz, {
      id: "same-id",
      now,
      title: "Old",
    });

    const newRecord = createSavedQuizRecord(lineQuiz, {
      id: "same-id",
      now,
      title: "New",
    });

    expect(upsertSavedQuizRecord([oldRecord], newRecord)).toEqual([newRecord]);
  });

  it("does not mutate original history items when upserting", () => {
    const first = createSavedQuizRecord(wordQuiz, {
      id: "first",
      now,
    });

    const items = [first];

    upsertSavedQuizRecord(items, createSavedQuizRecord(lineQuiz, {
      id: "second",
      now,
    }));

    expect(items).toEqual([first]);
  });

  it("removes saved quiz record by id", () => {
    const first = createSavedQuizRecord(wordQuiz, {
      id: "first",
      now,
    });

    const second = createSavedQuizRecord(lineQuiz, {
      id: "second",
      now,
    });

    expect(removeSavedQuizRecord([first, second], "first")).toEqual([second]);
  });

  it("clears saved quiz history", () => {
    expect(clearSavedQuizHistory()).toEqual([]);
  });
});
