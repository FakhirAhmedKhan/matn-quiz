import type {
  ArabicInputStats,
  ArabicInputValidation,
} from "../types/quiz";

const ARABIC_CHARACTER_REGEX =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/u;

const ARABIC_CHARACTERS_GLOBAL_REGEX =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/gu;

export function getArabicInputStats(
  text: string,
): ArabicInputStats {
  const normalized = text.replace(/\r\n/g, "\n");

  const trimmed = normalized.trim();

  const words =
    trimmed.length === 0
      ? []
      : trimmed
          .split(/\s+/u)
          .filter(Boolean);

  const lines =
    trimmed.length === 0
      ? []
      : normalized
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

  const arabicCharacters =
    normalized.match(
      ARABIC_CHARACTERS_GLOBAL_REGEX,
    )?.length ?? 0;

  return {
    characters: Array.from(normalized).length,
    words: words.length,
    lines: lines.length,
    arabicCharacters,
  };
}

export function validateArabicInput(
  text: string,
): ArabicInputValidation {
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      valid: false,
      message:
        "Paste Arabic Quran or matn text to continue.",
    };
  }

  if (!ARABIC_CHARACTER_REGEX.test(trimmed)) {
    return {
      valid: false,
      message:
        "Please enter Arabic Quran or matn text.",
    };
  }

  const stats = getArabicInputStats(text);

  if (stats.words < 2) {
    return {
      valid: false,
      message:
        "Add at least two words before continuing.",
    };
  }

  return {
    valid: true,
    message:
      "Arabic text is ready for quiz setup.",
  };
}