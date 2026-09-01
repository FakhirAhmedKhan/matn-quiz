import { describe, expect, it } from "vitest";
import {
  containsArabicText,
  countArabicWords,
  countValidLines,
  getArabicTextStats,
  getArabicWords,
  getValidLines,
  isEmptyText,
  isValidArabicInput,
  normalizeLineEndings,
} from "@/lib/utils/arabic";

describe("Arabic text utilities", () => {
  const sample =
    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ";

  it("detects Arabic text", () => {
    expect(containsArabicText("بِسْمِ اللَّهِ")).toBe(true);
    expect(containsArabicText("hello world")).toBe(false);
  });

  it("detects empty text", () => {
    expect(isEmptyText("")).toBe(true);
    expect(isEmptyText("   ")).toBe(true);
    expect(isEmptyText("بِسْمِ")).toBe(false);
  });

  it("normalizes Windows and old Mac line endings", () => {
    expect(normalizeLineEndings("line1\r\nline2\rline3")).toBe("line1\nline2\nline3");
  });

  it("counts valid non-empty lines", () => {
    expect(countValidLines("line 1\n\nline 3")).toBe(2);
    expect(getValidLines("line 1\n\nline 3")).toEqual(["line 1", "line 3"]);
  });

  it("counts Arabic words without removing diacritics", () => {
    const words = getArabicWords("بِسْمِ اللَّهِ الرَّحْمَٰنِ");

    expect(words).toEqual(["بِسْمِ", "اللَّهِ", "الرَّحْمَٰنِ"]);
    expect(countArabicWords("بِسْمِ اللَّهِ الرَّحْمَٰنِ")).toBe(3);
  });

  it("ignores non-Arabic words while counting Arabic words", () => {
    expect(countArabicWords("hello بِسْمِ world اللَّهِ")).toBe(2);
  });

  it("returns text stats", () => {
    const stats = getArabicTextStats(sample);

    expect(stats.characters).toBe(sample.length);
    expect(stats.arabicWords).toBe(8);
    expect(stats.validLines).toBe(2);
    expect(stats.hasArabic).toBe(true);
  });

  it("validates Arabic input", () => {
    expect(isValidArabicInput(sample)).toBe(true);
    expect(isValidArabicInput("hello world")).toBe(false);
    expect(isValidArabicInput("")).toBe(false);
  });

  it("does not mutate original text", () => {
    const original = "بِسْمِ اللَّهِ\r\nالْحَمْدُ لِلَّهِ";
    const copy = original;

    normalizeLineEndings(original);
    countArabicWords(original);
    countValidLines(original);

    expect(original).toBe(copy);
  });
});

















