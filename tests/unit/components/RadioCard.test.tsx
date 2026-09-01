import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioCard } from "@/components/ui/RadioCard";

describe("RadioCard", () => {
  it("renders title and description", () => {
    render(
      <RadioCard
        title="Hide Words"
        description="Hide selected words"
        value="HIDE_WORD"
        selected={false}
        onSelect={() => {}}
      />,
    );

    expect(screen.getByText(/hide words/i)).toBeInTheDocument();
    expect(screen.getByText(/hide selected words/i)).toBeInTheDocument();
  });

  it("shows selected state", () => {
    render(
      <RadioCard
        title="Hide Words"
        value="HIDE_WORD"
        selected
        onSelect={() => {}}
      />,
    );

    expect(screen.getByRole("radio")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onSelect with value", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <RadioCard
        title="Hide Words"
        value="HIDE_WORD"
        selected={false}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("radio"));

    expect(onSelect).toHaveBeenCalledWith("HIDE_WORD");
  });
});
















