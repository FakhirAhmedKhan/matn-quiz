import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeWorkflowTestPage as HomePage } from "@/tests/helpers/HomeWorkflowTestPage";

describe("Home page section rendering", () => {
  it("renders the refactored single-page layout", async () => {
    render(<HomePage />);

    expect(screen.getByTestId("app-shell")).toBeInTheDocument();
    expect(screen.getByTestId("app-container")).toBeInTheDocument();
    expect(screen.getByTestId("quiz-setup-summary")).toBeInTheDocument();
    expect(screen.getByTestId("resume-study-section")).toBeInTheDocument();
    expect(screen.getByTestId("shareable-quiz-section")).toBeInTheDocument();
    expect(screen.getByTestId("saved-history-section")).toBeInTheDocument();

    const textboxes = await screen.findAllByRole("textbox");

    expect(textboxes.length).toBeGreaterThanOrEqual(2);
    expect(textboxes[0]).toHaveAttribute("name", "quranText");
    expect(screen.getByTestId("shareable-import-textarea")).toBeInTheDocument();

    expect(
      await screen.findByRole("radiogroup", { name: /quiz method/i }),
    ).toBeInTheDocument();
  });
});

