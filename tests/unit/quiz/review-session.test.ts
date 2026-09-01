import { describe, expect, it } from "vitest";
import {
  createQuizReviewState,
  createReviewAnswerState,
  getNextUnansweredAnswerIndex,
  getQuizReviewCompletionText,
  getQuizReviewProgress,
  getQuizReviewProgressSummary,
  getQuizReviewScoreText,
  getReviewAnswerState,
  getReviewAnswerStatusLabel,
  isQuizReviewComplete,
  isReviewAnswerMarked,
  markReviewAnswer,
  markReviewAnswerCorrect,
  markReviewAnswerIncorrect,
  resetQuizReviewState,
  resetReviewAnswer,
} from "@/lib/quiz/review-session";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("review session utilities", () => {
  const startedAt = new Date("2026-09-01T00:00:00.000Z");
  const reviewedAt = new Date("2026-09-01T00:10:00.000Z");
  const resetAt = new Date("2026-09-01T00:20:00.000Z");

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

  it("creates review answer state", () => {
    expect(createReviewAnswerState(quiz.answers[0]!)).toEqual({
      answerIndex: 1,
      tokenIndex: 2,
      kind: "word",
      answer: "اللَّهِ",
      status: "unanswered",
    });
  });

  it("creates quiz review state", () => {
    expect(
      createQuizReviewState(quiz, {
        now: startedAt,
      }),
    ).toEqual({
      quiz,
      startedAt: "2026-09-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
      answers: [
        {
          answerIndex: 1,
          tokenIndex: 2,
          kind: "word",
          answer: "اللَّهِ",
          status: "unanswered",
        },
        {
          answerIndex: 2,
          tokenIndex: 4,
          kind: "word",
          answer: "الرَّحْمَٰنِ",
          status: "unanswered",
        },
      ],
    });
  });

  it("gets review answer by answer index", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    expect(getReviewAnswerState(state, 1)?.answer).toBe("اللَّهِ");
    expect(getReviewAnswerState(state, 999)).toBeUndefined();
  });

  it("marks answer as correct", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    const nextState = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });

    expect(nextState).not.toBe(state);
    expect(getReviewAnswerState(nextState, 1)).toMatchObject({
      status: "correct",
      reviewedAt: "2026-09-01T00:10:00.000Z",
    });
    expect(nextState.updatedAt).toBe("2026-09-01T00:10:00.000Z");
    expect(getReviewAnswerState(state, 1)?.status).toBe("unanswered");
  });

  it("marks answer as incorrect", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    const nextState = markReviewAnswerIncorrect(state, 2, {
      now: reviewedAt,
    });

    expect(getReviewAnswerState(nextState, 2)).toMatchObject({
      status: "incorrect",
      reviewedAt: "2026-09-01T00:10:00.000Z",
    });
  });

  it("marks answer with generic status helper", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    const nextState = markReviewAnswer(state, 1, "correct", {
      now: reviewedAt,
    });

    expect(getReviewAnswerState(nextState, 1)?.status).toBe("correct");
  });

  it("returns same state when answer index does not exist", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    expect(
      markReviewAnswerCorrect(state, 999, {
        now: reviewedAt,
      }),
    ).toBe(state);
  });

  it("checks if review answer is marked", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    expect(isReviewAnswerMarked(state, 1)).toBe(false);

    const nextState = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });

    expect(isReviewAnswerMarked(nextState, 1)).toBe(true);
  });

  it("resets one answer", () => {
    const state = markReviewAnswerCorrect(
      createQuizReviewState(quiz, {
        now: startedAt,
      }),
      1,
      {
        now: reviewedAt,
      },
    );

    const nextState = resetReviewAnswer(state, 1, {
      now: resetAt,
    });

    expect(getReviewAnswerState(nextState, 1)).toEqual({
      answerIndex: 1,
      tokenIndex: 2,
      kind: "word",
      answer: "اللَّهِ",
      status: "unanswered",
    });
    expect(nextState.updatedAt).toBe("2026-09-01T00:20:00.000Z");
  });

  it("resets complete review state", () => {
    let state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    state = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });
    state = markReviewAnswerIncorrect(state, 2, {
      now: reviewedAt,
    });

    const resetState = resetQuizReviewState(state, {
      now: resetAt,
    });

    expect(resetState.startedAt).toBe("2026-09-01T00:00:00.000Z");
    expect(resetState.updatedAt).toBe("2026-09-01T00:20:00.000Z");
    expect(resetState.answers.every((answer) => answer.status === "unanswered")).toBe(
      true,
    );
    expect(resetState.answers.every((answer) => !answer.reviewedAt)).toBe(true);
  });

  it("calculates empty progress", () => {
    const state = createQuizReviewState(
      {
        ...quiz,
        hiddenCount: 0,
        answers: [],
      },
      {
        now: startedAt,
      },
    );

    expect(getQuizReviewProgress(state)).toEqual({
      total: 0,
      reviewed: 0,
      unanswered: 0,
      correct: 0,
      incorrect: 0,
      complete: false,
      reviewPercentage: 0,
      accuracyPercentage: 0,
    });
  });

  it("calculates partial progress", () => {
    const state = markReviewAnswerCorrect(
      createQuizReviewState(quiz, {
        now: startedAt,
      }),
      1,
      {
        now: reviewedAt,
      },
    );

    expect(getQuizReviewProgress(state)).toEqual({
      total: 2,
      reviewed: 1,
      unanswered: 1,
      correct: 1,
      incorrect: 0,
      complete: false,
      reviewPercentage: 50,
      accuracyPercentage: 100,
    });
  });

  it("calculates complete progress", () => {
    let state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    state = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });
    state = markReviewAnswerIncorrect(state, 2, {
      now: reviewedAt,
    });

    expect(getQuizReviewProgress(state)).toEqual({
      total: 2,
      reviewed: 2,
      unanswered: 0,
      correct: 1,
      incorrect: 1,
      complete: true,
      reviewPercentage: 100,
      accuracyPercentage: 50,
    });
    expect(isQuizReviewComplete(state)).toBe(true);
  });

  it("gets next unanswered answer index", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    expect(getNextUnansweredAnswerIndex(state)).toBe(1);

    const nextState = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });

    expect(getNextUnansweredAnswerIndex(nextState)).toBe(2);
  });

  it("returns undefined when no unanswered answers remain", () => {
    let state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    state = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });
    state = markReviewAnswerCorrect(state, 2, {
      now: reviewedAt,
    });

    expect(getNextUnansweredAnswerIndex(state)).toBeUndefined();
  });

  it("gets status labels", () => {
    expect(getReviewAnswerStatusLabel("unanswered")).toBe("Unanswered");
    expect(getReviewAnswerStatusLabel("correct")).toBe("Correct");
    expect(getReviewAnswerStatusLabel("incorrect")).toBe("Incorrect");
  });

  it("gets score text", () => {
    const state = markReviewAnswerCorrect(
      createQuizReviewState(quiz, {
        now: startedAt,
      }),
      1,
      {
        now: reviewedAt,
      },
    );

    expect(getQuizReviewScoreText(state)).toBe("1/2 correct");
  });

  it("gets progress summary", () => {
    const state = markReviewAnswerCorrect(
      createQuizReviewState(quiz, {
        now: startedAt,
      }),
      1,
      {
        now: reviewedAt,
      },
    );

    expect(getQuizReviewProgressSummary(state)).toBe(
      "1 of 2 reviewed · 100% accuracy",
    );
  });

  it("gets incomplete completion text", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    expect(getQuizReviewCompletionText(state)).toBe("2 answers left to review");
  });

  it("gets singular incomplete completion text", () => {
    const state = markReviewAnswerCorrect(
      createQuizReviewState(quiz, {
        now: startedAt,
      }),
      1,
      {
        now: reviewedAt,
      },
    );

    expect(getQuizReviewCompletionText(state)).toBe("1 answer left to review");
  });

  it("gets complete completion text", () => {
    let state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    state = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });
    state = markReviewAnswerCorrect(state, 2, {
      now: reviewedAt,
    });

    expect(getQuizReviewCompletionText(state)).toBe(
      "Review complete · 2/2 correct",
    );
  });
});







