import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage mobile layout polish", () => {
  it("renders Phase 14.2 mobile-first layout", () => {
    render(<HomePage />);

    expect(screen.getByTestId("app-shell")).toHaveClass("min-h-dvh");
    expect(screen.getByTestId("app-safe-area")).toHaveClass("px-4");
    expect(screen.getByTestId("app-container")).toHaveClass("max-w-5xl");
    expect(screen.getByTestId("app-hero-eyebrow")).toHaveTextContent(
      "Phase 17.5",
    );
    expect(screen.getByTestId("responsive-card-grid")).toHaveClass("space-y-6");
    expect(screen.getByTestId("responsive-two-column-section")).toHaveClass(
      "grid",
    );
  });

  it("keeps core page sections available", () => {
    render(<HomePage />);

    expect(screen.getByText("Paste Quran or Matn Text")).toBeInTheDocument();
    expect(screen.getByText("Quiz Method")).toBeInTheDocument();
    expect(screen.getByText("Hide Count")).toBeInTheDocument();
    expect(screen.getByText("Quiz Setup Summary")).toBeInTheDocument();
    expect(screen.getByTestId("study-session-resume-panel")).toBeInTheDocument();
    expect(screen.getByTestId("shareable-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("saved-quiz-history")).toBeInTheDocument();
  });
});










