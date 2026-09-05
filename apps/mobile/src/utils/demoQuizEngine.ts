import type {
  GeneratedQuiz,
  QuizMethod,
} from "../types/quiz";

import {
  generateMobileQuizFromCore,
} from "./quizCoreAdapter";

export {
  generateMobileQuizFromCore,
} from "./quizCoreAdapter";

export function generateDemoQuiz(
  text: string,
  method: QuizMethod,
  requestedCount: number,
): GeneratedQuiz | null {
  return generateMobileQuizFromCore(
    text,
    method,
    requestedCount,
  );
}
