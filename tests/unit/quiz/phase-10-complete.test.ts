import { describe, expect, it } from "vitest";
import {
  createQuizHistoryDocument,
  createSavedQuizRecord,
  parseQuizHistoryDocument,
  QUIZ_HISTORY_STORAGE_KEY,
  serializeQuizHistoryDocument,
} from "@/lib/quiz/quiz-history";
import {
  clearQuizHistoryStorage,
  deleteSavedQuizFromHistory,
  findSavedQuizRecord,
  loadSavedQuizHistory,
  saveQuizToHistory,
  type QuizHistoryStorage,
} from "@/lib/quiz/quiz-history-repository";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

class MemoryQuizHistoryStorage implements QuizHistoryStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }
}

describe("Phase 10 complete verification", () => {
  const now = new Date("2026-09-01T00:00:00.000Z");

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

  it("has stable storage key", () => {
    expect(QUIZ_HISTORY_STORAGE_KEY).toBe("matn-quiz:history:v1");
  });

  it("creates, serializes, and parses saved quiz history", () => {
    const record = createSavedQuizRecord(quiz, {
      id: "quiz-1",
      now,
    });

    const document = createQuizHistoryDocument([record], now);
    const serialized = serializeQuizHistoryDocument(document);

    expect(parseQuizHistoryDocument(serialized)).toEqual(document);
  });

  it("saves quiz history into repository storage", () => {
    const storage = new MemoryQuizHistoryStorage();

    const record = saveQuizToHistory(quiz, {
      storage,
      now,
      id: "quiz-1",
    });

    expect(record).not.toBeNull();
    expect(loadSavedQuizHistory({ storage, now })).toEqual([record]);
  });

  it("finds saved quiz by id", () => {
    const storage = new MemoryQuizHistoryStorage();

    const record = saveQuizToHistory(quiz, {
      storage,
      now,
      id: "quiz-1",
    });

    expect(findSavedQuizRecord("quiz-1", { storage, now })).toEqual(record);
  });

  it("deletes saved quiz by id", () => {
    const storage = new MemoryQuizHistoryStorage();

    saveQuizToHistory(quiz, {
      storage,
      now,
      id: "quiz-1",
    });

    expect(loadSavedQuizHistory({ storage, now })).toHaveLength(1);

    expect(
      deleteSavedQuizFromHistory("quiz-1", {
        storage,
        now,
      }),
    ).toBe(true);

    expect(loadSavedQuizHistory({ storage, now })).toEqual([]);
  });

  it("clears saved quiz history", () => {
    const storage = new MemoryQuizHistoryStorage();

    saveQuizToHistory(quiz, {
      storage,
      now,
      id: "quiz-1",
    });

    expect(loadSavedQuizHistory({ storage, now })).toHaveLength(1);

    expect(clearQuizHistoryStorage({ storage, now })).toBe(true);
    expect(loadSavedQuizHistory({ storage, now })).toEqual([]);
  });
});

