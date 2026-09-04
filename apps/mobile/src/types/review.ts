import type {
  QuizMethod,
} from "./quiz";

export type ReviewGrade =
  | "CORRECT"
  | "INCORRECT";

export type ReviewAnswer = {
  itemId: string;
  grade: ReviewGrade;
};

export type ReviewResult = {
  quizId: string;
  method: QuizMethod;
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  answers: ReviewAnswer[];
  completedAt: string;
};