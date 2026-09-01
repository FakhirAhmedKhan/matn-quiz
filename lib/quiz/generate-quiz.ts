import { QUIZ_METHODS } from "@/lib/constants/quiz";
import {
  generateHideLineQuiz,
  type HideLineQuizResult,
} from "@/lib/quiz/hide-line-engine";
import {
  generateHideWordQuiz,
  type HideWordQuizResult,
} from "@/lib/quiz/hide-word-engine";
import {
  assertValidGenerateQuizInput,
  validateGenerateQuizInput,
  type GenerateQuizValidationIssue,
  type UnknownGenerateQuizInput,
} from "@/lib/quiz/generate-quiz-validation";
import type { RandomNumberGenerator as LineRandomNumberGenerator } from "@/lib/quiz/line-selection";
import type { RandomNumberGenerator as WordRandomNumberGenerator } from "@/lib/quiz/word-selection";
import type {
  GenerateQuizInput,
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
  GeneratedQuiz,
  QuizMethod,
} from "@/types/quiz";

export type QuizRandomNumberGenerator =
  | WordRandomNumberGenerator
  | LineRandomNumberGenerator;

export interface SafeGenerateQuizSuccess {
  ok: true;
  quiz: GeneratedQuiz;
  errors: [];
}

export interface SafeGenerateQuizFailure {
  ok: false;
  quiz: null;
  errors: GenerateQuizValidationIssue[];
}

export type SafeGenerateQuizResult =
  | SafeGenerateQuizSuccess
  | SafeGenerateQuizFailure;

export function mapHideWordResultToGeneratedQuiz(
  result: HideWordQuizResult,
): GeneratedHideWordQuiz {
  return {
    originalText: result.originalText,
    quizText: result.quizText,
    method: result.method,
    requestedCount: result.requestedCount,
    hiddenCount: result.hiddenCount,
    selectedTokenIndexes: result.selectedTokenIndexes,
    answers: result.answers.map((answer) => ({
      ...answer,
      kind: "word",
    })),
  };
}

export function mapHideLineResultToGeneratedQuiz(
  result: HideLineQuizResult,
): GeneratedHideLineQuiz {
  return {
    originalText: result.originalText,
    quizText: result.quizText,
    method: result.method,
    requestedCount: result.requestedCount,
    hiddenCount: result.hiddenCount,
    selectedTokenIndexes: result.selectedTokenIndexes,
    selectedLineIndexes: result.selectedLineIndexes,
    answers: result.answers.map((answer) => ({
      ...answer,
      kind: "line",
    })),
  };
}

export function generateQuiz(
  input: GenerateQuizInput,
  random: QuizRandomNumberGenerator = Math.random,
): GeneratedQuiz {
  if (input.method === QUIZ_METHODS.HIDE_WORD) {
    return mapHideWordResultToGeneratedQuiz(
      generateHideWordQuiz(input.text, input.hideCount, random),
    );
  }

  return mapHideLineResultToGeneratedQuiz(
    generateHideLineQuiz(input.text, input.hideCount, random),
  );
}

export function generateQuizFromValues(
  text: string,
  method: QuizMethod,
  hideCount: number,
  random: QuizRandomNumberGenerator = Math.random,
): GeneratedQuiz {
  return generateQuiz(
    {
      text,
      method,
      hideCount,
    },
    random,
  );
}

export function generateValidatedQuiz(
  input: UnknownGenerateQuizInput,
  random: QuizRandomNumberGenerator = Math.random,
): GeneratedQuiz {
  assertValidGenerateQuizInput(input);

  return generateQuiz(input, random);
}

export function safeGenerateQuiz(
  input: UnknownGenerateQuizInput,
  random: QuizRandomNumberGenerator = Math.random,
): SafeGenerateQuizResult {
  const validation = validateGenerateQuizInput(input);

  if (!validation.valid) {
    return {
      ok: false,
      quiz: null,
      errors: validation.errors,
    };
  }

  return {
    ok: true,
    quiz: generateQuiz(input as GenerateQuizInput, random),
    errors: [],
  };
}
