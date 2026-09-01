import { describe, expect, it } from "vitest";
import {
  clearQuizHistoryStorage,
  deleteSavedQuizFromHistory,
  findSavedQuizRecord,
  isQuizHistoryStorageAvailable,
  loadSavedQuizHistory,
  readQuizHistoryDocument,
  saveQuizToHistory,
  writeQuizHistoryDocument,
  type QuizHistoryStorage,
} from "@/lib/quiz/quiz-history-repository";
import {
  createQuizHistoryDocument,
  createSavedQuizRecord,
  parseQuizHistoryDocument,
  QUIZ_HISTORY_STORAGE_KEY,
} from "@/lib/quiz/quiz-history";
import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
} from "@/types/quiz";

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

class ThrowingQuizHistoryStorage implements QuizHistoryStorage {
  getItem(): string | null {
    throw new Error("Storage read failed");
  }

  setItem(): void {
    throw new Error("Storage write failed");
  }

  removeItem(): void {
    throw new Error("Storage remove failed");
  }
}

describe("browser quiz history repository", () => {
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

  it("detects available storage", () => {
    const storage = new MemoryQuizHistoryStorage();

    expect(isQuizHistoryStorageAvailable(storage)).toBe(true);
  });

  it("detects unavailable storage", () => {
    expect(isQuizHistoryStorageAvailable(null)).toBe(false);
    expect(isQuizHistoryStorageAvailable(new ThrowingQuizHistoryStorage())).toBe(
      false,
    );
  });

  it("returns empty document when storage has no history", () => {
    const storage = new MemoryQuizHistoryStorage();

    expect(
      readQuizHistoryDocument({
        storage,
        now,
      }),
    ).toEqual({
      version: 1,
      savedAt: "2026-09-01T00:00:00.000Z",
      items: [],
    });
  });

  it("returns empty document when storage contains invalid JSON", () => {
    const storage = new MemoryQuizHistoryStorage();

    storage.setItem(QUIZ_HISTORY_STORAGE_KEY, "{bad json");

    expect(
      readQuizHistoryDocument({
        storage,
        now,
      }),
    ).toEqual({
      version: 1,
      savedAt: "2026-09-01T00:00:00.000Z",
      items: [],
    });
  });

  it("writes history document to storage", () => {
    const storage = new MemoryQuizHistoryStorage();

    const record = createSavedQuizRecord(wordQuiz, {
      id: "quiz-1",
      now,
    });

    const document = createQuizHistoryDocument([record], now);

    expect(
      writeQuizHistoryDocument(document, {
        storage,
        now,
      }),
    ).toBe(true);

    expect(parseQuizHistoryDocument(storage.getItem(QUIZ_HISTORY_STORAGE_KEY))).toEqual(
      document,
    );
  });

  it("returns false when writing to unavailable storage", () => {
    expect(
      writeQuizHistoryDocument(createQuizHistoryDocument([], now), {
        storage: null,
        now,
      }),
    ).toBe(false);

    expect(
      writeQuizHistoryDocument(createQuizHistoryDocument([], now), {
        storage: new ThrowingQuizHistoryStorage(),
        now,
      }),
    ).toBe(false);
  });

  it("loads saved quiz history items", () => {
    const storage = new MemoryQuizHistoryStorage();

    const record = createSavedQuizRecord(wordQuiz, {
      id: "quiz-1",
      now,
    });

    writeQuizHistoryDocument(createQuizHistoryDocument([record], now), {
      storage,
      now,
    });

    expect(loadSavedQuizHistory({ storage, now })).toEqual([record]);
  });

  it("saves generated quiz to history", () => {
    const storage = new MemoryQuizHistoryStorage();

    const record = saveQuizToHistory(wordQuiz, {
      storage,
      now,
      id: "quiz-1",
    });

    expect(record?.id).toBe("quiz-1");
    expect(record?.quiz).toEqual(wordQuiz);
    expect(loadSavedQuizHistory({ storage, now })).toEqual([record]);
  });

  it("saves newest generated quiz at the start", () => {
    const storage = new MemoryQuizHistoryStorage();

    const first = saveQuizToHistory(wordQuiz, {
      storage,
      now,
      id: "first",
    });

    const second = saveQuizToHistory(lineQuiz, {
      storage,
      now,
      id: "second",
    });

    expect(loadSavedQuizHistory({ storage, now })).toEqual([second, first]);
  });

  it("upserts saved quiz with same id", () => {
    const storage = new MemoryQuizHistoryStorage();

    saveQuizToHistory(wordQuiz, {
      storage,
      now,
      id: "same-id",
      title: "Old Quiz",
    });

    const updated = saveQuizToHistory(lineQuiz, {
      storage,
      now,
      id: "same-id",
      title: "Updated Quiz",
    });

    expect(loadSavedQuizHistory({ storage, now })).toEqual([updated]);
    expect(updated?.title).toBe("Updated Quiz");
  });

  it("returns null when saving without storage", () => {
    expect(
      saveQuizToHistory(wordQuiz, {
        storage: null,
        now,
        id: "quiz-1",
      }),
    ).toBeNull();
  });

  it("finds saved quiz record by id", () => {
    const storage = new MemoryQuizHistoryStorage();

    const record = saveQuizToHistory(wordQuiz, {
      storage,
      now,
      id: "quiz-1",
    });

    expect(findSavedQuizRecord("quiz-1", { storage, now })).toEqual(record);
    expect(findSavedQuizRecord("missing", { storage, now })).toBeUndefined();
  });

  it("deletes saved quiz from history", () => {
    const storage = new MemoryQuizHistoryStorage();

    const first = saveQuizToHistory(wordQuiz, {
      storage,
      now,
      id: "first",
    });

    saveQuizToHistory(lineQuiz, {
      storage,
      now,
      id: "second",
    });

    expect(
      deleteSavedQuizFromHistory("second", {
        storage,
        now,
      }),
    ).toBe(true);

    expect(loadSavedQuizHistory({ storage, now })).toEqual([first]);
  });

  it("returns false when deleting without storage", () => {
    expect(
      deleteSavedQuizFromHistory("quiz-1", {
        storage: null,
        now,
      }),
    ).toBe(false);
  });

  it("clears quiz history storage", () => {
    const storage = new MemoryQuizHistoryStorage();

    saveQuizToHistory(wordQuiz, {
      storage,
      now,
      id: "quiz-1",
    });

    expect(loadSavedQuizHistory({ storage, now })).toHaveLength(1);

    expect(clearQuizHistoryStorage({ storage, now })).toBe(true);
    expect(loadSavedQuizHistory({ storage, now })).toEqual([]);
  });

  it("returns false when clearing unavailable storage", () => {
    expect(
      clearQuizHistoryStorage({
        storage: null,
        now,
      }),
    ).toBe(false);

    expect(
      clearQuizHistoryStorage({
        storage: new ThrowingQuizHistoryStorage(),
        now,
      }),
    ).toBe(false);
  });
});




















