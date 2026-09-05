import type { PoemStats, PoemValidation } from "@matn-quiz/shared-types/poem";

const ARABIC_CHARACTER_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/u;

const ARABIC_CHARACTERS_GLOBAL_REGEX =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/gu;

export type PoemTextLike = {
  text: string;
};

export type PoemTitleLike = {
  title: string;
};

export type PoemColumns = {
  rightColumn: string[];
  leftColumn: string[];
};

export function normalizePoemText(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function splitPoemLines(text: string): string[] {
  return normalizePoemText(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Mobile compatibility name.
 *
 * In the current application a non-empty physical poem line
 * is treated as a reader verse.
 */
export const getPoemVerses = splitPoemLines;

export function splitPoemIntoColumns(text: string): PoemColumns {
  const lines = splitPoemLines(text);

  const middle = Math.ceil(lines.length / 2);

  return {
    rightColumn: lines.slice(0, middle),

    leftColumn: lines.slice(middle),
  };
}

export function hasPoemText(draft: PoemTextLike): boolean {
  return draft.text.trim().length > 0;
}

export function getPoemDisplayTitle(draft: PoemTitleLike): string {
  return draft.title.trim() || "Untitled Poem";
}

export function getPoemStats(text: string): PoemStats {
  const normalized = normalizePoemText(text);

  const trimmed = normalized.trim();

  const physicalLines = trimmed ? normalized.split("\n") : [];

  const verses = splitPoemLines(normalized);

  const words = trimmed ? trimmed.split(/\s+/u).filter(Boolean) : [];

  const arabicCharacters =
    normalized.match(ARABIC_CHARACTERS_GLOBAL_REGEX)?.length ?? 0;

  const stanzas = trimmed
    ? normalized
        .split(/\n\s*\n+/u)
        .map((block) => block.trim())
        .filter(Boolean).length
    : 0;

  return {
    characters: Array.from(normalized).length,

    arabicCharacters,

    words: words.length,

    verses: verses.length,

    lines: physicalLines.length,

    stanzas,
  };
}

export function validatePoemDraft(title: string, text: string): PoemValidation {
  const cleanTitle = title.trim();

  const cleanText = text.trim();

  if (!cleanTitle) {
    return {
      valid: false,

      titleValid: false,

      textValid: false,

      message: "Add a poem title to continue.",
    };
  }

  if (cleanTitle.length < 2) {
    return {
      valid: false,

      titleValid: false,

      textValid: false,

      message: "Poem title is too short.",
    };
  }

  if (!cleanText) {
    return {
      valid: false,

      titleValid: true,

      textValid: false,

      message: "Add Arabic poem text to continue.",
    };
  }

  if (!ARABIC_CHARACTER_REGEX.test(cleanText)) {
    return {
      valid: false,

      titleValid: true,

      textValid: false,

      message: "The poem must contain Arabic text.",
    };
  }

  const stats = getPoemStats(text);

  if (stats.verses < 2) {
    return {
      valid: false,

      titleValid: true,

      textValid: false,

      message: "Add at least two non-empty poem lines.",
    };
  }

  if (stats.words < 4) {
    return {
      valid: false,

      titleValid: true,

      textValid: false,

      message: "Add a little more poem text before continuing.",
    };
  }

  return {
    valid: true,

    titleValid: true,

    textValid: true,

    message: "Poem draft is ready for the reader.",
  };
}
