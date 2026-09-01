import { normalizeLineEndings } from "@/lib/utils/arabic";

export interface ArabicReadingStats {
  characters: number;
  lines: number;
  hasMultipleLines: boolean;
  isEmpty: boolean;
}

export type ArabicReadingDensity = "comfortable" | "spacious";

export function getArabicReadingStats(value: string): ArabicReadingStats {
  const normalized = normalizeLineEndings(value);
  const trimmed = normalized.trim();

  if (trimmed.length === 0) {
    return {
      characters: value.length,
      lines: 0,
      hasMultipleLines: false,
      isEmpty: true,
    };
  }

  const lines = normalized.split("\n").length;

  return {
    characters: value.length,
    lines,
    hasMultipleLines: lines > 1,
    isEmpty: false,
  };
}

export function getArabicReadingDirection(): "rtl" {
  return "rtl";
}

export function getArabicReadingLanguage(): "ar" {
  return "ar";
}

export function getArabicReadingMetaText(value: string): string {
  const stats = getArabicReadingStats(value);
  const lineLabel = stats.lines === 1 ? "line" : "lines";
  const characterLabel = stats.characters === 1 ? "character" : "characters";

  return `${stats.lines} ${lineLabel} · ${stats.characters} ${characterLabel}`;
}

export function getArabicReadingDensityClasses(
  density: ArabicReadingDensity = "comfortable",
): string {
  if (density === "spacious") {
    return "text-3xl leading-[2.6] sm:text-4xl";
  }

  return "text-2xl leading-loose sm:text-3xl";
}
