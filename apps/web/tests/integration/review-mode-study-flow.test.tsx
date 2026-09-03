import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HomeWorkflowTestPage as HomePage } from "@/tests/helpers/HomeWorkflowTestPage";

function getQuranTextarea() {
  return screen.getAllByRole("textbox")[0]!;
}

describe("Review mode study flow", () => {
  const arabicText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  it("generates a quiz and reviews answers as correct or incorrect", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(getQuranTextarea(), {
      target: { value: arabicText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "0 of 1 reviewed · 0% accuracy",
    );

    await user.click(
      screen.getByRole("button", { name: /mark answer 1 correct/i }),
    );

    expect(screen.getByTestId("review-progress-status")).toHaveTextContent(
      "Review complete",
    );
    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "1 of 1 reviewed · 100% accuracy",
    );
    expect(screen.getByTestId("review-completion-text")).toHaveTextContent(
      "Review complete · 1/1 correct",
    );

    await user.click(
      screen.getByRole("button", { name: /reset review progress/i }),
    );

    expect(screen.getByTestId("review-progress-status")).toHaveTextContent(
      "Review in progress",
    );
    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "0 of 1 reviewed · 0% accuracy",
    );
  });

  it("resets review state when quiz is reset", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(getQuranTextarea(), {
      target: { value: arabicText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(
      screen.getByRole("button", { name: /mark answer 1 correct/i }),
    );

    expect(screen.getByTestId("review-progress-status")).toHaveTextContent(
      "Review complete",
    );

    await user.click(screen.getByRole("button", { name: /reset quiz/i }));

    expect(screen.queryByTestId("generated-quiz-panel")).not.toBeInTheDocument();
  });
});




















