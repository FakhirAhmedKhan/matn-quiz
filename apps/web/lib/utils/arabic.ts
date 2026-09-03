export const ARABIC_UNICODE_REGEX = /[\u0600-\u06FF]/;

export interface ArabicTextStats {
  characters: number;
  arabicWords: number;
  validLines: number;
  hasArabic: boolean;
}

export function containsArabicText(value: string): boolean {
  return ARABIC_UNICODE_REGEX.test(value);
}

export function isEmptyText(value: string): boolean {
  return value.trim().length === 0;
}

export function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function getValidLines(value: string): string[] {
  return normalizeLineEndings(value)
    .split("\n")
    .filter((line) => line.trim().length > 0);
}

export function countValidLines(value: string): number {
  return getValidLines(value).length;
}

export function getArabicWords(value: string): string[] {
  return value
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
    .filter((word) => containsArabicText(word));
}

export function countArabicWords(value: string): number {
  return getArabicWords(value).length;
}

export function getArabicTextStats(value: string): ArabicTextStats {
  return {
    characters: value.length,
    arabicWords: countArabicWords(value),
    validLines: countValidLines(value),
    hasArabic: containsArabicText(value),
  };
}

export function isValidArabicInput(value: string): boolean {
  return (
    !isEmptyText(value) &&
    containsArabicText(value) &&
    countArabicWords(value) > 0 &&
    countValidLines(value) > 0
  );
}
