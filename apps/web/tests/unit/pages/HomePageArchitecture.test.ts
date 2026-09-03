import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Home page architecture", () => {
  it("keeps app/page.tsx as a small connector", () => {
    const source = readFileSync("app/page.tsx", "utf8");

    expect(source).toContain("HomePageView");
    expect(source).toContain("usePage");
    expect(source).not.toContain("QuranTextInput");
    expect(source).not.toContain("QuizMethodSelector");
    expect(source).not.toContain("SavedQuizHistory");
  });

  it("moves home sections into page-level components", () => {
    const viewSource = readFileSync(
      "components/page/home/HomePageView.tsx",
      "utf8",
    );

    expect(viewSource).toContain("QuranTextSection");
    expect(viewSource).toContain("QuizOptionsSection");
    expect(viewSource).toContain("QuizSetupSummarySection");
    expect(viewSource).toContain("ResumeStudySection");
    expect(viewSource).toContain("ShareableQuizSection");
    expect(viewSource).toContain("SavedHistorySection");
  });

  it("keeps dynamic quiz component usage isolated in sections", () => {
    const textSection = readFileSync(
      "components/page/home/QuranTextSection.tsx",
      "utf8",
    );
    const optionsSection = readFileSync(
      "components/page/home/QuizOptionsSection.tsx",
      "utf8",
    );

    expect(textSection).toContain("@/components/quiz/dynamic-components");
    expect(optionsSection).toContain("@/components/quiz/dynamic-components");
  });
});
