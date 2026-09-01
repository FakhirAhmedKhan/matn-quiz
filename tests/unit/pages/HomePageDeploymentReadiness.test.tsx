import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage deployment readiness", () => {
  it("renders final Phase 16 deployment label", () => {
    render(<HomePage />);

    expect(screen.getByTestId("app-hero-eyebrow")).toHaveTextContent(
      "Phase 17.5",
    );
    expect(screen.getByTestId("app-hero-title")).toHaveTextContent("Matn Quiz");
  });

  it("keeps release-ready core sections available", () => {
    render(<HomePage />);

    expect(screen.getByText("Paste Quran or Matn Text")).toBeInTheDocument();
    expect(screen.getByText("Quiz Method")).toBeInTheDocument();
    expect(screen.getByText("Hide Count")).toBeInTheDocument();
    expect(screen.getByTestId("study-session-resume-panel")).toBeInTheDocument();
    expect(screen.getByTestId("shareable-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("saved-quiz-history")).toBeInTheDocument();
    expect(screen.getByTestId("skip-to-content-link")).toHaveAttribute(
      "href",
      "#main-content",
    );
  });
});


