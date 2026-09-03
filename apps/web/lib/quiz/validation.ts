import {
  containsArabicText,
  countArabicWords,
  countValidLines,
  isEmptyText,
} from "@/lib/utils/arabic";
import {
  QURAN_TEXT_MAX_LENGTH,
  QURAN_TEXT_MIN_LINES,
  QURAN_TEXT_MIN_WORDS,
} from "@/lib/constants/quiz";

export type QuranTextValidationCode =
  | "VALID"
  | "EMPTY_TEXT"
  | "TEXT_TOO_LONG"
  | "NO_ARABIC_TEXT"
  | "NOT_ENOUGH_WORDS"
  | "NOT_ENOUGH_LINES";

export interface QuranTextValidationResult {
  valid: boolean;
  code: QuranTextValidationCode;
  message: string;
}

export function validateQuranTextInput(
  value: string,
): QuranTextValidationResult {
  if (isEmptyText(value)) {
    return {
      valid: false,
      code: "EMPTY_TEXT",
      message: "Please paste Arabic Quran or matn text.",
    };
  }

  if (value.length > QURAN_TEXT_MAX_LENGTH) {
    return {
      valid: false,
      code: "TEXT_TOO_LONG",
      message: `Text must be ${QURAN_TEXT_MAX_LENGTH} characters or less.`,
    };
  }

  if (!containsArabicText(value)) {
    return {
      valid: false,
      code: "NO_ARABIC_TEXT",
      message: "Text must contain Arabic characters.",
    };
  }

  if (countArabicWords(value) < QURAN_TEXT_MIN_WORDS) {
    return {
      valid: false,
      code: "NOT_ENOUGH_WORDS",
      message: "Text must contain at least one Arabic word.",
    };
  }

  if (countValidLines(value) < QURAN_TEXT_MIN_LINES) {
    return {
      valid: false,
      code: "NOT_ENOUGH_LINES",
      message: "Text must contain at least one valid line.",
    };
  }

  return {
    valid: true,
    code: "VALID",
    message: "",
  };
}

export function getQuranTextInputError(value: string): string | undefined {
  const result = validateQuranTextInput(value);

  return result.valid ? undefined : result.message;
}
