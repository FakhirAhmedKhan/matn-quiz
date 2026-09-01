export type QuizMethod =
  | "HIDE_WORD"
  | "HIDE_LINE";

export interface QuizMethodOption {
  value: QuizMethod;
  label: string;
  description: string;
}

export interface QuizAnswer {
  index: number;
  answer: string;
}

export interface QuranQuiz {
  originalText: string;
  quizText: string;
  method: QuizMethod;
  answers: QuizAnswer[];
}
