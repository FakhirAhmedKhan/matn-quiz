import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("Quran text input flow", () => {
  it("allows user to paste valid Arabic text and continue", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    const textarea = screen.getByRole("textbox");
    const continueButton = screen.getByRole("button", { name: /continue/i });

    expect(continueButton).toBeDisabled();

    await user.type(
      textarea,
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    expect(screen.getByTestId("arabic-word-count")).toHaveTextContent("4");
    expect(screen.getByTestId("valid-line-count")).toHaveTextContent("1");
    expect(continueButton).toBeEnabled();

    await user.click(continueButton);

    expect(screen.getByText(/text accepted/i)).toBeInTheDocument();
  });

  it("shows validation error for non-Arabic text", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(screen.getByRole("textbox"), "hello world");

    expect(
      screen.getByText(/text must contain arabic characters/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeDisabled();
  });

  it("preserves line breaks in the input value", () => {
    render(<HomePage />);

    const textarea = screen.getByRole("textbox");
    const input =
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ";

    userEvent.setup();

    textarea.focus();
    textarea.textContent = input;

    expect(textarea).toBeInTheDocument();
  });

  it("clear button resets the input and disables continue", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeEnabled();

    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeDisabled();
  });
});
