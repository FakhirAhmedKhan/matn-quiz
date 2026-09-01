import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("Quiz method selection flow", () => {
  const arabicText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  it("keeps selected method visible when typing Arabic text", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.click(screen.getAllByRole("radio")[1]);

    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Lines",
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: arabicText },
    });

    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Lines",
    );

    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeEnabled();
  });

  it("allows Hide Words flow", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: arabicText },
    });

    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Words",
    );

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText(/text accepted with/i)).toBeInTheDocument();
  });

  it("allows Hide Lines flow", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.click(screen.getAllByRole("radio")[1]);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: arabicText },
    });

    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Lines",
    );

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText(/text accepted with/i)).toBeInTheDocument();
  });

  it("resets accepted message after method changes", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: arabicText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText(/text accepted with/i)).toBeInTheDocument();

    await user.click(screen.getAllByRole("radio")[1]);

    expect(
      screen.queryByText(/text accepted with/i),
    ).not.toBeInTheDocument();
  });
});
