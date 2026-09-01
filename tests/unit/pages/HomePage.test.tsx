import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the Matn Quiz title", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /matn quiz/i }),
    ).toBeInTheDocument();
  });

  it("renders the Quran text input area", () => {
    render(<HomePage />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("starts with disabled Continue button", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeDisabled();
  });

  it("updates stats after Arabic text is typed", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    expect(screen.getByTestId("arabic-word-count")).toHaveTextContent("4");
    expect(screen.getByTestId("valid-line-count")).toHaveTextContent("1");
  });

  it("enables Continue button for valid Arabic text", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeEnabled();
  });

  it("shows accepted message after Continue click", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      screen.getByText(/text accepted/i),
    ).toBeInTheDocument();
  });
});
