import { describe, expect, it } from "vitest";
import {
  clearPersistedStudySession,
  hasPersistedStudySession,
  isPersistedStudySessionStorageAvailable,
  loadPersistedStudySession,
  readPersistedStudySessionDocument,
  savePersistedStudySession,
  type PersistedStudySessionStorage,
  writePersistedStudySessionDocument,
} from "@/lib/quiz/study-session-repository";
import {
  createPersistedStudySessionDocument,
  PERSISTED_STUDY_SESSION_STORAGE_KEY,
  serializePersistedStudySessionDocument,
  type PersistedStudySessionPayload,
} from "@/lib/quiz/study-session-persistence";
import {
  createQuizReviewState,
  markReviewAnswerCorrect,
} from "@/lib/quiz/review-session";
import {
  createQuizStudyState,
  revealAnswer,
} from "@/lib/quiz/study-session";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

class MemoryPersistedStudySessionStorage
  implements PersistedStudySessionStorage
{
  private readonly items = new Map<string, string>();

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }

  removeItem(key: string): void {
    this.items.delete(key);
  }
}

class ThrowingPersistedStudySessionStorage
  implements PersistedStudySessionStorage
{
  getItem(): string | null {
    throw new Error("read failed");
  }

  setItem(): void {
    throw new Error("write failed");
  }

  removeItem(): void {
    throw new Error("remove failed");
  }
}

describe("study session repository", () => {
  const now = new Date("2026-09-01T00:00:00.000Z");
  const later = new Date("2026-09-01T00:10:00.000Z");

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

  function createPayload(): PersistedStudySessionPayload {
    return {
      studyState: createQuizStudyState(quiz),
      reviewState: createQuizReviewState(quiz, {
        now,
      }),
    };
  }

  function createProgressPayload(): PersistedStudySessionPayload {
    const payload = createPayload();

    return {
      studyState: revealAnswer(payload.studyState, 1),
      reviewState: markReviewAnswerCorrect(payload.reviewState, 1, {
        now: later,
      }),
    };
  }

  it("detects available storage", () => {
    expect(
      isPersistedStudySessionStorageAvailable(
        new MemoryPersistedStudySessionStorage(),
      ),
    ).toBe(true);
  });

  it("detects unavailable storage", () => {
    expect(isPersistedStudySessionStorageAvailable(null)).toBe(false);
    expect(
      isPersistedStudySessionStorageAvailable(
        new ThrowingPersistedStudySessionStorage(),
      ),
    ).toBe(false);
  });

  it("writes persisted study session document", () => {
    const storage = new MemoryPersistedStudySessionStorage();
    const document = createPersistedStudySessionDocument(createPayload(), {
      now,
      sessionId: "study_custom",
    });

    expect(
      writePersistedStudySessionDocument(document, {
        storage,
      }),
    ).toBe(true);

    expect(storage.getItem(PERSISTED_STUDY_SESSION_STORAGE_KEY)).toBe(
      serializePersistedStudySessionDocument(document),
    );
  });

  it("returns false when writing without storage", () => {
    const document = createPersistedStudySessionDocument(createPayload(), {
      now,
      sessionId: "study_custom",
    });

    expect(
      writePersistedStudySessionDocument(document, {
        storage: null,
      }),
    ).toBe(false);
  });

  it("returns false when storage write throws", () => {
    const document = createPersistedStudySessionDocument(createPayload(), {
      now,
      sessionId: "study_custom",
    });

    expect(
      writePersistedStudySessionDocument(document, {
        storage: new ThrowingPersistedStudySessionStorage(),
      }),
    ).toBe(false);
  });

  it("reads persisted study session document", () => {
    const storage = new MemoryPersistedStudySessionStorage();
    const document = createPersistedStudySessionDocument(createPayload(), {
      now,
      sessionId: "study_custom",
    });

    storage.setItem(
      PERSISTED_STUDY_SESSION_STORAGE_KEY,
      serializePersistedStudySessionDocument(document),
    );

    expect(
      readPersistedStudySessionDocument({
        storage,
      }),
    ).toEqual(document);
  });

  it("returns null when reading missing document", () => {
    expect(
      readPersistedStudySessionDocument({
        storage: new MemoryPersistedStudySessionStorage(),
      }),
    ).toBeNull();
  });

  it("returns null when reading invalid document", () => {
    const storage = new MemoryPersistedStudySessionStorage();

    storage.setItem(PERSISTED_STUDY_SESSION_STORAGE_KEY, "{bad json");

    expect(
      readPersistedStudySessionDocument({
        storage,
      }),
    ).toBeNull();
  });

  it("returns null when reading without storage", () => {
    expect(
      readPersistedStudySessionDocument({
        storage: null,
      }),
    ).toBeNull();
  });

  it("returns null when storage read throws", () => {
    expect(
      readPersistedStudySessionDocument({
        storage: new ThrowingPersistedStudySessionStorage(),
      }),
    ).toBeNull();
  });

  it("saves persisted study session payload", () => {
    const storage = new MemoryPersistedStudySessionStorage();

    const document = savePersistedStudySession(createPayload(), {
      storage,
      now,
      sessionId: "study_custom",
    });

    expect(document).not.toBeNull();
    expect(document?.sessionId).toBe("study_custom");
    expect(document?.savedAt).toBe("2026-09-01T00:00:00.000Z");

    expect(
      loadPersistedStudySession({
        storage,
      }),
    ).toEqual(document);
  });

  it("saves persisted study session with generated id", () => {
    const storage = new MemoryPersistedStudySessionStorage();

    const document = savePersistedStudySession(createPayload(), {
      storage,
      now,
      random: () => 0,
    });

    expect(document?.sessionId).toBe("study_20260901000000_0000");
  });

  it("saves progress payload", () => {
    const storage = new MemoryPersistedStudySessionStorage();

    const document = savePersistedStudySession(createProgressPayload(), {
      storage,
      now: later,
      sessionId: "study_progress",
    });

    expect(document?.sessionId).toBe("study_progress");
    expect(document?.studyState.answers[0]?.mode).toBe("revealed");
    expect(document?.reviewState.answers[0]?.status).toBe("correct");
  });

  it("returns null when saving without storage", () => {
    expect(
      savePersistedStudySession(createPayload(), {
        storage: null,
        now,
      }),
    ).toBeNull();
  });

  it("returns null when saving fails", () => {
    expect(
      savePersistedStudySession(createPayload(), {
        storage: new ThrowingPersistedStudySessionStorage(),
        now,
      }),
    ).toBeNull();
  });

  it("loads persisted study session", () => {
    const storage = new MemoryPersistedStudySessionStorage();
    const document = createPersistedStudySessionDocument(createPayload(), {
      now,
      sessionId: "study_custom",
    });

    writePersistedStudySessionDocument(document, {
      storage,
    });

    expect(
      loadPersistedStudySession({
        storage,
      }),
    ).toEqual(document);
  });

  it("detects persisted study session existence", () => {
    const storage = new MemoryPersistedStudySessionStorage();

    expect(
      hasPersistedStudySession({
        storage,
      }),
    ).toBe(false);

    savePersistedStudySession(createPayload(), {
      storage,
      now,
      sessionId: "study_custom",
    });

    expect(
      hasPersistedStudySession({
        storage,
      }),
    ).toBe(true);
  });

  it("clears persisted study session", () => {
    const storage = new MemoryPersistedStudySessionStorage();

    savePersistedStudySession(createPayload(), {
      storage,
      now,
      sessionId: "study_custom",
    });

    expect(
      clearPersistedStudySession({
        storage,
      }),
    ).toBe(true);

    expect(
      loadPersistedStudySession({
        storage,
      }),
    ).toBeNull();
  });

  it("returns false when clearing without storage", () => {
    expect(
      clearPersistedStudySession({
        storage: null,
      }),
    ).toBe(false);
  });

  it("returns false when clear throws", () => {
    expect(
      clearPersistedStudySession({
        storage: new ThrowingPersistedStudySessionStorage(),
      }),
    ).toBe(false);
  });
});











