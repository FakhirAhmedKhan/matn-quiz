import type {
  QuizMethod,
} from "./quiz";

export type ActiveStudySession = {
  quizId: string;
  method: QuizMethod;
  textPreview: string;
  hiddenCount: number;
  revealedItemIds: string[];
  startedAt: string;
  updatedAt: string;
};

export type ResumeProgress = {
  revealed: number;
  remaining: number;
  total: number;
  percentage: number;
};