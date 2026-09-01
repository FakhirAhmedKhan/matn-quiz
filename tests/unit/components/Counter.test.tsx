import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Counter } from "@/components/ui/Counter";

describe("Counter", () => {
  it("renders current value", () => {
    render(
      <Counter
        value={3}
        min={1}
        max={5}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("increments value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Counter
        value={3}
        min={1}
        max={5}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText(/increase value/i));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("decrements value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Counter
        value={3}
        min={1}
        max={5}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText(/decrease value/i));

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("does not go below minimum", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Counter
        value={1}
        min={1}
        max={5}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText(/decrease value/i));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not go above maximum", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Counter
        value={5}
        min={1}
        max={5}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText(/increase value/i));

    expect(onChange).not.toHaveBeenCalled();
  });
});
















