import { describe, expect, it } from "vitest";
import {
  getMobileActionLayoutClasses,
  getMobileButtonClasses,
  getMobileCardClasses,
  getMobileEmptyStateClasses,
  getMobileInputHintText,
  getMobileProgressWidth,
  getMobileScrollMarginClasses,
  getMobileSectionPaddingClasses,
  getMobileSpacingClasses,
  getMobileStatusPillClasses,
  getMobileSurfaceClasses,
  getMobileTextareaClasses,
  mobileArabicTextClasses,
  mobileCardBaseClasses,
  mobileFocusVisibleClasses,
  mobileMotionSafeClasses,
  mobileNoHorizontalOverflowClasses,
  mobilePressableClasses,
  mobileReadableContainerClasses,
  mobileSafeAreaClasses,
  mobileStickyActionBarClasses,
  mobileTouchTargetClasses,
  mobileViewportClasses,
  shouldUseCompactMobileLayout,
} from "@/lib/ui/mobile-ux";

describe("mobile UX utilities", () => {
  it("defines stable mobile layout base classes", () => {
    expect(mobileSafeAreaClasses).toContain("safe-area-inset-bottom");
    expect(mobileViewportClasses).toContain("min-h-dvh");
    expect(mobileReadableContainerClasses).toContain("max-w-5xl");
    expect(mobileCardBaseClasses).toContain("rounded-3xl");
  });

  it("defines stable mobile interaction classes", () => {
    expect(mobileTouchTargetClasses).toContain("min-h-11");
    expect(mobileFocusVisibleClasses).toContain("focus-visible:ring-2");
    expect(mobileMotionSafeClasses).toContain("motion-reduce");
    expect(mobilePressableClasses).toContain("active:scale");
  });

  it("defines mobile Arabic and overflow classes", () => {
    expect(mobileArabicTextClasses).toContain("text-right");
    expect(mobileNoHorizontalOverflowClasses).toContain("overflow-x-hidden");
  });

  it("defines sticky mobile action bar classes", () => {
    expect(mobileStickyActionBarClasses).toContain("sticky");
    expect(mobileStickyActionBarClasses).toContain("bottom-0");
    expect(mobileStickyActionBarClasses).toContain("backdrop-blur");
  });

  it("returns mobile spacing classes", () => {
    expect(getMobileSpacingClasses("compact")).toBe("space-y-3 sm:space-y-4");
    expect(getMobileSpacingClasses("comfortable")).toBe(
      "space-y-5 sm:space-y-6",
    );
    expect(getMobileSpacingClasses("spacious")).toBe("space-y-6 sm:space-y-8");
    expect(getMobileSpacingClasses()).toBe("space-y-5 sm:space-y-6");
  });

  it("returns mobile section padding classes", () => {
    expect(getMobileSectionPaddingClasses("compact")).toBe("p-4 sm:p-5");
    expect(getMobileSectionPaddingClasses("comfortable")).toBe("p-5 sm:p-6");
    expect(getMobileSectionPaddingClasses("spacious")).toBe("p-6 sm:p-8");
  });

  it("returns mobile card classes", () => {
    expect(getMobileCardClasses("compact")).toContain("rounded-3xl");
    expect(getMobileCardClasses("compact")).toContain("p-4 sm:p-5");
  });

  it("returns mobile surface classes", () => {
    expect(getMobileSurfaceClasses("default")).toContain("bg-white");
    expect(getMobileSurfaceClasses("soft")).toContain("bg-slate-50");
    expect(getMobileSurfaceClasses("success")).toContain("bg-emerald-50");
    expect(getMobileSurfaceClasses("warning")).toContain("bg-amber-50");
    expect(getMobileSurfaceClasses("danger")).toContain("bg-red-50");
    expect(getMobileSurfaceClasses("info")).toContain("bg-blue-50");
  });

  it("returns mobile action layout classes", () => {
    expect(getMobileActionLayoutClasses("stacked")).toBe("grid gap-2");
    expect(getMobileActionLayoutClasses("inline")).toContain("flex");
    expect(getMobileActionLayoutClasses("responsive")).toContain("sm:flex");
  });

  it("returns mobile button classes", () => {
    expect(getMobileButtonClasses("primary")).toContain("bg-emerald-700");
    expect(getMobileButtonClasses("secondary")).toContain("border-slate-200");
    expect(getMobileButtonClasses("danger")).toContain("text-red-700");
    expect(getMobileButtonClasses()).toContain("min-h-11");
  });

  it("returns mobile textarea classes", () => {
    expect(getMobileTextareaClasses("arabic")).toContain("arabic-text");
    expect(getMobileTextareaClasses("arabic")).toContain("min-h-64");
    expect(getMobileTextareaClasses("json")).toContain("font-mono");
    expect(getMobileTextareaClasses("json")).toContain("min-h-40");
  });

  it("returns status pill and empty state classes", () => {
    expect(getMobileStatusPillClasses("success")).toContain("rounded-full");
    expect(getMobileStatusPillClasses("success")).toContain("bg-emerald-50");
    expect(getMobileEmptyStateClasses("info")).toContain("rounded-2xl");
    expect(getMobileEmptyStateClasses("info")).toContain("bg-blue-50");
  });

  it("returns safe mobile progress widths", () => {
    expect(getMobileProgressWidth(Number.NaN)).toBe("0%");
    expect(getMobileProgressWidth(-1)).toBe("0%");
    expect(getMobileProgressWidth(0)).toBe("0%");
    expect(getMobileProgressWidth(24.4)).toBe("24%");
    expect(getMobileProgressWidth(24.6)).toBe("25%");
    expect(getMobileProgressWidth(100)).toBe("100%");
    expect(getMobileProgressWidth(120)).toBe("100%");
  });

  it("returns mobile input hint text", () => {
    expect(getMobileInputHintText(0, 10)).toBe("10 characters remaining");
    expect(getMobileInputHintText(9, 10)).toBe("1 character remaining");
    expect(getMobileInputHintText(10, 10)).toBe("Character limit reached");
    expect(getMobileInputHintText(99, 10)).toBe("Character limit reached");
  });

  it("detects compact mobile layout", () => {
    expect(shouldUseCompactMobileLayout(320)).toBe(true);
    expect(shouldUseCompactMobileLayout(639)).toBe(true);
    expect(shouldUseCompactMobileLayout(640)).toBe(false);
    expect(shouldUseCompactMobileLayout(1024)).toBe(false);
    expect(shouldUseCompactMobileLayout(Number.NaN)).toBe(false);
  });

  it("returns mobile scroll margin classes", () => {
    expect(getMobileScrollMarginClasses()).toContain("scroll-mt-24");
  });
});












