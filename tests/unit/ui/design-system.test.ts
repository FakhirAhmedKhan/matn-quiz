import { describe, expect, it } from "vitest";
import {
  appButtonBaseClasses,
  appCardBaseClasses,
  appContainerClasses,
  appHeadingClasses,
  appShellClasses,
  arabicAnswerClasses,
  arabicReadingPanelClasses,
  getAppButtonClasses,
  getAppCardClasses,
  getAppSurfaceClasses,
  getMethodAccentClasses,
  getProgressBarWidth,
} from "@/lib/ui/design-system";

describe("design system polish utilities", () => {
  it("exports app shell layout classes", () => {
    expect(appShellClasses).toContain("min-h-screen");
    expect(appShellClasses).toContain("bg-[radial-gradient");
  });

  it("exports app container classes", () => {
    expect(appContainerClasses).toContain("max-w-5xl");
    expect(appContainerClasses).toContain("px-4");
  });

  it("exports card base classes", () => {
    expect(appCardBaseClasses).toContain("rounded-3xl");
    expect(appCardBaseClasses).toContain("shadow-sm");
  });

  it("creates small card classes", () => {
    expect(getAppCardClasses("sm")).toContain("p-4");
  });

  it("creates medium card classes by default", () => {
    expect(getAppCardClasses()).toContain("p-5");
  });

  it("creates large card classes", () => {
    expect(getAppCardClasses("lg")).toContain("p-6");
  });

  it("creates default surface classes", () => {
    expect(getAppSurfaceClasses()).toContain("border-slate-200");
    expect(getAppSurfaceClasses()).toContain("bg-white");
  });

  it("creates success surface classes", () => {
    expect(getAppSurfaceClasses("success")).toContain("border-emerald-200");
    expect(getAppSurfaceClasses("success")).toContain("bg-emerald-50");
  });

  it("creates warning surface classes", () => {
    expect(getAppSurfaceClasses("warning")).toContain("border-amber-200");
  });

  it("creates danger surface classes", () => {
    expect(getAppSurfaceClasses("danger")).toContain("border-red-200");
  });

  it("exports button base classes with focus states", () => {
    expect(appButtonBaseClasses).toContain("focus-visible:ring-2");
    expect(appButtonBaseClasses).toContain("disabled:cursor-not-allowed");
  });

  it("creates primary button classes", () => {
    expect(getAppButtonClasses("primary")).toContain("bg-emerald-700");
    expect(getAppButtonClasses("primary")).toContain("text-white");
  });

  it("creates secondary button classes", () => {
    expect(getAppButtonClasses("secondary")).toContain("border");
    expect(getAppButtonClasses("secondary")).toContain("bg-white");
  });

  it("creates large button classes", () => {
    expect(getAppButtonClasses("primary", "lg")).toContain("min-h-12");
  });

  it("exports heading classes", () => {
    expect(appHeadingClasses).toContain("text-3xl");
    expect(appHeadingClasses).toContain("font-bold");
  });

  it("exports Arabic reading panel classes", () => {
    expect(arabicReadingPanelClasses).toContain("arabic-text");
    expect(arabicReadingPanelClasses).toContain("text-right");
    expect(arabicReadingPanelClasses).toContain("leading-loose");
  });

  it("exports Arabic answer classes", () => {
    expect(arabicAnswerClasses).toContain("arabic-text");
    expect(arabicAnswerClasses).toContain("font-semibold");
  });

  it("clamps progress width to 0 percent for invalid number", () => {
    expect(getProgressBarWidth(Number.NaN)).toBe("0%");
    expect(getProgressBarWidth(Number.POSITIVE_INFINITY)).toBe("0%");
  });

  it("clamps progress width to 0 percent for negative number", () => {
    expect(getProgressBarWidth(-10)).toBe("0%");
  });

  it("clamps progress width to 100 percent", () => {
    expect(getProgressBarWidth(150)).toBe("100%");
  });

  it("rounds progress width", () => {
    expect(getProgressBarWidth(33.4)).toBe("33%");
    expect(getProgressBarWidth(33.6)).toBe("34%");
  });

  it("returns Hide Word accent classes", () => {
    expect(getMethodAccentClasses("HIDE_WORD")).toContain("emerald");
  });

  it("returns Hide Line accent classes", () => {
    expect(getMethodAccentClasses("HIDE_LINE")).toContain("indigo");
  });
});
