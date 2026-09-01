import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage hide count integration", () => {
  it("renders Quran input, method selector, and hide count selector", () => {
    render(<HomePage />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();

    const radios = screen.getAllByRole("radio");

    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveTextContent("Hide Words");
    expect(radios[1]).toHaveTextContent("Hide Lines");

    expect(
      screen.getByRole("heading", { name: /words to hide/i }),
    ).toBeInTheDocument();
  });

  it("starts with Hide Words and hide count 1", () => {
    render(<HomePage />);

    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Words",
    );
    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("1");
  });

  it("keeps Continue disabled without Arabic text", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    const continueButton = screen.getByRole("button", { name: /continue/i });

    expect(continueButton).toBeDisabled();

    await user.click(screen.getByLabelText(/increase value/i));

    expect(continueButton).toBeDisabled();
  });

  it("enables Continue when Arabic text and valid hide count exist", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeEnabled();

    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("1");
  });

  it("increments hide count in word mode", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    await user.click(screen.getByLabelText(/increase value/i));

    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("2");
  });

  it("clamps hide count when switching from word mode to line mode", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    await user.click(screen.getByLabelText(/increase value/i));
    await user.click(screen.getByLabelText(/increase value/i));

    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("3");

    await user.click(screen.getAllByRole("radio")[1]);

    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Lines",
    );
    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("1");
  });

  it("shows accepted message with selected method and hide count", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    await user.click(screen.getByLabelText(/increase value/i));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText(/text accepted with/i)).toBeInTheDocument();
    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Words",
    );
    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("2");
  });
});
