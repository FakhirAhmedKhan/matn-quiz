import { describe, expect, it } from "vitest";
import {
  appShellClasses,
  arabicAnswerClasses,
  arabicReadingPanelClasses,
  getAppButtonClasses,
  getAppCardClasses,
  getMethodAccentClasses,
  getProgressBarWidth,
} from "@/lib/ui/design-system";
import {
  focusRingClasses,
  getAccessiblePercentageLabel,
  getAnswerToggleAriaLabel,
  getReadingPanelAriaLabel,
  getStudyProgressAnnouncement,
} from "@/lib/ui/accessibility";
import {
  getArabicReadingDirection,
  getArabicReadingLanguage,
  getArabicReadingMetaText,
} from "@/lib/quiz/arabic-reading";

describe("Phase 9 complete verification", () => {
  it("has polished app shell design tokens", () => {
    expect(appShellClasses).toContain("min-h-screen");
    expect(appShellClasses).toContain("radial-gradient");
    expect(getAppCardClasses("md")).toContain("rounded-3xl");
  });

  it("has polished button and focus utilities", () => {
    expect(getAppButtonClasses("primary")).toContain("bg-emerald-700");
    expect(getAppButtonClasses("secondary")).toContain("border");
    expect(focusRingClasses).toContain("focus-visible:ring-2");
  });

  it("has Arabic reading design tokens", () => {
    expect(arabicReadingPanelClasses).toContain("arabic-text");
    expect(arabicAnswerClasses).toContain("text-right");
  });

  it("has Arabic reading metadata helpers", () => {
    expect(getArabicReadingDirection()).toBe("rtl");
    expect(getArabicReadingLanguage()).toBe("ar");
    expect(getArabicReadingMetaText("بِسْمِ اللَّهِ")).toBe(
      "1 line · 14 characters",
    );
  });

  it("has progress and method polish helpers", () => {
    expect(getProgressBarWidth(33.6)).toBe("34%");
    expect(getProgressBarWidth(150)).toBe("100%");
    expect(getMethodAccentClasses("HIDE_WORD")).toContain("emerald");
    expect(getMethodAccentClasses("HIDE_LINE")).toContain("indigo");
  });

  it("has accessibility label helpers", () => {
    expect(getAnswerToggleAriaLabel(1, false)).toBe("Reveal answer 1");
    expect(getAnswerToggleAriaLabel(1, true)).toBe("Hide answer 1");
    expect(getReadingPanelAriaLabel("Quiz Text")).toBe(
      "Quiz Text Arabic reading area",
    );
  });

  it("has accessible progress announcements", () => {
    expect(
      getStudyProgressAnnouncement({
        total: 2,
        revealed: 1,
        hidden: 1,
        complete: false,
        percentage: 50,
      }),
    ).toBe("1 of 2 answers revealed.");

    expect(getAccessiblePercentageLabel(50)).toBe("50 percent");
  });
});





















