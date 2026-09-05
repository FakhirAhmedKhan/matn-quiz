import type { QuizMethod, QuizMethodOption } from "./types";

export const QURAN_TEXT_MAX_LENGTH = 5000;
export const QURAN_TEXT_MIN_WORDS = 1;
export const QURAN_TEXT_MIN_LINES = 1;

export const HIDE_COUNT_MIN = 1;
export const HIDE_COUNT_DEFAULT = 1;

export const QUIZ_METHODS = {
  HIDE_WORD: "HIDE_WORD",
  HIDE_LINE: "HIDE_LINE",
} as const satisfies Record<string, QuizMethod>;

export const DEFAULT_QUIZ_METHOD: QuizMethod = QUIZ_METHODS.HIDE_WORD;

export const QUIZ_METHOD_OPTIONS: readonly QuizMethodOption[] = [
  {
    value: QUIZ_METHODS.HIDE_WORD,
    label: "Hide Words",
    description: "Hide selected Arabic words from the text.",
  },
  {
    value: QUIZ_METHODS.HIDE_LINE,
    label: "Hide Lines",
    description: "Hide complete lines from the text.",
  },
];

export function isQuizMethod(value: unknown): value is QuizMethod {
  return (
    value === QUIZ_METHODS.HIDE_WORD ||
    value === QUIZ_METHODS.HIDE_LINE
  );
}
