import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("Unified quiz generation flow", () => {
  const wordText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  const lineText =
    "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ";

  it("generates a Hide Words quiz through the full UI flow", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByLabelText(/increase value/i));

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("generation-success-message")).toHaveTextContent(
      "Text accepted with Hide Words and hide count 2.",
    );
    expect(screen.getAllByTestId("generated-answer-item")).toHaveLength(2);
  });

  it("generates a Hide Lines quiz through the full UI flow", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: lineText },
    });

    await user.click(screen.getAllByRole("radio")[1]);
    await user.click(screen.getByLabelText(/increase value/i));

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("generation-success-message")).toHaveTextContent(
      "Text accepted with Hide Lines and hide count 2.",
    );
    expect(screen.getAllByTestId("generated-answer-item")).toHaveLength(2);
  });

  it("does not show generated quiz before Continue is clicked", () => {
    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    expect(
      screen.queryByTestId("generated-quiz-panel"),
    ).not.toBeInTheDocument();
  });

  it("removes generated quiz after clearing text", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^clear$/i }));

    expect(
      screen.queryByTestId("generated-quiz-panel"),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeDisabled();
  });
});





















