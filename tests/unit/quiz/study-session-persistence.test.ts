import { describe, expect, it } from "vitest";
import {
  createPersistedStudySessionDocument,
  createPersistedStudySessionId,
  extractPersistedStudySessionPayload,
  getPersistedStudySessionProgressSummary,
  getPersistedStudySessionSavedAtLabel,
  hasPersistedStudySessionProgress,
  isPersistedStudySessionDocument,
  isQuizReviewState,
  isQuizStudyState,
  isReviewAnswerState,
  isStudyAnswerState,
  parsePersistedStudySessionDocument,
  PERSISTED_STUDY_SESSION_APP_ID,
  PERSISTED_STUDY_SESSION_STORAGE_KEY,
  PERSISTED_STUDY_SESSION_VERSION,
  serializePersistedStudySessionDocument,
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

describe("study session persistence utilities", () => {
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
    return {
      studyState: createQuizStudyState(quiz),
      reviewState: createQuizReviewState(quiz, {
        now,
      }),
    };
  }

  it("defines stable persistence constants", () => {
    expect(PERSISTED_STUDY_SESSION_APP_ID).toBe("matn-quiz");
    expect(PERSISTED_STUDY_SESSION_VERSION).toBe(1);
    expect(PERSISTED_STUDY_SESSION_STORAGE_KEY).toBe(
      "matn-quiz:study-session:v1",
    );
  });

  it("creates deterministic persisted study session id", () => {
    expect(createPersistedStudySessionId(now, () => 0)).toBe(
      "study_20260901000000_0000",
    );
  });

  it("creates persisted study session document", () => {
    const payload = createPayload();

    expect(
      createPersistedStudySessionDocument(payload, {
        now,
        sessionId: "study_custom",
      }),
    ).toEqual({
      appId: "matn-quiz",
      version: 1,
      sessionId: "study_custom",
      savedAt: "2026-09-01T00:00:00.000Z",
      studyState: payload.studyState,
      reviewState: payload.reviewState,
    });
  });

  it("creates persisted study session document with generated id", () => {
    const document = createPersistedStudySessionDocument(createPayload(), {
      now,
      random: () => 0,
    });

    expect(document.sessionId).toBe("study_20260901000000_0000");
  });

  it("validates study answer state", () => {
    const studyState = createQuizStudyState(quiz);

    expect(isStudyAnswerState(studyState.answers[0])).toBe(true);
    expect(isStudyAnswerState({})).toBe(false);
    expect(
      isStudyAnswerState({
        ...studyState.answers[0],
        mode: "bad",
      }),
    ).toBe(false);
  });

  it("validates quiz study state", () => {
    const studyState = createQuizStudyState(quiz);

    expect(isQuizStudyState(studyState)).toBe(true);
    expect(isQuizStudyState({})).toBe(false);
    expect(
      isQuizStudyState({
        ...studyState,
        answers: [{}],
      }),
    ).toBe(false);
  });

  it("validates review answer state", () => {
    const reviewState = createQuizReviewState(quiz, {
      now,
    });

    expect(isReviewAnswerState(reviewState.answers[0])).toBe(true);
    expect(isReviewAnswerState({})).toBe(false);
    expect(
      isReviewAnswerState({
        ...reviewState.answers[0],
        status: "bad",
      }),
    ).toBe(false);
  });

  it("validates quiz review state", () => {
    const reviewState = createQuizReviewState(quiz, {
      now,
    });

    expect(isQuizReviewState(reviewState)).toBe(true);
    expect(isQuizReviewState({})).toBe(false);
    expect(
      isQuizReviewState({
        ...reviewState,
        answers: [{}],
      }),
    ).toBe(false);
  });

  it("validates persisted study session document", () => {
    const document = createPersistedStudySessionDocument(createPayload(), {
      now,
      sessionId: "study_custom",
    });

    expect(isPersistedStudySessionDocument(document)).toBe(true);
    expect(isPersistedStudySessionDocument({})).toBe(false);
    expect(
      isPersistedStudySessionDocument({
        ...document,
        appId: "wrong-app",
      }),
    ).toBe(false);
    expect(
      isPersistedStudySessionDocument({
        ...document,
        version: 999,
      }),
    ).toBe(false);
    expect(
      isPersistedStudySessionDocument({
        ...document,
        studyState: {},
      }),
    ).toBe(false);
    expect(
      isPersistedStudySessionDocument({
        ...document,
        reviewState: {},
      }),
    ).toBe(false);
  });

  it("serializes and parses persisted study session document", () => {
    const document = createPersistedStudySessionDocument(createPayload(), {
      now,
      sessionId: "study_custom",
    });

    const serialized = serializePersistedStudySessionDocument(document);

    expect(JSON.parse(serialized)).toEqual(document);
    expect(parsePersistedStudySessionDocument(serialized)).toEqual(document);
  });

  it("returns null for empty or invalid persisted session JSON", () => {
    expect(parsePersistedStudySessionDocument("")).toBeNull();
    expect(parsePersistedStudySessionDocument(null)).toBeNull();
    expect(parsePersistedStudySessionDocument(undefined)).toBeNull();
    expect(parsePersistedStudySessionDocument("{bad json")).toBeNull();
    expect(
      parsePersistedStudySessionDocument(JSON.stringify({ appId: "wrong" })),
    ).toBeNull();
  });

  it("extracts persisted session payload", () => {
    const payload = createPayload();
    const document = createPersistedStudySessionDocument(payload, {
      now,
      sessionId: "study_custom",
    });

    expect(extractPersistedStudySessionPayload(document)).toEqual(payload);
  });

  it("detects no progress in a fresh session", () => {
    const document = createPersistedStudySessionDocument(createPayload(), {
      now,
      sessionId: "study_custom",
    });

    expect(hasPersistedStudySessionProgress(document)).toBe(false);
    expect(getPersistedStudySessionProgressSummary(document)).toBe(
      "0 revealed · 0 reviewed · 0% accuracy",
    );
  });

  it("detects progress when answers are revealed and reviewed", () => {
    const freshPayload = createPayload();

    const studyState = revealAnswer(freshPayload.studyState, 1);
    const reviewState = markReviewAnswerCorrect(
      freshPayload.reviewState,
      1,
      {
        now: later,
      },
    );

    const document = createPersistedStudySessionDocument(
      {
        studyState,
        reviewState,
      },
      {
        now: later,
        sessionId: "study_progress",
      },
    );

    expect(hasPersistedStudySessionProgress(document)).toBe(true);
    expect(getPersistedStudySessionProgressSummary(document)).toBe(
      "1 revealed · 1 reviewed · 100% accuracy",
    );
  });

  it("formats saved at label", () => {
    const document = createPersistedStudySessionDocument(createPayload(), {
      now,
      sessionId: "study_custom",
    });

    expect(getPersistedStudySessionSavedAtLabel(document)).toBe(
      "2026-09-01 00:00",
    );
    expect(
      getPersistedStudySessionSavedAtLabel({
        ...document,
        savedAt: "bad-date",
      }),
    ).toBe("Unknown save time");
  });
});













