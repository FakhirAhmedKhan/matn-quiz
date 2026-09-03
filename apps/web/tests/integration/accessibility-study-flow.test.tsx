import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HomeWorkflowTestPage as HomePage } from "@/tests/helpers/HomeWorkflowTestPage";

describe("Accessibility polished study flow", () => {
  const wordText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  it("generates quiz with accessible controls and live progress", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByLabelText(/increase value/i));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("study-progress-bar")).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByTestId("generated-quiz-text")).toHaveAttribute("tabindex", "0");
    expect(screen.getByTestId("generated-quiz-text")).toHaveAttribute(
      "aria-label",
      "Quiz Text Arabic reading area",
    );

    await user.click(screen.getByRole("button", { name: /reveal answer 1/i }));

    expect(screen.getByTestId("study-progress-bar")).toHaveAttribute("aria-valuenow", "50");
    expect(screen.getByTestId("study-progress-text")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });
});
























