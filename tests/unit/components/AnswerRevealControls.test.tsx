import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  AnswerRevealControls,
  AnswerRevealToggle,
} from "@/components/quiz/AnswerRevealControls";

describe("AnswerRevealControls accessibility", () => {
  it("renders study progress and progressbar", () => {
    render(
      <AnswerRevealControls
        progress={{ total: 2, revealed: 1, hidden: 1, complete: false, percentage: 50 }}
        onRevealAll={() => {}}
        onHideAll={() => {}}
        onReset={() => {}}
      />,
    );

    expect(screen.getByTestId("answer-reveal-controls")).toHaveAttribute(
      "aria-label",
      "Answer reveal controls",
    );
    expect(screen.getByTestId("study-progress-text")).toHaveAttribute(
      "aria-live",
      "polite",
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "50 percent");
  });

  it("calls reveal all", async () => {
    const user = userEvent.setup();
    const onRevealAll = vi.fn();

    render(
      <AnswerRevealControls
        progress={{ total: 2, revealed: 0, hidden: 2, complete: false, percentage: 0 }}
        onRevealAll={onRevealAll}
        onHideAll={() => {}}
        onReset={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: /reveal all answers/i }));
    expect(onRevealAll).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when there are no answers", () => {
    render(
      <AnswerRevealControls
        progress={{ total: 0, revealed: 0, hidden: 0, complete: false, percentage: 0 }}
        onRevealAll={() => {}}
        onHideAll={() => {}}
        onReset={() => {}}
      />,
    );

    expect(screen.getByRole("button", { name: /reveal all answers/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /hide all answers/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /reset study/i })).toBeDisabled();
  });
});

describe("AnswerRevealToggle accessibility", () => {
  it("renders reveal mode with aria label", () => {
    render(<AnswerRevealToggle answerIndex={1} revealed={false} onToggle={() => {}} />);

    expect(screen.getByRole("button", { name: /reveal answer 1/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("renders hide mode with aria pressed", () => {
    render(<AnswerRevealToggle answerIndex={1} revealed onToggle={() => {}} />);

    expect(screen.getByRole("button", { name: /hide answer 1/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("calls toggle", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<AnswerRevealToggle answerIndex={1} revealed={false} onToggle={onToggle} />);

    await user.click(screen.getByRole("button", { name: /reveal answer 1/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

