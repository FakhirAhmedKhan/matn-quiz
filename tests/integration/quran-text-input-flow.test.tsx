import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

function getQuranTextarea() {
  return screen.getAllByRole("textbox")[0]!;
}

describe("Quran text input flow", () => {
  const arabicText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  it("allows user to paste valid Arabic text and continue", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    const textarea = getQuranTextarea();

    fireEvent.change(textarea, {
      target: { value: arabicText },
    });

    expect(textarea).toHaveValue(arabicText);
    expect(screen.getByTestId("character-count")).toHaveTextContent(
      String(arabicText.length),
    );
    expect(screen.getByRole("button", { name: /continue/i })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
  });

  it("shows validation error for non-Arabic text", () => {
    render(<HomePage />);

    fireEvent.change(getQuranTextarea(), {
      target: { value: "hello world" },
    });

    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    expect(
      screen.getByText(/text must contain arabic characters/i),
    ).toBeInTheDocument();
  });

  it("clear button resets the input and disables continue", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    const textarea = getQuranTextarea();

    fireEvent.change(textarea, {
      target: { value: arabicText },
    });

    expect(textarea).toHaveValue(arabicText);
    expect(screen.getByRole("button", { name: /continue/i })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: /^clear$/i }));

    expect(getQuranTextarea()).toHaveValue("");
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  it("does not show generated quiz after text is cleared", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(getQuranTextarea(), {
      target: { value: arabicText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^clear$/i }));

    expect(screen.queryByTestId("generated-quiz-panel")).not.toBeInTheDocument();
  });
});















