import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuizMethodSelector } from "@/components/quiz/QuizMethodSelector";

describe("QuizMethodSelector", () => {
  it("renders title and description", () => {
    render(
      <QuizMethodSelector
        value="HIDE_WORD"
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Quiz Method" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/choose how the quiz should hide content/i),
    ).toBeInTheDocument();
  });

  it("renders both method options", () => {
    render(
      <QuizMethodSelector
        value="HIDE_WORD"
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Hide Words")).toBeInTheDocument();
    expect(screen.getByText("Hide Lines")).toBeInTheDocument();
  });

  it("selects Hide Words when value is HIDE_WORD", () => {
    render(
      <QuizMethodSelector
        value="HIDE_WORD"
        onChange={() => {}}
      />,
    );

    const radios = screen.getAllByRole("radio");

    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
    expect(radios[1]).toHaveAttribute("aria-checked", "false");
  });

  it("selects Hide Lines when value is HIDE_LINE", () => {
    render(
      <QuizMethodSelector
        value="HIDE_LINE"
        onChange={() => {}}
      />,
    );

    const radios = screen.getAllByRole("radio");

    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveAttribute("aria-checked", "false");
    expect(radios[1]).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange with HIDE_LINE", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <QuizMethodSelector
        value="HIDE_WORD"
        onChange={onChange}
      />,
    );

    await user.click(screen.getAllByRole("radio")[1]);

    expect(onChange).toHaveBeenCalledWith("HIDE_LINE");
  });

  it("calls onChange with HIDE_WORD", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <QuizMethodSelector
        value="HIDE_LINE"
        onChange={onChange}
      />,
    );

    await user.click(screen.getAllByRole("radio")[0]);

    expect(onChange).toHaveBeenCalledWith("HIDE_WORD");
  });

  it("does not call onChange when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <QuizMethodSelector
        value="HIDE_WORD"
        onChange={onChange}
        disabled
      />,
    );

    await user.click(screen.getAllByRole("radio")[1]);

    expect(onChange).not.toHaveBeenCalled();
  });
});








