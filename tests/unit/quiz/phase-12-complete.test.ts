import { describe, expect, it } from "vitest";
import {
  createQuizReviewState,
  getNextUnansweredAnswerIndex,
  getQuizReviewCompletionText,
  getQuizReviewProgress,
  getQuizReviewProgressSummary,
  getQuizReviewScoreText,
  getReviewAnswerState,
  getReviewAnswerStatusLabel,
  isQuizReviewComplete,
  isReviewAnswerMarked,
  markReviewAnswerCorrect,
  markReviewAnswerIncorrect,
  resetQuizReviewState,
  resetReviewAnswer,
} from "@/lib/quiz/review-session";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("Phase 12 complete verification", () => {
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

  it("creates review state for generated quiz answers", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    expect(state.startedAt).toBe("2026-09-01T00:00:00.000Z");
    expect(state.updatedAt).toBe("2026-09-01T00:00:00.000Z");
    expect(state.answers).toHaveLength(2);
    expect(state.answers[0]).toEqual({
      answerIndex: 1,
      tokenIndex: 2,
      kind: "word",
      answer: "اللَّهِ",
      status: "unanswered",
    });
  });

  it("marks answers correct and incorrect", () => {
    let state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    state = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });

    state = markReviewAnswerIncorrect(state, 2, {
      now: reviewedAt,
    });

    expect(getReviewAnswerState(state, 1)).toMatchObject({
      status: "correct",
      reviewedAt: "2026-09-01T00:10:00.000Z",
    });

    expect(getReviewAnswerState(state, 2)).toMatchObject({
      status: "incorrect",
      reviewedAt: "2026-09-01T00:10:00.000Z",
    });
  });

  it("calculates complete review progress", () => {
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

  it("tracks next unanswered answer", () => {
    let state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    expect(getNextUnansweredAnswerIndex(state)).toBe(1);

    state = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });

    expect(getNextUnansweredAnswerIndex(state)).toBe(2);

    state = markReviewAnswerCorrect(state, 2, {
      now: reviewedAt,
    });

    expect(getNextUnansweredAnswerIndex(state)).toBeUndefined();
  });

  it("checks answer marked state", () => {
    let state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    expect(isReviewAnswerMarked(state, 1)).toBe(false);

    state = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });

    expect(isReviewAnswerMarked(state, 1)).toBe(true);
  });

  it("resets one reviewed answer", () => {
    let state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    state = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });

    state = resetReviewAnswer(state, 1, {
      now: resetAt,
    });

    expect(getReviewAnswerState(state, 1)).toEqual({
      answerIndex: 1,
      tokenIndex: 2,
      kind: "word",
      answer: "اللَّهِ",
      status: "unanswered",
    });

    expect(getQuizReviewProgress(state).reviewed).toBe(0);
  });

  it("resets full review progress", () => {
    let state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    state = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });

    state = markReviewAnswerIncorrect(state, 2, {
      now: reviewedAt,
    });

    state = resetQuizReviewState(state, {
      now: resetAt,
    });

    expect(state.updatedAt).toBe("2026-09-01T00:20:00.000Z");
    expect(getQuizReviewProgress(state)).toMatchObject({
      reviewed: 0,
      correct: 0,
      incorrect: 0,
      complete: false,
    });
  });

  it("creates review labels and text summaries", () => {
    let state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    state = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });

    expect(getReviewAnswerStatusLabel("unanswered")).toBe("Unanswered");
    expect(getReviewAnswerStatusLabel("correct")).toBe("Correct");
    expect(getReviewAnswerStatusLabel("incorrect")).toBe("Incorrect");
    expect(getQuizReviewScoreText(state)).toBe("1/2 correct");
    expect(getQuizReviewProgressSummary(state)).toBe(
      "1 of 2 reviewed · 100% accuracy",
    );
    expect(getQuizReviewCompletionText(state)).toBe("1 answer left to review");
  });
});






