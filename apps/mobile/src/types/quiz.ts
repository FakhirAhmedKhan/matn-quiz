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