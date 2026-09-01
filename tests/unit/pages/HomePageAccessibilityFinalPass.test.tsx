import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage accessibility final pass", () => {
  it("renders skip link and focusable main content", () => {
    render(<HomePage />);

    expect(screen.getByTestId("skip-to-content-link")).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(screen.getByTestId("app-container")).toHaveAttribute(
      "id",
      "main-content",
    );
    expect(screen.getByTestId("app-container")).toHaveAttribute("tabindex", "-1");
  });

  it("renders landmark-friendly hero and primary regions", () => {
    render(<HomePage />);

    expect(screen.getByTestId("app-hero")).toHaveAttribute(
      "aria-labelledby",
      "app-hero-title",
    );
    expect(screen.getByTestId("app-hero-title")).toHaveTextContent("Matn Quiz");
    expect(screen.getByTestId("study-session-resume-panel")).toHaveAttribute(
      "aria-label",
      "Resume saved study session",
    );
    expect(screen.getByTestId("shareable-quiz-panel")).toHaveAttribute(
      "aria-label",
      "Import and export quiz JSON",
    );
    expect(screen.getByTestId("saved-quiz-history")).toHaveAttribute(
      "aria-label",
      "Saved quiz history",
    );
  });

  it("keeps mobile touch target classes on important controls", () => {
    render(<HomePage />);

    expect(screen.getByRole("button", { name: /continue/i })).toHaveClass(
      "min-h-11",
    );
    expect(screen.getByRole("button", { name: /clear history/i })).toHaveClass(
      "min-h-11",
    );
  });

  it("uses accessible empty states", () => {
    render(<HomePage />);

    expect(screen.getByTestId("study-session-resume-empty")).toHaveTextContent(
      "No saved study session",
    );
    expect(screen.getByTestId("saved-quiz-empty")).toHaveTextContent(
      "No saved quizzes yet.",
    );
  });
});


