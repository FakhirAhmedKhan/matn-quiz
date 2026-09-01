import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  AnswerRevealControls,
  AnswerRevealToggle,
} from "@/components/quiz/AnswerRevealControls";

describe("AnswerRevealControls", () => {
  it("renders study progress", () => {
    render(
      <AnswerRevealControls
        progress={{ total: 2, revealed: 1, hidden: 1, complete: false, percentage: 50 }}
        onRevealAll={() => {}}
        onHideAll={() => {}}
        onReset={() => {}}
      />,
    );

    expect(screen.getByTestId("answer-reveal-controls")).toBeInTheDocument();
    expect(screen.getByTestId("study-progress-text")).toHaveTextContent(
      "1 of 2 answers revealed · 50%",
    );
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

  it("calls hide all", async () => {
    const user = userEvent.setup();
    const onHideAll = vi.fn();

    render(
      <AnswerRevealControls
        progress={{ total: 2, revealed: 2, hidden: 0, complete: true, percentage: 100 }}
        onRevealAll={() => {}}
        onHideAll={onHideAll}
        onReset={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: /hide all answers/i }));
    expect(onHideAll).toHaveBeenCalledTimes(1);
  });

  it("calls reset study", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <AnswerRevealControls
        progress={{ total: 2, revealed: 1, hidden: 1, complete: false, percentage: 50 }}
        onRevealAll={() => {}}
        onHideAll={() => {}}
        onReset={onReset}
      />,
    );

    await user.click(screen.getByRole("button", { name: /reset study/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
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

describe("AnswerRevealToggle", () => {
  it("renders reveal mode", () => {
    render(<AnswerRevealToggle answerIndex={1} revealed={false} onToggle={() => {}} />);

    expect(screen.getByRole("button", { name: /reveal answer 1/i })).toBeInTheDocument();
  });

  it("renders hide mode", () => {
    render(<AnswerRevealToggle answerIndex={1} revealed onToggle={() => {}} />);

    expect(screen.getByRole("button", { name: /hide answer 1/i })).toBeInTheDocument();
  });

  it("calls toggle", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<AnswerRevealToggle answerIndex={1} revealed={false} onToggle={onToggle} />);

    await user.click(screen.getByRole("button", { name: /reveal answer 1/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
