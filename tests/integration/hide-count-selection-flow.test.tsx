import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("Hide count selection flow", () => {
  it("allows selecting hide count for Hide Words", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    expect(screen.getByTestId("available-hide-count")).toHaveTextContent("4");

    await user.click(screen.getByLabelText(/increase value/i));

    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("2");

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText(/text accepted with/i)).toBeInTheDocument();
  });

  it("allows selecting hide count for Hide Lines", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    const input =
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ";

    await user.type(screen.getByRole("textbox"), input);

    await user.click(screen.getAllByRole("radio")[1]);

    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Lines",
    );
    expect(screen.getByTestId("available-hide-count")).toHaveTextContent("2");
    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("1");

    await user.click(screen.getByLabelText(/increase value/i));

    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("2");

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText(/text accepted with/i)).toBeInTheDocument();
  });

  it("resets accepted message when hide count changes", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText(/text accepted with/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText(/increase value/i));

    expect(
      screen.queryByText(/text accepted with/i),
    ).not.toBeInTheDocument();
  });

  it("disables hide count controls when text is cleared", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.type(
      screen.getByRole("textbox"),
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    expect(screen.getByTestId("available-hide-count")).toHaveTextContent("4");

    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(screen.getByTestId("available-hide-count")).toHaveTextContent("0");
    expect(screen.getByTestId("hide-count-disabled-message")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeDisabled();
  });
});
