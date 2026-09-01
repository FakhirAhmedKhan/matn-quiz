import type {
  GeneratedQuiz,
  GeneratedQuizAnswer,
} from "@/types/quiz";

export type AnswerRevealMode = "hidden" | "revealed";

export interface StudyAnswerState {
  answerIndex: number;
  tokenIndex: number;
  kind: GeneratedQuizAnswer["kind"];
  mode: AnswerRevealMode;
}

export interface QuizStudyState {
  quiz: GeneratedQuiz;
  answers: StudyAnswerState[];
}

export interface StudyProgress {
  total: number;
  revealed: number;
  hidden: number;
  complete: boolean;
  percentage: number;
}

export const HIDDEN_ANSWER_PLACEHOLDER = "••••";

export function createStudyAnswerState(
  answer: GeneratedQuizAnswer,
): StudyAnswerState {
  return {
    answerIndex: answer.index,
    tokenIndex: answer.tokenIndex,
    kind: answer.kind,
    mode: "hidden",
  };
}

export function createQuizStudyState(quiz: GeneratedQuiz): QuizStudyState {
  return {
    quiz,
    answers: quiz.answers.map(createStudyAnswerState),
  };
}

export function getStudyAnswerState(
  state: QuizStudyState,
  answerIndex: number,
): StudyAnswerState | undefined {
  return state.answers.find((answer) => answer.answerIndex === answerIndex);
}

export function isAnswerRevealed(
  state: QuizStudyState,
  answerIndex: number,
): boolean {
  return getStudyAnswerState(state, answerIndex)?.mode === "revealed";
}

export function revealAnswer(
  state: QuizStudyState,
  answerIndex: number,
): QuizStudyState {
  return {
    ...state,
    answers: state.answers.map((answer) =>
      answer.answerIndex === answerIndex
        ? {
            ...answer,
            mode: "revealed",
          }
        : answer,
    ),
  };
}

export function hideAnswer(
  state: QuizStudyState,
  answerIndex: number,
): QuizStudyState {
  return {
    ...state,
    answers: state.answers.map((answer) =>
      answer.answerIndex === answerIndex
        ? {
            ...answer,
            mode: "hidden",
          }
        : answer,
    ),
  };
}

export function toggleAnswer(
  state: QuizStudyState,
  answerIndex: number,
): QuizStudyState {
  return isAnswerRevealed(state, answerIndex)
    ? hideAnswer(state, answerIndex)
    : revealAnswer(state, answerIndex);
}

export function revealAllAnswers(state: QuizStudyState): QuizStudyState {
  return {
    ...state,
    answers: state.answers.map((answer) => ({
      ...answer,
      mode: "revealed",
    })),
  };
}

export function hideAllAnswers(state: QuizStudyState): QuizStudyState {
  return {
    ...state,
    answers: state.answers.map((answer) => ({
      ...answer,
      mode: "hidden",
    })),
  };
}

export function getStudyProgress(state: QuizStudyState): StudyProgress {
  const total = state.answers.length;
  const revealed = state.answers.filter(
    (answer) => answer.mode === "revealed",
  ).length;
  const hidden = total - revealed;

  return {
    total,
    revealed,
    hidden,
    complete: total > 0 && revealed === total,
    percentage: total === 0 ? 0 : Math.round((revealed / total) * 100),
  };
}

export function getAnswerDisplayValue(
  answer: GeneratedQuizAnswer,
  state: QuizStudyState,
  placeholder = HIDDEN_ANSWER_PLACEHOLDER,
): string {
  return isAnswerRevealed(state, answer.index)
    ? answer.answer
    : placeholder;
}

export function getVisibleAnswers(
  state: QuizStudyState,
  placeholder = HIDDEN_ANSWER_PLACEHOLDER,
): string[] {
  return state.quiz.answers.map((answer) =>
    getAnswerDisplayValue(answer, state, placeholder),
  );
}

export function resetStudyState(state: QuizStudyState): QuizStudyState {
  return hideAllAnswers(state);
}
