import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { GeneratedQuizPreview } from "@/components/quiz/GeneratedQuizPreview";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("GeneratedQuizPreview study display", () => {
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

  it("renders generated quiz panel", () => {
    render(<GeneratedQuizPreview quiz={quiz} />);

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByText("Generated Quiz")).toBeInTheDocument();
  });

  it("shows hidden answer placeholders by default", () => {
    render(<GeneratedQuizPreview quiz={quiz} />);

    expect(screen.getByTestId("answer-display-1")).toHaveTextContent("••••");
    expect(screen.getByTestId("answer-display-2")).toHaveTextContent("••••");
    expect(screen.getByTestId("study-progress-text")).toHaveTextContent(
      "0 of 2 answers revealed · 0%",
    );
  });

  it("reveals one answer", async () => {
    const user = userEvent.setup();

    render(<GeneratedQuizPreview quiz={quiz} />);

    await user.click(screen.getByRole("button", { name: /reveal answer 1/i }));

    expect(screen.getByTestId("answer-display-1")).toHaveTextContent("اللَّهِ");
    expect(screen.getByTestId("answer-display-2")).toHaveTextContent("••••");
    expect(screen.getByTestId("study-progress-text")).toHaveTextContent(
      "1 of 2 answers revealed · 50%",
    );
  });

  it("reveals all answers", async () => {
    const user = userEvent.setup();

    render(<GeneratedQuizPreview quiz={quiz} />);

    await user.click(screen.getByRole("button", { name: /reveal all answers/i }));

    expect(screen.getByTestId("answer-display-1")).toHaveTextContent("اللَّهِ");
    expect(screen.getByTestId("answer-display-2")).toHaveTextContent("الرَّحْمَٰنِ");
    expect(screen.getByTestId("study-progress-text")).toHaveTextContent(
      "2 of 2 answers revealed · 100%",
    );
  });

  it("resets study state", async () => {
    const user = userEvent.setup();

    render(<GeneratedQuizPreview quiz={quiz} />);

    await user.click(screen.getByRole("button", { name: /reveal all answers/i }));
    await user.click(screen.getByRole("button", { name: /reset study/i }));

    expect(screen.getByTestId("answer-display-1")).toHaveTextContent("••••");
    expect(screen.getByTestId("answer-display-2")).toHaveTextContent("••••");
  });
});
