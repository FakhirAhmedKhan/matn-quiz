import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  getReviewAnswerStatusClasses,
  ReviewAnswerControls,
  ReviewAnswerStatusBadge,
} from "@/components/quiz/ReviewAnswerControls";

describe("ReviewAnswerStatusBadge", () => {
  it("renders unanswered status", () => {
    render(<ReviewAnswerStatusBadge status="unanswered" />);

    expect(screen.getByTestId("review-answer-status-badge")).toHaveTextContent(
      "Unanswered",
    );
  });

  it("renders correct status", () => {
    render(<ReviewAnswerStatusBadge status="correct" />);

    expect(screen.getByTestId("review-answer-status-badge")).toHaveTextContent(
      "Correct",
    );
  });

  it("renders incorrect status", () => {
    render(<ReviewAnswerStatusBadge status="incorrect" />);

    expect(screen.getByTestId("review-answer-status-badge")).toHaveTextContent(
      "Incorrect",
    );
  });

  it("returns status classes", () => {
    expect(getReviewAnswerStatusClasses("unanswered")).toContain("slate");
    expect(getReviewAnswerStatusClasses("correct")).toContain("emerald");
    expect(getReviewAnswerStatusClasses("incorrect")).toContain("red");
  });
});

describe("ReviewAnswerControls", () => {
  it("renders answer review controls", () => {
    render(
      <ReviewAnswerControls
        answerIndex={1}
        status="unanswered"
        onMarkCorrect={() => {}}
        onMarkIncorrect={() => {}}
        onResetAnswer={() => {}}
      />,
    );

    expect(screen.getByTestId("review-answer-controls")).toBeInTheDocument();
    expect(screen.getByText("Review Answer 1")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mark answer 1 correct/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mark answer 1 incorrect/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset answer 1 review/i }),
    ).toBeDisabled();
  });

  it("marks answer correct", async () => {
    const user = userEvent.setup();
    const onMarkCorrect = vi.fn();

    render(
      <ReviewAnswerControls
        answerIndex={2}
        status="unanswered"
        onMarkCorrect={onMarkCorrect}
        onMarkIncorrect={() => {}}
        onResetAnswer={() => {}}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /mark answer 2 correct/i }),
    );

    expect(onMarkCorrect).toHaveBeenCalledWith(2);
  });

  it("marks answer incorrect", async () => {
    const user = userEvent.setup();
    const onMarkIncorrect = vi.fn();

    render(
      <ReviewAnswerControls
        answerIndex={3}
        status="unanswered"
        onMarkCorrect={() => {}}
        onMarkIncorrect={onMarkIncorrect}
        onResetAnswer={() => {}}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /mark answer 3 incorrect/i }),
    );

    expect(onMarkIncorrect).toHaveBeenCalledWith(3);
  });

  it("resets reviewed answer", async () => {
    const user = userEvent.setup();
    const onResetAnswer = vi.fn();

    render(
      <ReviewAnswerControls
        answerIndex={4}
        status="correct"
        onMarkCorrect={() => {}}
        onMarkIncorrect={() => {}}
        onResetAnswer={onResetAnswer}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /reset answer 4 review/i }),
    );

    expect(onResetAnswer).toHaveBeenCalledWith(4);
  });

  it("shows selected correct button", () => {
    render(
      <ReviewAnswerControls
        answerIndex={1}
        status="correct"
        onMarkCorrect={() => {}}
        onMarkIncorrect={() => {}}
        onResetAnswer={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: /mark answer 1 correct/i }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /mark answer 1 incorrect/i }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("shows selected incorrect button", () => {
    render(
      <ReviewAnswerControls
        answerIndex={1}
        status="incorrect"
        onMarkCorrect={() => {}}
        onMarkIncorrect={() => {}}
        onResetAnswer={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: /mark answer 1 incorrect/i }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /mark answer 1 correct/i }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("disables all controls when disabled", () => {
    render(
      <ReviewAnswerControls
        answerIndex={1}
        status="correct"
        disabled
        onMarkCorrect={() => {}}
        onMarkIncorrect={() => {}}
        onResetAnswer={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: /mark answer 1 correct/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /mark answer 1 incorrect/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /reset answer 1 review/i }),
    ).toBeDisabled();
  });
});




















