export type QuizMethod = "HIDE_WORD" | "HIDE_LINE";

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

export type GeneratedQuizAnswerKind = "word" | "line";

export interface BaseGeneratedQuizAnswer {
  index: number;
  tokenIndex: number;
  answer: string;
  kind: GeneratedQuizAnswerKind;
}

export interface GeneratedWordQuizAnswer extends BaseGeneratedQuizAnswer {
  kind: "word";
  wordIndex: number;
}

export interface GeneratedLineQuizAnswer extends BaseGeneratedQuizAnswer {
  kind: "line";
  lineIndex: number;
}

export type GeneratedQuizAnswer =
  | GeneratedWordQuizAnswer
  | GeneratedLineQuizAnswer;

export interface BaseGeneratedQuiz {
  originalText: string;
  quizText: string;
  method: QuizMethod;
  requestedCount: number;
  hiddenCount: number;
  answers: GeneratedQuizAnswer[];
  selectedTokenIndexes: number[];
}

export interface GeneratedHideWordQuiz extends BaseGeneratedQuiz {
  method: "HIDE_WORD";
  answers: GeneratedWordQuizAnswer[];
}

export interface GeneratedHideLineQuiz extends BaseGeneratedQuiz {
  method: "HIDE_LINE";
  answers: GeneratedLineQuizAnswer[];
  selectedLineIndexes: number[];
}

export type GeneratedQuiz =
  | GeneratedHideWordQuiz
  | GeneratedHideLineQuiz;

export interface GenerateQuizInput {
  text: string;
  method: QuizMethod;
  hideCount: number;
}
