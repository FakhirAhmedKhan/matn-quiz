import { QUIZ_METHODS } from "./constants";
import type {
  GenerateQuizInput,
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
  GeneratedQuiz,
  GeneratedQuizAnswerKind,
  QuizMethod,
} from "./types";

export function getGeneratedQuizAnswerKind(
  method: QuizMethod,
): GeneratedQuizAnswerKind {
  if (method === QUIZ_METHODS.HIDE_WORD) {
    return "word";
  }

  return "line";
}

export function createGenerateQuizInput(
  text: string,
  method: QuizMethod,
  hideCount: number,
): GenerateQuizInput {
  return {
    text,
    method,
    hideCount,
  };
}

export function isGeneratedHideWordQuiz(
  quiz: GeneratedQuiz,
): quiz is GeneratedHideWordQuiz {
  return quiz.method === QUIZ_METHODS.HIDE_WORD;
}

export function isGeneratedHideLineQuiz(
  quiz: GeneratedQuiz,
): quiz is GeneratedHideLineQuiz {
  return quiz.method === QUIZ_METHODS.HIDE_LINE;
}

export function hasGeneratedQuizContent(quiz: GeneratedQuiz): boolean {
  return quiz.hiddenCount > 0 && quiz.answers.length > 0;
}

export function getGeneratedQuizAnswerCount(quiz: GeneratedQuiz): number {
  return quiz.answers.length;
}

export function getGeneratedQuizMethodLabel(method: QuizMethod): string {
  if (method === QUIZ_METHODS.HIDE_WORD) {
    return "Hide Words";
  }

  return "Hide Lines";
}

export function getGeneratedQuizSummary(quiz: GeneratedQuiz): string {
  const methodLabel = getGeneratedQuizMethodLabel(quiz.method);
  const itemLabel = quiz.hiddenCount === 1 ? "item" : "items";

  return `${methodLabel}: ${quiz.hiddenCount} hidden ${itemLabel}`;
}
