import { describe, expect, it } from "vitest";
import {
  accessibleCardFocusClasses,
  focusRingClasses,
  getAccessiblePercentageLabel,
  getActionStatusAnnouncement,
  getAnswerToggleAriaLabel,
  getReadingPanelAriaLabel,
  getStudyProgressAnnouncement,
  interactiveTransitionClasses,
  pressableClasses,
} from "@/lib/ui/accessibility";

describe("accessibility and interaction helpers", () => {
  it("exports focus ring classes", () => {
    expect(focusRingClasses).toContain("focus-visible:ring-2");
    expect(focusRingClasses).toContain("focus-visible:ring-emerald-500");
  });

  it("exports transition classes", () => {
    expect(interactiveTransitionClasses).toContain("transition");
    expect(interactiveTransitionClasses).toContain("motion-reduce:transition-none");
  });

  it("exports pressable classes", () => {
    expect(pressableClasses).toContain("active:scale");
  });

  it("exports accessible card focus classes", () => {
    expect(accessibleCardFocusClasses).toContain("focus-within:ring-2");
  });

  it("creates reveal answer aria label", () => {
    expect(getAnswerToggleAriaLabel(1, false)).toBe("Reveal answer 1");
  });

  it("creates hide answer aria label", () => {
    expect(getAnswerToggleAriaLabel(2, true)).toBe("Hide answer 2");
  });

  it("announces empty progress", () => {
    expect(
      getStudyProgressAnnouncement({
        total: 0,
        revealed: 0,
        hidden: 0,
        complete: false,
        percentage: 0,
      }),
    ).toBe("No answers available.");
  });

  it("announces partial progress", () => {
    expect(
      getStudyProgressAnnouncement({
        total: 3,
        revealed: 1,
        hidden: 2,
        complete: false,
        percentage: 33,
      }),
    ).toBe("1 of 3 answers revealed.");
  });

  it("announces complete progress", () => {
    expect(
      getStudyProgressAnnouncement({
        total: 3,
        revealed: 3,
        hidden: 0,
        complete: true,
        percentage: 100,
      }),
    ).toBe("All 3 answers are revealed.");
  });

  it("creates action status announcement", () => {
    expect(getActionStatusAnnouncement("Quiz copied.")).toBe("Quiz copied.");
    expect(getActionStatusAnnouncement("")).toBe("No action status.");
  });

  it("creates accessible percentage label", () => {
    expect(getAccessiblePercentageLabel(Number.NaN)).toBe("0 percent");
    expect(getAccessiblePercentageLabel(-10)).toBe("0 percent");
    expect(getAccessiblePercentageLabel(33.6)).toBe("34 percent");
    expect(getAccessiblePercentageLabel(120)).toBe("100 percent");
  });

  it("creates reading panel aria label", () => {
    expect(getReadingPanelAriaLabel("Quiz Text")).toBe(
      "Quiz Text Arabic reading area",
    );
  });
});
















