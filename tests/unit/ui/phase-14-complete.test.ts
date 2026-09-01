import { describe, expect, it } from "vitest";
import {
  getMobileButtonClasses,
  getMobileCardClasses,
  getMobileInputHintText,
  getMobileProgressWidth,
  getMobileStatusPillClasses,
  getMobileTextareaClasses,
  mobileSafeAreaClasses,
  mobileTouchTargetClasses,
  mobileViewportClasses,
  shouldUseCompactMobileLayout,
} from "@/lib/ui/mobile-ux";
import {
  getFeedbackStateAriaLive,
  getFeedbackStateDefaultTitle,
  getFeedbackStateDescription,
  getFeedbackStateRole,
  getFeedbackStateTone,
  getFeedbackStateToneClasses,
} from "@/lib/ui/feedback-state";
import {
  accessibleInteractiveClasses,
  auditTouchTargetSize,
  getAccessibleButtonLabel,
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

describe("Phase 14 complete verification", () => {
  it("verifies mobile UX foundation", () => {
    expect(mobileViewportClasses).toContain("min-h-dvh");
    expect(mobileSafeAreaClasses).toContain("safe-area-inset-bottom");
    expect(mobileTouchTargetClasses).toContain("min-h-11");

    expect(getMobileCardClasses("comfortable")).toContain("rounded-3xl");
    expect(getMobileButtonClasses("primary")).toContain("min-h-11");
    expect(getMobileButtonClasses("primary")).toContain("bg-emerald-700");
    expect(getMobileTextareaClasses("arabic")).toContain("arabic-text");
    expect(getMobileStatusPillClasses("success")).toContain("bg-emerald-50");

    expect(getMobileProgressWidth(Number.NaN)).toBe("0%");
    expect(getMobileProgressWidth(48.6)).toBe("49%");
    expect(getMobileProgressWidth(120)).toBe("100%");

    expect(getMobileInputHintText(9, 10)).toBe("1 character remaining");
    expect(getMobileInputHintText(10, 10)).toBe("Character limit reached");

    expect(shouldUseCompactMobileLayout(639)).toBe(true);
    expect(shouldUseCompactMobileLayout(640)).toBe(false);
  });

  it("verifies feedback state polish", () => {
    expect(getFeedbackStateTone("empty")).toBe("soft");
    expect(getFeedbackStateTone("loading")).toBe("info");
    expect(getFeedbackStateTone("success")).toBe("success");
    expect(getFeedbackStateTone("warning")).toBe("warning");
    expect(getFeedbackStateTone("error")).toBe("danger");

    expect(getFeedbackStateToneClasses("success")).toContain("bg-emerald-50");
    expect(getFeedbackStateRole("error")).toBe("alert");
    expect(getFeedbackStateRole("empty")).toBe("status");
    expect(getFeedbackStateAriaLive("error")).toBe("assertive");
    expect(getFeedbackStateAriaLive("success")).toBe("polite");

    expect(getFeedbackStateDefaultTitle("empty")).toBe("Nothing here yet");
    expect(getFeedbackStateDescription("error")).toBe(
      "Please try again or review the input.",
    );
    expect(getFeedbackStateDescription("success", "Saved.")).toBe("Saved.");
  });

  it("verifies accessibility final pass", () => {
    expect(MINIMUM_TOUCH_TARGET_SIZE_PX).toBe(44);
    expect(skipLinkClasses).toContain("focus:not-sr-only");
    expect(accessibleInteractiveClasses).toContain("min-h-11");

    expect(getSkipLinkHref()).toBe("#main-content");
    expect(getSkipLinkLabel()).toBe("Skip to main content");
    expect(getMainContentId()).toBe("main-content");

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

    expect(getAriaInvalid(true)).toBe(true);
    expect(getAriaInvalid(false)).toBeUndefined();
    expect(getAriaDescribedBy(["hint", undefined, "", false, "error"])).toBe(
      "hint error",
    );

    expect(getAccessibleButtonLabel("Reveal Answer", 1)).toBe(
      "Reveal Answer 1",
    );
    expect(getRequiredFieldLabel("Quran text", true)).toBe(
      "Quran text required",
    );
    expect(getProgressAriaValueText(49.6, "reviewed")).toBe(
      "50 percent reviewed",
    );

    expect(auditTouchTargetSize(44, 44).passes).toBe(true);
    expect(auditTouchTargetSize(43, 44).passes).toBe(false);
    expect(getTouchTargetSizeStyle()).toEqual({
      minWidth: 44,
      minHeight: 44,
    });
  });
});



