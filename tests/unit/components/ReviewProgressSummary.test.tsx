import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  getReviewAccuracyTone,
  getReviewProgressStatusLabel,
  ReviewProgressSummary,
} from "@/components/quiz/ReviewProgressSummary";
import {
  createQuizReviewState,
  markReviewAnswerCorrect,
  markReviewAnswerIncorrect,
} from "@/lib/quiz/review-session";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("ReviewProgressSummary", () => {
  const startedAt = new Date("2026-09-01T00:00:00.000Z");
  const reviewedAt = new Date("2026-09-01T00:10:00.000Z");

  const quiz: GeneratedHideWordQuiz = {
    originalText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    quizText: "بِسْمِ ____ ____ الرَّحِيمِ",
    method: "HIDE_WORD",
    requestedCount: 2,
    hiddenCount: 2,
    selectedTokenIndexes: [2, 4],
    answers: [
      {
        index: 1,
        kind: "word",
        wordIndex: 1,
        tokenIndex: 2,
        answer: "اللَّهِ",
      },
      {
        index: 2,
        kind: "word",
        wordIndex: 2,
        tokenIndex: 4,
        answer: "الرَّحْمَٰنِ",
      },
    ],
  };

  it("returns accuracy tone", () => {
    expect(getReviewAccuracyTone(0)).toBe("default");
    expect(getReviewAccuracyTone(25)).toBe("danger");
    expect(getReviewAccuracyTone(50)).toBe("warning");
    expect(getReviewAccuracyTone(80)).toBe("success");
  });

  it("returns review progress status label", () => {
    expect(getReviewProgressStatusLabel(false)).toBe("Review in progress");
    expect(getReviewProgressStatusLabel(true)).toBe("Review complete");
  });

  it("renders empty review progress", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    render(<ReviewProgressSummary state={state} />);

    expect(screen.getByTestId("review-progress-summary")).toBeInTheDocument();
    expect(screen.getByTestId("review-progress-status")).toHaveTextContent(
      "Review in progress",
    );
    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "0 of 2 reviewed · 0% accuracy",
    );
    expect(screen.getByTestId("review-completion-text")).toHaveTextContent(
      "2 answers left to review",
    );
    expect(screen.getByTestId("review-percentage-text")).toHaveTextContent(
      "0%",
    );
    expect(screen.getByTestId("review-progress-reviewed")).toHaveTextContent(
      "0/2",
    );
    expect(screen.getByTestId("review-progress-correct")).toHaveTextContent(
      "0",
    );
    expect(screen.getByTestId("review-progress-incorrect")).toHaveTextContent(
      "0",
    );
    expect(screen.getByTestId("review-progress-accuracy")).toHaveTextContent(
      "0%",
    );
  });

  it("renders partial review progress", () => {
    const state = markReviewAnswerCorrect(
      createQuizReviewState(quiz, {
        now: startedAt,
      }),
      1,
      {
        now: reviewedAt,
      },
    );

    render(<ReviewProgressSummary state={state} />);

    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "1 of 2 reviewed · 100% accuracy",
    );
    expect(screen.getByTestId("review-completion-text")).toHaveTextContent(
      "1 answer left to review",
    );
    expect(screen.getByTestId("review-percentage-text")).toHaveTextContent(
      "50%",
    );
    expect(screen.getByTestId("review-progress-reviewed")).toHaveTextContent(
      "1/2",
    );
    expect(screen.getByTestId("review-progress-correct")).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId("review-progress-incorrect")).toHaveTextContent(
      "0",
    );
    expect(screen.getByTestId("review-progress-accuracy")).toHaveTextContent(
      "100%",
    );
  });

  it("renders complete review progress", () => {
    let state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    state = markReviewAnswerCorrect(state, 1, {
      now: reviewedAt,
    });
    state = markReviewAnswerIncorrect(state, 2, {
      now: reviewedAt,
    });

    render(<ReviewProgressSummary state={state} />);

    expect(screen.getByTestId("review-progress-status")).toHaveTextContent(
      "Review complete",
    );
    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "2 of 2 reviewed · 50% accuracy",
    );
    expect(screen.getByTestId("review-completion-text")).toHaveTextContent(
      "Review complete · 1/2 correct",
    );
    expect(screen.getByTestId("review-percentage-text")).toHaveTextContent(
      "100%",
    );
    expect(screen.getByTestId("review-progress-reviewed")).toHaveTextContent(
      "2/2",
    );
    expect(screen.getByTestId("review-progress-correct")).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId("review-progress-incorrect")).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId("review-progress-accuracy")).toHaveTextContent(
      "50%",
    );
  });

  it("renders accessible progressbar", () => {
    const state = markReviewAnswerCorrect(
      createQuizReviewState(quiz, {
        now: startedAt,
      }),
      1,
      {
        now: reviewedAt,
      },
    );

    render(<ReviewProgressSummary state={state} />);

    expect(
      screen.getByRole("progressbar", { name: /review completion progress/i }),
    ).toHaveAttribute("aria-valuenow", "50");
    expect(screen.getByTestId("review-progress-bar-fill")).toHaveStyle({
      width: "50%",
    });
  });

  it("disables reset review button when nothing is reviewed", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    render(<ReviewProgressSummary state={state} onResetReview={() => {}} />);

    expect(
      screen.getByRole("button", { name: /reset review progress/i }),
    ).toBeDisabled();
  });

  it("calls reset review callback", async () => {
    const user = userEvent.setup();
    const onResetReview = vi.fn();

    const state = markReviewAnswerCorrect(
      createQuizReviewState(quiz, {
        now: startedAt,
      }),
      1,
      {
        now: reviewedAt,
      },
    );

    render(
      <ReviewProgressSummary
        state={state}
        onResetReview={onResetReview}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /reset review progress/i }),
    );

    expect(onResetReview).toHaveBeenCalledTimes(1);
  });

  it("does not render reset button when callback is missing", () => {
    const state = createQuizReviewState(quiz, {
      now: startedAt,
    });

    render(<ReviewProgressSummary state={state} />);

    expect(
      screen.queryByRole("button", { name: /reset review progress/i }),
    ).not.toBeInTheDocument();
  });
});















