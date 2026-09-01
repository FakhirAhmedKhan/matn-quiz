import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders button text", () => {
    render(<Button>Generate Quiz</Button>);

    expect(
      screen.getByRole("button", { name: /generate quiz/i }),
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByRole("button", { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled is true", () => {
    render(<Button disabled>Disabled Button</Button>);

    expect(
      screen.getByRole("button", { name: /disabled button/i }),
    ).toBeDisabled();
  });

  it("is disabled when loading is true", () => {
    render(<Button loading>Loading Button</Button>);

    expect(
      screen.getByRole("button", { name: /loading button/i }),
    ).toBeDisabled();
  });
});




















