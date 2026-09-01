import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HideCountSelector } from "@/components/quiz/HideCountSelector";

describe("HideCountSelector", () => {
  const oneLineText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  const multiLineText =
    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ";

  it("renders word mode label and limits", () => {
    render(
      <HideCountSelector
        value={1}
        text={oneLineText}
        method="HIDE_WORD"
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /words to hide/i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("available-hide-count")).toHaveTextContent("4");
    expect(screen.getByTestId("hide-count-max")).toHaveTextContent("4");
  });

  it("renders line mode label and limits", () => {
    render(
      <HideCountSelector
        value={1}
        text={multiLineText}
        method="HIDE_LINE"
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /lines to hide/i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("available-hide-count")).toHaveTextContent("2");
    expect(screen.getByTestId("hide-count-max")).toHaveTextContent("2");
  });

  it("increments hide count", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <HideCountSelector
        value={1}
        text={oneLineText}
        method="HIDE_WORD"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText(/increase value/i));

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("decrements hide count", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <HideCountSelector
        value={2}
        text={oneLineText}
        method="HIDE_WORD"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText(/decrease value/i));

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("does not increment above maximum", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <HideCountSelector
        value={4}
        text={oneLineText}
        method="HIDE_WORD"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText(/increase value/i));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not decrement below minimum", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <HideCountSelector
        value={1}
        text={oneLineText}
        method="HIDE_WORD"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText(/decrease value/i));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables selector when no Arabic content is available", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <HideCountSelector
        value={1}
        text=""
        method="HIDE_WORD"
        onChange={onChange}
      />,
    );

    expect(screen.getByTestId("available-hide-count")).toHaveTextContent("0");
    expect(screen.getByTestId("hide-count-disabled-message")).toBeInTheDocument();

    await user.click(screen.getByLabelText(/increase value/i));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("uses disabled prop to block interaction", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <HideCountSelector
        value={1}
        text={oneLineText}
        method="HIDE_WORD"
        onChange={onChange}
        disabled
      />,
    );

    await user.click(screen.getByLabelText(/increase value/i));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("normalizes invalid value before rendering", () => {
    render(
      <HideCountSelector
        value={99}
        text={oneLineText}
        method="HIDE_WORD"
        onChange={() => {}}
      />,
    );

    expect(screen.getByTestId("available-hide-count")).toHaveTextContent("4");
    expect(screen.getByTestId("hide-count-max")).toHaveTextContent("4");
  });
});
















