import { describe, expect, it } from "vitest";
import {
  createPersistedStudySessionDocument,
  extractPersistedStudySessionPayload,
  getPersistedStudySessionProgressSummary,
  hasPersistedStudySessionProgress,
  parsePersistedStudySessionDocument,
  PERSISTED_STUDY_SESSION_APP_ID,
  PERSISTED_STUDY_SESSION_STORAGE_KEY,
  PERSISTED_STUDY_SESSION_VERSION,
  serializePersistedStudySessionDocument,
} from "@/lib/quiz/study-session-persistence";
import {
  clearPersistedStudySession,
  loadPersistedStudySession,
  savePersistedStudySession,
  type PersistedStudySessionStorage,
} from "@/lib/quiz/study-session-repository";
import {
  createQuizReviewState,
  markReviewAnswerCorrect,
} from "@/lib/quiz/review-session";
import {
  createQuizStudyState,
  revealAnswer,
} from "@/lib/quiz/study-session";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

class MemoryStorage implements PersistedStudySessionStorage {
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

describe("Phase 13 complete verification", () => {
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

  function createPayload() {
    const studyState = revealAnswer(createQuizStudyState(quiz), 1);
    const reviewState = markReviewAnswerCorrect(
      createQuizReviewState(quiz, {
        now,
      }),
      1,
      {
        now: later,
      },
    );

    return {
      studyState,
      reviewState,
    };
  }

  it("has stable persisted study session constants", () => {
    expect(PERSISTED_STUDY_SESSION_APP_ID).toBe("matn-quiz");
    expect(PERSISTED_STUDY_SESSION_VERSION).toBe(1);
    expect(PERSISTED_STUDY_SESSION_STORAGE_KEY).toBe(
      "matn-quiz:study-session:v1",
    );
  });

  it("creates, serializes, and parses persisted study session document", () => {
    const payload = createPayload();
    const document = createPersistedStudySessionDocument(payload, {
      now: later,
      sessionId: "study_complete",
    });

    const json = serializePersistedStudySessionDocument(document);

    expect(parsePersistedStudySessionDocument(json)).toEqual(document);
    expect(extractPersistedStudySessionPayload(document)).toEqual(payload);
  });

  it("detects persisted study progress", () => {
    const document = createPersistedStudySessionDocument(createPayload(), {
      now: later,
      sessionId: "study_complete",
    });

    expect(hasPersistedStudySessionProgress(document)).toBe(true);
    expect(getPersistedStudySessionProgressSummary(document)).toBe(
      "1 revealed · 1 reviewed · 100% accuracy",
    );
  });

  it("saves, loads, and clears persisted study session", () => {
    const storage = new MemoryStorage();

    const saved = savePersistedStudySession(createPayload(), {
      storage,
      now: later,
      sessionId: "study_complete",
    });

    expect(saved).not.toBeNull();

    expect(
      loadPersistedStudySession({
        storage,
      }),
    ).toEqual(saved);

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
});













