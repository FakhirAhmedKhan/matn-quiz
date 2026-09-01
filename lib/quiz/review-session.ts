import type { GeneratedQuiz, GeneratedQuizAnswer } from "@/types/quiz";

export type ReviewAnswerStatus = "unanswered" | "correct" | "incorrect";

export interface ReviewAnswerState {
  answerIndex: number;
  tokenIndex: number;
  kind: GeneratedQuizAnswer["kind"];
  answer: string;
  status: ReviewAnswerStatus;
  reviewedAt?: string;
}

export interface QuizReviewState {
  quiz: GeneratedQuiz;
  answers: ReviewAnswerState[];
  startedAt: string;
  updatedAt: string;
}

export interface QuizReviewProgress {
  total: number;
  reviewed: number;
  unanswered: number;
  correct: number;
  incorrect: number;
  complete: boolean;
  reviewPercentage: number;
  accuracyPercentage: number;
}

export interface CreateQuizReviewStateOptions {
  now?: Date;
}

export interface UpdateReviewAnswerOptions {
  now?: Date;
}

function getTimestamp(now = new Date()): string {
  return now.toISOString();
}

export function createReviewAnswerState(
  answer: GeneratedQuizAnswer,
): ReviewAnswerState {
  return {
    answerIndex: answer.index,
    tokenIndex: answer.tokenIndex,
    kind: answer.kind,
    answer: answer.answer,
    status: "unanswered",
  };
}

export function createQuizReviewState(
  quiz: GeneratedQuiz,
  options: CreateQuizReviewStateOptions = {},
): QuizReviewState {
  const timestamp = getTimestamp(options.now);

  return {
    quiz,
    answers: quiz.answers.map(createReviewAnswerState),
    startedAt: timestamp,
    updatedAt: timestamp,
  };
}

export function getReviewAnswerState(
  state: QuizReviewState,
  answerIndex: number,
): ReviewAnswerState | undefined {
  return state.answers.find((answer) => answer.answerIndex === answerIndex);
}

export function isReviewAnswerMarked(
  state: QuizReviewState,
  answerIndex: number,
): boolean {
  const answer = getReviewAnswerState(state, answerIndex);

  return Boolean(answer && answer.status !== "unanswered");
}

export function markReviewAnswer(
  state: QuizReviewState,
  answerIndex: number,
  status: ReviewAnswerStatus,
  options: UpdateReviewAnswerOptions = {},
): QuizReviewState {
  const timestamp = getTimestamp(options.now);
  let changed = false;

  const answers = state.answers.map((answer) => {
    if (answer.answerIndex !== answerIndex) {
      return answer;
    }

    changed = true;

    if (status === "unanswered") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reviewedAt: _reviewedAt, ...rest } = answer;

      return {
        ...rest,
        status,
      };
    }

    return {
      ...answer,
      status,
      reviewedAt: timestamp,
    };
  });

  if (!changed) {
    return state;
  }

  return {
    ...state,
    answers,
    updatedAt: timestamp,
  };
}

export function markReviewAnswerCorrect(
  state: QuizReviewState,
  answerIndex: number,
  options: UpdateReviewAnswerOptions = {},
): QuizReviewState {
  return markReviewAnswer(state, answerIndex, "correct", options);
}

export function markReviewAnswerIncorrect(
  state: QuizReviewState,
  answerIndex: number,
  options: UpdateReviewAnswerOptions = {},
): QuizReviewState {
  return markReviewAnswer(state, answerIndex, "incorrect", options);
}

export function resetReviewAnswer(
  state: QuizReviewState,
  answerIndex: number,
  options: UpdateReviewAnswerOptions = {},
): QuizReviewState {
  return markReviewAnswer(state, answerIndex, "unanswered", options);
}

export function resetQuizReviewState(
  state: QuizReviewState,
  options: UpdateReviewAnswerOptions = {},
): QuizReviewState {
  const timestamp = getTimestamp(options.now);

  return {
    ...state,
    answers: state.answers.map((answer) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reviewedAt: _reviewedAt, ...rest } = answer;

      return {
        ...rest,
        status: "unanswered",
      };
    }),
    updatedAt: timestamp,
  };
}

export function getQuizReviewProgress(
  state: QuizReviewState,
): QuizReviewProgress {
  const total = state.answers.length;
  const correct = state.answers.filter(
    (answer) => answer.status === "correct",
  ).length;
  const incorrect = state.answers.filter(
    (answer) => answer.status === "incorrect",
  ).length;
  const reviewed = correct + incorrect;
  const unanswered = Math.max(total - reviewed, 0);

  return {
    total,
    reviewed,
    unanswered,
    correct,
    incorrect,
    complete: total > 0 && reviewed === total,
    reviewPercentage: total === 0 ? 0 : Math.round((reviewed / total) * 100),
    accuracyPercentage:
      reviewed === 0 ? 0 : Math.round((correct / reviewed) * 100),
  };
}

export function isQuizReviewComplete(state: QuizReviewState): boolean {
  return getQuizReviewProgress(state).complete;
}

export function getNextUnansweredAnswerIndex(
  state: QuizReviewState,
): number | undefined {
  return state.answers.find((answer) => answer.status === "unanswered")
    ?.answerIndex;
}

export function getReviewAnswerStatusLabel(
  status: ReviewAnswerStatus,
): string {
  if (status === "correct") {
    return "Correct";
  }

  if (status === "incorrect") {
    return "Incorrect";
  }

  return "Unanswered";
}

export function getQuizReviewScoreText(state: QuizReviewState): string {
  const progress = getQuizReviewProgress(state);

  return `${progress.correct}/${progress.total} correct`;
}

export function getQuizReviewProgressSummary(state: QuizReviewState): string {
  const progress = getQuizReviewProgress(state);

  return `${progress.reviewed} of ${progress.total} reviewed · ${progress.accuracyPercentage}% accuracy`;
}

export function getQuizReviewCompletionText(state: QuizReviewState): string {
  const progress = getQuizReviewProgress(state);

  if (progress.complete) {
    return `Review complete · ${progress.correct}/${progress.total} correct`;
  }

  return `${progress.unanswered} answer${
    progress.unanswered === 1 ? "" : "s"
  } left to review`;
}
