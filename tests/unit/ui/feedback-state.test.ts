import { describe, expect, it } from "vitest";
import {
  getFeedbackStateAriaLive,
  getFeedbackStateDefaultTitle,
  getFeedbackStateDescription,
  getFeedbackStateIconClasses,
  getFeedbackStateIconLabel,
  getFeedbackStateRole,
  getFeedbackStateTone,
  getFeedbackStateToneClasses,
} from "@/lib/ui/feedback-state";

describe("feedback state utilities", () => {
  it("returns feedback tones by kind", () => {
    expect(getFeedbackStateTone("empty")).toBe("soft");
    expect(getFeedbackStateTone("loading")).toBe("info");
    expect(getFeedbackStateTone("success")).toBe("success");
    expect(getFeedbackStateTone("warning")).toBe("warning");
    expect(getFeedbackStateTone("error")).toBe("danger");
    expect(getFeedbackStateTone("info")).toBe("info");
  });

  it("returns tone and icon classes", () => {
    expect(getFeedbackStateToneClasses("soft")).toContain("bg-slate-50");
    expect(getFeedbackStateToneClasses("success")).toContain("bg-emerald-50");
    expect(getFeedbackStateToneClasses("warning")).toContain("bg-amber-50");
    expect(getFeedbackStateToneClasses("danger")).toContain("bg-red-50");
    expect(getFeedbackStateToneClasses("info")).toContain("bg-blue-50");

    expect(getFeedbackStateIconClasses("success")).toContain("text-emerald-700");
  });

  it("returns accessible role and aria-live", () => {
    expect(getFeedbackStateRole("error")).toBe("alert");
    expect(getFeedbackStateRole("warning")).toBe("alert");
    expect(getFeedbackStateRole("empty")).toBe("status");
    expect(getFeedbackStateAriaLive("error")).toBe("assertive");
    expect(getFeedbackStateAriaLive("success")).toBe("polite");
  });

  it("returns default titles", () => {
    expect(getFeedbackStateDefaultTitle("empty")).toBe("Nothing here yet");
    expect(getFeedbackStateDefaultTitle("loading")).toBe("Loading");
    expect(getFeedbackStateDefaultTitle("success")).toBe("Success");
    expect(getFeedbackStateDefaultTitle("warning")).toBe("Needs attention");
    expect(getFeedbackStateDefaultTitle("error")).toBe("Something went wrong");
    expect(getFeedbackStateDefaultTitle("info")).toBe("Information");
  });

  it("returns icon labels", () => {
    expect(getFeedbackStateIconLabel("empty")).toBe("Empty state");
    expect(getFeedbackStateIconLabel("loading")).toBe("Loading state");
    expect(getFeedbackStateIconLabel("error")).toBe("Error state");
  });

  it("returns fallback and custom descriptions", () => {
    expect(getFeedbackStateDescription("empty")).toBe(
      "There is no content to show right now.",
    );
    expect(getFeedbackStateDescription("loading")).toBe(
      "Please wait while this content is prepared.",
    );
    expect(getFeedbackStateDescription("error")).toBe(
      "Please try again or review the input.",
    );
    expect(getFeedbackStateDescription("success", "Saved.")).toBe("Saved.");
  });
});



