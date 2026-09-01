import { describe, expect, it } from "vitest";
import {
  getArabicReadingDensityClasses,
  getArabicReadingDirection,
  getArabicReadingLanguage,
  getArabicReadingMetaText,
  getArabicReadingStats,
} from "@/lib/quiz/arabic-reading";

describe("Arabic reading UX helpers", () => {
  it("returns rtl direction", () => {
    expect(getArabicReadingDirection()).toBe("rtl");
  });

  it("returns Arabic language code", () => {
    expect(getArabicReadingLanguage()).toBe("ar");
  });

  it("counts single-line Arabic text", () => {
    expect(getArabicReadingStats("بِسْمِ اللَّهِ")).toEqual({
      characters: 14,
      lines: 1,
      hasMultipleLines: false,
      isEmpty: false,
    });
  });

  it("counts multiline Arabic text", () => {
    expect(getArabicReadingStats("بِسْمِ اللَّهِ\nالرَّحْمَٰنِ")).toEqual({
      characters: 27,
      lines: 2,
      hasMultipleLines: true,
      isEmpty: false,
    });
  });

  it("handles empty text", () => {
    expect(getArabicReadingStats("")).toEqual({
      characters: 0,
      lines: 0,
      hasMultipleLines: false,
      isEmpty: true,
    });
  });

  it("formats Arabic reading metadata", () => {
    expect(getArabicReadingMetaText("بِسْمِ اللَّهِ")).toBe(
      "1 line · 14 characters",
    );
  });

  it("returns comfortable density classes", () => {
    expect(getArabicReadingDensityClasses("comfortable")).toContain("text-2xl");
  });

  it("returns spacious density classes", () => {
    expect(getArabicReadingDensityClasses("spacious")).toContain("text-3xl");
    expect(getArabicReadingDensityClasses("spacious")).toContain("leading-[2.6]");
  });
});





















