import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuizActionBar } from "@/components/quiz/QuizActionBar";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("QuizActionBar", () => {
  const quiz: GeneratedHideWordQuiz = {
    originalText: "بِسْمِ اللَّهِ",
    quizText: "____ اللَّهِ",
    method: "HIDE_WORD",
    requestedCount: 1,
    hiddenCount: 1,
    selectedTokenIndexes: [0],
    answers: [
      {
        index: 1,
        kind: "word",
        wordIndex: 0,
        tokenIndex: 0,
        answer: "بِسْمِ",
      },
    ],
  };

  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:test"),
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("renders actions", () => {
    render(<QuizActionBar quiz={quiz} onResetQuiz={() => {}} />);

    expect(screen.getByTestId("quiz-action-bar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy quiz/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy answers/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /export txt/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset quiz/i })).toBeInTheDocument();
  });

  it("copies quiz", async () => {
    const user = userEvent.setup();

    render(<QuizActionBar quiz={quiz} onResetQuiz={() => {}} />);

    await user.click(screen.getByRole("button", { name: /copy quiz/i }));

    expect(screen.getByTestId("quiz-action-status")).toHaveTextContent("Quiz copied.");
  });

  it("copies answers", async () => {
    const user = userEvent.setup();

    render(<QuizActionBar quiz={quiz} onResetQuiz={() => {}} />);

    await user.click(screen.getByRole("button", { name: /copy answers/i }));

    expect(screen.getByTestId("quiz-action-status")).toHaveTextContent(
      "Answers copied.",
    );
  });

  it("exports txt file", async () => {
    const user = userEvent.setup();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    render(<QuizActionBar quiz={quiz} onResetQuiz={() => {}} />);

    await user.click(screen.getByRole("button", { name: /export txt/i }));

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(screen.getByTestId("quiz-action-status")).toHaveTextContent(
      "Text file exported.",
    );

    clickSpy.mockRestore();
  });

  it("resets quiz", async () => {
    const user = userEvent.setup();
    const onResetQuiz = vi.fn();

    render(<QuizActionBar quiz={quiz} onResetQuiz={onResetQuiz} />);

    await user.click(screen.getByRole("button", { name: /reset quiz/i }));

    expect(onResetQuiz).toHaveBeenCalledTimes(1);
  });
});








