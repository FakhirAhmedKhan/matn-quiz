import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("Home page architecture", () => {
  it("keeps app/page.tsx as a small landing connector", () => {
    const source = readFileSync("app/page.tsx", "utf8");

    expect(source).toContain("HomePageView");
    expect(source).not.toContain("usePage");
    expect(source).not.toContain("QuranTextInput");
    expect(source).not.toContain("QuizMethodSelector");
    expect(source).not.toContain("GeneratedQuizSection");
    expect(source).not.toContain("SavedHistorySection");
  });

  it("keeps root HomePageView as a clean workflow landing page", () => {
    const viewSource = readFileSync(
      "components/page/home/HomePageView.tsx",
      "utf8",
    );

    expect(viewSource).toContain("workflowCards");
    expect(viewSource).toContain("/create");
    expect(viewSource).toContain("/study");
    expect(viewSource).toContain("/books");
    expect(viewSource).toContain("/history");

    expect(viewSource).not.toContain("QuranTextSection");
    expect(viewSource).not.toContain("QuizOptionsSection");
    expect(viewSource).not.toContain("QuizSetupSummarySection");
    expect(viewSource).not.toContain("GeneratedQuizSection");
    expect(viewSource).not.toContain("ShareableQuizSection");
    expect(viewSource).not.toContain("SavedHistorySection");
  });

  it("keeps legacy full workflow available only through the test harness", () => {
    const harnessSource = readFileSync(
      "tests/helpers/HomeWorkflowTestPage.tsx",
      "utf8",
    );

    expect(harnessSource).toContain("usePage");
    expect(harnessSource).toContain("QuranTextSection");
    expect(harnessSource).toContain("QuizOptionsSection");
    expect(harnessSource).toContain("QuizSetupSummarySection");
    expect(harnessSource).toContain("GeneratedQuizSection");
    expect(harnessSource).toContain("ShareableQuizSection");
    expect(harnessSource).toContain("SavedHistorySection");
  });
});