import { describe, expect, it } from "vitest";
import {
  HIDE_COUNT_DEFAULT,
  HIDE_COUNT_MIN,
} from "@/lib/constants/quiz";
import {
  clampHideCount,
  getAvailableHideCount,
  getHideCountHelperText,
  getHideCountLabel,
  getHideCountLimits,
  isValidHideCount,
  normalizeHideCount,
} from "@/lib/quiz/hide-count";

describe("hide count utilities", () => {
  const oneLineText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  const multiLineText =
    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ";

  it("defines minimum and default hide count", () => {
    expect(HIDE_COUNT_MIN).toBe(1);
    expect(HIDE_COUNT_DEFAULT).toBe(1);
  });

  it("gets available hide count for Hide Words", () => {
    expect(getAvailableHideCount(oneLineText, "HIDE_WORD")).toBe(4);
  });

  it("gets available hide count for Hide Lines", () => {
    expect(getAvailableHideCount(multiLineText, "HIDE_LINE")).toBe(2);
  });

  it("returns zero available count for empty text", () => {
    expect(getAvailableHideCount("", "HIDE_WORD")).toBe(0);
    expect(getAvailableHideCount("", "HIDE_LINE")).toBe(0);
  });

  it("returns correct labels", () => {
    expect(getHideCountLabel("HIDE_WORD")).toBe("Words to Hide");
    expect(getHideCountLabel("HIDE_LINE")).toBe("Lines to Hide");
  });

  it("returns helper text for available words", () => {
    expect(getHideCountHelperText("HIDE_WORD", 4)).toBe(
      "You can hide up to 4 Arabic words.",
    );
  });

  it("returns helper text for available lines", () => {
    expect(getHideCountHelperText("HIDE_LINE", 2)).toBe(
      "You can hide up to 2 lines.",
    );
  });

  it("clamps values correctly", () => {
    expect(clampHideCount(0, 4)).toBe(1);
    expect(clampHideCount(10, 4)).toBe(4);
    expect(clampHideCount(3, 4)).toBe(3);
    expect(clampHideCount(2.8, 4)).toBe(2);
    expect(clampHideCount(Number.NaN, 4)).toBe(1);
    expect(clampHideCount(Number.POSITIVE_INFINITY, 4)).toBe(1);
  });

  it("validates hide count for words", () => {
    expect(isValidHideCount(1, oneLineText, "HIDE_WORD")).toBe(true);
    expect(isValidHideCount(4, oneLineText, "HIDE_WORD")).toBe(true);
    expect(isValidHideCount(5, oneLineText, "HIDE_WORD")).toBe(false);
    expect(isValidHideCount(0, oneLineText, "HIDE_WORD")).toBe(false);
  });

  it("validates hide count for lines", () => {
    expect(isValidHideCount(1, multiLineText, "HIDE_LINE")).toBe(true);
    expect(isValidHideCount(2, multiLineText, "HIDE_LINE")).toBe(true);
    expect(isValidHideCount(3, multiLineText, "HIDE_LINE")).toBe(false);
  });

  it("normalizes hide count for selected method", () => {
    expect(normalizeHideCount(10, oneLineText, "HIDE_WORD")).toBe(4);
    expect(normalizeHideCount(10, multiLineText, "HIDE_LINE")).toBe(2);
  });

  it("returns complete limits for Hide Words", () => {
    const limits = getHideCountLimits(oneLineText, "HIDE_WORD");

    expect(limits).toEqual({
      min: 1,
      max: 4,
      available: 4,
      defaultValue: 1,
      disabled: false,
      label: "Words to Hide",
      helperText: "You can hide up to 4 Arabic words.",
    });
  });

  it("returns complete limits for Hide Lines", () => {
    const limits = getHideCountLimits(multiLineText, "HIDE_LINE");

    expect(limits).toEqual({
      min: 1,
      max: 2,
      available: 2,
      defaultValue: 1,
      disabled: false,
      label: "Lines to Hide",
      helperText: "You can hide up to 2 lines.",
    });
  });

  it("disables limits when no content is available", () => {
    const limits = getHideCountLimits("", "HIDE_WORD");

    expect(limits.disabled).toBe(true);
    expect(limits.available).toBe(0);
    expect(limits.max).toBe(0);
    expect(limits.defaultValue).toBe(1);
  });
});

















