import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage quiz method integration", () => {
  it("renders the Matn Quiz title", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /matn quiz/i }),
    ).toBeInTheDocument();
  });

  it("renders Quran input and quiz method selector", () => {
    render(<HomePage />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();

    const radios = screen.getAllByRole("radio");

    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveTextContent("Hide Words");
    expect(radios[1]).toHaveTextContent("Hide Lines");
  });

  it("uses Hide Words as the default selected method", () => {
    render(<HomePage />);

    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Words",
    );
  });

  it("changes selected method to Hide Lines", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.click(screen.getAllByRole("radio")[1]);

    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Lines",
    );
  });

  it("keeps Continue disabled without Arabic text", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    const continueButton = screen.getByRole("button", { name: /continue/i });

    expect(continueButton).toBeDisabled();

    await user.click(screen.getAllByRole("radio")[1]);

    expect(continueButton).toBeDisabled();
  });

  it("enables Continue when Arabic text exists", async () => {
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

    await user.click(screen.getAllByRole("radio")[1]);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText(/text accepted with/i)).toBeInTheDocument();
    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Lines",
    );
  });
});
