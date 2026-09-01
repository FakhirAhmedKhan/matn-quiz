import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GeneratedQuizPreview } from "@/components/quiz/GeneratedQuizPreview";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("GeneratedQuizPreview review mode", () => {
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

  it("renders review progress summary and answer controls", () => {
    render(<GeneratedQuizPreview quiz={quiz} />);

    expect(screen.getByTestId("review-progress-summary")).toBeInTheDocument();
    expect(screen.getAllByTestId("review-answer-controls")).toHaveLength(2);
    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "0 of 2 reviewed · 0% accuracy",
    );
  });

  it("marks one answer correct", async () => {
    const user = userEvent.setup();

    render(<GeneratedQuizPreview quiz={quiz} />);

    await user.click(
      screen.getByRole("button", { name: /mark answer 1 correct/i }),
    );

    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "1 of 2 reviewed · 100% accuracy",
    );
    expect(screen.getByTestId("review-progress-correct")).toHaveTextContent("1");
    expect(screen.getByTestId("review-progress-incorrect")).toHaveTextContent(
      "0",
    );

    const firstAnswer = screen.getAllByTestId("generated-answer-item")[0]!;
    expect(
      within(firstAnswer).getByTestId("review-answer-status-badge"),
    ).toHaveTextContent("Correct");
  });

  it("marks one answer incorrect", async () => {
    const user = userEvent.setup();

    render(<GeneratedQuizPreview quiz={quiz} />);

    await user.click(
      screen.getByRole("button", { name: /mark answer 2 incorrect/i }),
    );

    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "1 of 2 reviewed · 0% accuracy",
    );
    expect(screen.getByTestId("review-progress-correct")).toHaveTextContent("0");
    expect(screen.getByTestId("review-progress-incorrect")).toHaveTextContent(
      "1",
    );

    const secondAnswer = screen.getAllByTestId("generated-answer-item")[1]!;
    expect(
      within(secondAnswer).getByTestId("review-answer-status-badge"),
    ).toHaveTextContent("Incorrect");
  });

  it("completes review when all answers are marked", async () => {
    const user = userEvent.setup();

    render(<GeneratedQuizPreview quiz={quiz} />);

    await user.click(
      screen.getByRole("button", { name: /mark answer 1 correct/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /mark answer 2 incorrect/i }),
    );

    expect(screen.getByTestId("review-progress-status")).toHaveTextContent(
      "Review complete",
    );
    expect(screen.getByTestId("review-completion-text")).toHaveTextContent(
      "Review complete · 1/2 correct",
    );
    expect(screen.getByTestId("review-percentage-text")).toHaveTextContent(
      "100%",
    );
    expect(screen.getByTestId("review-progress-accuracy")).toHaveTextContent(
      "50%",
    );
  });

  it("resets one reviewed answer", async () => {
    const user = userEvent.setup();

    render(<GeneratedQuizPreview quiz={quiz} />);

    await user.click(
      screen.getByRole("button", { name: /mark answer 1 correct/i }),
    );

    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "1 of 2 reviewed",
    );

    await user.click(
      screen.getByRole("button", { name: /reset answer 1 review/i }),
    );

    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "0 of 2 reviewed · 0% accuracy",
    );
  });

  it("resets full review progress", async () => {
    const user = userEvent.setup();

    render(<GeneratedQuizPreview quiz={quiz} />);

    await user.click(
      screen.getByRole("button", { name: /mark answer 1 correct/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /mark answer 2 incorrect/i }),
    );

    expect(screen.getByTestId("review-progress-status")).toHaveTextContent(
      "Review complete",
    );

    await user.click(
      screen.getByRole("button", { name: /reset review progress/i }),
    );

    expect(screen.getByTestId("review-progress-status")).toHaveTextContent(
      "Review in progress",
    );
    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "0 of 2 reviewed · 0% accuracy",
    );
  });

  it("keeps save and reset quiz callbacks working", async () => {
    const user = userEvent.setup();
    const onSaveQuiz = vi.fn();
    const onResetQuiz = vi.fn();

    render(
      <GeneratedQuizPreview
        quiz={quiz}
        onSaveQuiz={onSaveQuiz}
        onResetQuiz={onResetQuiz}
      />,
    );

    await user.click(screen.getByRole("button", { name: /save quiz/i }));
    await user.click(screen.getByRole("button", { name: /reset quiz/i }));

    expect(onSaveQuiz).toHaveBeenCalledTimes(1);
    expect(onResetQuiz).toHaveBeenCalledTimes(1);
  });
});







