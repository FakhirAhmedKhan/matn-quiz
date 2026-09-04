import type {
  QuizMethod,
} from "./quiz";

export type QuizHistorySession = {
  id: string;
  quizId: string;
  method: QuizMethod;
  textPreview: string;
  hiddenCount: number;
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  completedAt: string;
};

export type QuizHistoryStats = {
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  totalAnswers: number;
  correctAnswers: number;
};