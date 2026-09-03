import { describe, expect, it } from "vitest";
import {
  accessibleDisabledClasses,
  accessibleFocusRingClasses,
  accessibleInteractiveClasses,
  accessibleMotionClasses,
  accessiblePressedClasses,
  accessibleTouchTargetClasses,
  auditTouchTargetSize,
  getAccessibleButtonLabel,
  getAccessibleRegionLabel,
  getAccessibleStatusProps,
  getAriaDescribedBy,
  getAriaInvalid,
  getMainContentId,
  getProgressAriaValueText,
  getRequiredFieldLabel,
  getSkipLinkHref,
  getSkipLinkLabel,
  getTouchTargetSizeStyle,
  MINIMUM_TOUCH_TARGET_SIZE_PX,
  skipLinkClasses,
} from "@/lib/ui/accessibility-final-pass";

describe("accessibility final pass utilities", () => {
  it("defines stable accessibility classes", () => {
    expect(MINIMUM_TOUCH_TARGET_SIZE_PX).toBe(44);
    expect(skipLinkClasses).toContain("sr-only");
    expect(skipLinkClasses).toContain("focus:not-sr-only");
    expect(accessibleTouchTargetClasses).toContain("min-h-11");
    expect(accessibleFocusRingClasses).toContain("focus-visible:ring-2");
    expect(accessibleMotionClasses).toContain("motion-reduce");
    expect(accessiblePressedClasses).toContain("aria-pressed");
    expect(accessibleDisabledClasses).toContain("disabled:opacity-50");
    expect(accessibleInteractiveClasses).toContain("min-h-11");
  });

  it("returns skip link values", () => {
    expect(getSkipLinkHref()).toBe("#main-content");
    expect(getSkipLinkHref("quiz")).toBe("#quiz");
    expect(getSkipLinkLabel()).toBe("Skip to main content");
    expect(getSkipLinkLabel("Skip quiz setup")).toBe("Skip quiz setup");
    expect(getMainContentId()).toBe("main-content");
    expect(getMainContentId("custom-main")).toBe("custom-main");
  });

  it("returns accessible status props", () => {
    expect(getAccessibleStatusProps()).toEqual({
      role: "status",
      "aria-live": "polite",
      "aria-atomic": true,
    });

    expect(getAccessibleStatusProps("alert")).toEqual({
      role: "alert",
      "aria-live": "assertive",
      "aria-atomic": true,
    });

    expect(getAccessibleStatusProps("log")).toEqual({
      role: "log",
      "aria-live": "polite",
      "aria-atomic": false,
    });

    expect(getAccessibleStatusProps("progressbar")).toEqual({
      role: "progressbar",
    });
  });

  it("returns aria helpers", () => {
    expect(getAriaInvalid(true)).toBe(true);
    expect(getAriaInvalid(false)).toBeUndefined();

    expect(getAriaDescribedBy(["hint", undefined, "", false, "error"])).toBe(
      "hint error",
    );
    expect(getAriaDescribedBy([undefined, "", false])).toBeUndefined();
  });

  it("returns accessible labels", () => {
    expect(getAccessibleButtonLabel("Reveal Answer", 1)).toBe(
      "Reveal Answer 1",
    );
    expect(getAccessibleButtonLabel("Reset")).toBe("Reset");
    expect(getAccessibleRegionLabel("Saved History")).toBe("Saved History");
    expect(getAccessibleRegionLabel("")).toBe("Content section");
  });

  it("audits touch target size", () => {
    expect(auditTouchTargetSize(44, 44)).toEqual({
      width: 44,
      height: 44,
      minimum: 44,
      passes: true,
    });

    expect(auditTouchTargetSize(43, 44).passes).toBe(false);
    expect(auditTouchTargetSize(44, 43).passes).toBe(false);
    expect(auditTouchTargetSize(Number.NaN, 44).passes).toBe(false);
  });

  it("returns touch target style", () => {
    expect(getTouchTargetSizeStyle()).toEqual({
      minWidth: 44,
      minHeight: 44,
    });

    expect(getTouchTargetSizeStyle(48)).toEqual({
      minWidth: 48,
      minHeight: 48,
    });
  });

  it("returns progress aria text", () => {
    expect(getProgressAriaValueText(0)).toBe("0 percent complete");
    expect(getProgressAriaValueText(49.6, "reviewed")).toBe(
      "50 percent reviewed",
    );
    expect(getProgressAriaValueText(200)).toBe("100 percent complete");
    expect(getProgressAriaValueText(Number.NaN)).toBe("0 percent complete");
  });

  it("returns required field labels", () => {
    expect(getRequiredFieldLabel("Quran text", true)).toBe(
      "Quran text required",
    );
    expect(getRequiredFieldLabel("Quran text", false)).toBe("Quran text");
  });
});







