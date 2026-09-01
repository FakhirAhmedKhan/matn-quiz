import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuranTextInput } from "@/components/quiz/QuranTextInput";

describe("QuranTextInput", () => {
  it("renders textarea", () => {
    render(
      <QuranTextInput
        value=""
        onChange={() => {}}
      />,
    );

    expect(screen.getAllByRole("textbox")[0]!).toBeInTheDocument();
  });

  it("renders RTL textarea", () => {
    render(
      <QuranTextInput
        value=""
        onChange={() => {}}
      />,
    );

    expect(screen.getAllByRole("textbox")[0]!).toHaveAttribute("dir", "rtl");
  });

  it("calls onChange when text changes", () => {
    const onChange = vi.fn();

    render(
      <QuranTextInput
        value=""
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: {
        value: "بِسْمِ اللَّهِ",
      },
    });

    expect(onChange).toHaveBeenCalledWith("بِسْمِ اللَّهِ");
  });

  it("shows character count", () => {
    render(
      <QuranTextInput
        value="بِسْمِ"
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Characters:")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("shows clear button when text exists", () => {
    render(
      <QuranTextInput
        value="بِسْمِ اللَّهِ"
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: /^clear$/i }),
    ).toBeInTheDocument();
  });

  it("does not show clear button when text is empty", () => {
    render(
      <QuranTextInput
        value=""
        onChange={() => {}}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /clear/i }),
    ).not.toBeInTheDocument();
  });

  it("clears text when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <QuranTextInput
        value="بِسْمِ اللَّهِ"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^clear$/i }));

    expect(onChange).toHaveBeenCalledWith("");
  });

  it("shows error message", () => {
    render(
      <QuranTextInput
        value="hello"
        onChange={() => {}}
        error="Text must contain Arabic characters."
      />,
    );

    expect(
      screen.getByText(/text must contain arabic characters/i),
    ).toBeInTheDocument();
  });
});








