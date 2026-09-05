import {
  describe,
  expect,
  it,
} from "vitest";

import {
  generateQuiz as generateSharedQuiz,
} from "@matn-quiz/quiz-core/generate-quiz";

import {
  validateGenerateQuizInput as validateSharedQuiz,
} from "@matn-quiz/quiz-core/generate-quiz-validation";

import {
  createQuizStudyState as createSharedStudyState,
  getStudyProgress as getSharedStudyProgress,
} from "@matn-quiz/quiz-core/study-session";

import {
  createQuizReviewState as createSharedReviewState,
  getQuizReviewProgress as getSharedReviewProgress,
  markReviewAnswerCorrect as markSharedCorrect,
  markReviewAnswerIncorrect as markSharedIncorrect,
} from "@matn-quiz/quiz-core/review-session";

import {
  generateQuiz as generateWebQuiz,
} from "@/lib/quiz/generate-quiz";

import {
  validateGenerateQuizInput as validateWebQuiz,
} from "@/lib/quiz/generate-quiz-validation";

import {
  createQuizStudyState as createWebStudyState,
  getStudyProgress as getWebStudyProgress,
} from "@/lib/quiz/study-session";

import {
  createQuizReviewState as createWebReviewState,
  getQuizReviewProgress as getWebReviewProgress,
  markReviewAnswerCorrect as markWebCorrect,
  markReviewAnswerIncorrect as markWebIncorrect,
} from "@/lib/quiz/review-session";

const ARABIC_TEXT =
  "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى\nفمن كانت هجرته إلى الله ورسوله";

const deterministicRandom = () => 0.25;

describe("shared quiz-core parity", () => {
  it("matches Web Hide Word generation", () => {
    const input = {
      text: ARABIC_TEXT,
      method: "HIDE_WORD" as const,
      hideCount: 3,
    };

    expect(
      generateSharedQuiz(
        input,
        deterministicRandom,
      ),
    ).toEqual(
      generateWebQuiz(
        input,
        deterministicRandom,
      ),
    );
  });

  it("matches Web Hide Line generation", () => {
    const input = {
      text: ARABIC_TEXT,
      method: "HIDE_LINE" as const,
      hideCount: 2,
    };

    expect(
      generateSharedQuiz(
        input,
        deterministicRandom,
      ),
    ).toEqual(
      generateWebQuiz(
        input,
        deterministicRandom,
      ),
    );
  });

  it("matches Web validation for valid input", () => {
    const input = {
      text: ARABIC_TEXT,
      method: "HIDE_WORD" as const,
      hideCount: 2,
    };

    expect(
      validateSharedQuiz(input),
    ).toEqual(
      validateWebQuiz(input),
    );
  });

  it("matches Web validation for invalid input", () => {
    const input = {
      text: "English only",
      method: "HIDE_WORD" as const,
      hideCount: 2,
    };

    expect(
      validateSharedQuiz(input),
    ).toEqual(
      validateWebQuiz(input),
    );
  });

  it("matches Web Study state and progress", () => {
    const quiz =
      generateSharedQuiz(
        {
          text: ARABIC_TEXT,
          method: "HIDE_WORD",
          hideCount: 3,
        },
        deterministicRandom,
      );

    const shared =
      createSharedStudyState(
        quiz,
      );

    const web =
      createWebStudyState(
        quiz,
      );

    expect(shared).toEqual(web);

    expect(
      getSharedStudyProgress(
        shared,
      ),
    ).toEqual(
      getWebStudyProgress(
        web,
      ),
    );
  });

  it("matches Web Review progress", () => {
    const quiz =
      generateSharedQuiz(
        {
          text: ARABIC_TEXT,
          method: "HIDE_WORD",
          hideCount: 2,
        },
        deterministicRandom,
      );

    const now =
      new Date(
        "2026-01-01T00:00:00.000Z",
      );

    let shared =
      createSharedReviewState(
        quiz,
        {
          now,
        },
      );

    let web =
      createWebReviewState(
        quiz,
        {
          now,
        },
      );

    const first =
      quiz.answers[0];

    const second =
      quiz.answers[1];

    if (!first || !second) {
      throw new Error(
        "Expected at least two generated answers.",
      );
    }

    shared =
      markSharedCorrect(
        shared,
        first.index,
        {
          now,
        },
      );

    shared =
      markSharedIncorrect(
        shared,
        second.index,
        {
          now,
        },
      );

    web =
      markWebCorrect(
        web,
        first.index,
        {
          now,
        },
      );

    web =
      markWebIncorrect(
        web,
        second.index,
        {
          now,
        },
      );

    expect(shared).toEqual(web);

    expect(
      getSharedReviewProgress(
        shared,
      ),
    ).toEqual(
      getWebReviewProgress(
        web,
      ),
    );
  });
});
