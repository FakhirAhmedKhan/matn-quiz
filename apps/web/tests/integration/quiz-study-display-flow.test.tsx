import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HomeWorkflowTestPage as HomePage } from "@/tests/helpers/HomeWorkflowTestPage";

describe("Quiz study display flow", () => {
  const wordText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  it("generates quiz and reveals answers through study UI", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByLabelText(/increase value/i));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("answer-display-1")).toHaveTextContent("••••");

    await user.click(screen.getByRole("button", { name: /reveal answer 1/i }));

    expect(screen.getByTestId("answer-display-1")).not.toHaveTextContent("••••");
    expect(screen.getByTestId("study-progress-text")).toHaveTextContent(
      "1 of 2 answers revealed · 50%",
    );
  });
});





















