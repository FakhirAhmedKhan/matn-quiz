export type QuizMethod =
  | "HIDE_WORD"
  | "HIDE_LINE";

export type QuizDraft = {
  text: string;
  method: QuizMethod;
  hideCount: number;
};

export type ArabicInputStats = {
  characters: number;
  words: number;
  lines: number;
  arabicCharacters: number;
};

export type ArabicInputValidation = {
  valid: boolean;
  message: string;
};

export type GeneratedQuizItemKind =
  | "word"
  | "line";

export type GeneratedQuizItem = {
  id: string;
  kind: GeneratedQuizItemKind;
  text: string;
  hidden: boolean;
  lineIndex: number;
  position: number;
};

export type GeneratedQuiz = {
  id: string;
  originalText: string;
  method: QuizMethod;
  requestedCount: number;
  hiddenCount: number;
  items: GeneratedQuizItem[];
  createdAt: string;
};