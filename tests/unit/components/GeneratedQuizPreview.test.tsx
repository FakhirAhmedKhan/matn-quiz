import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { GeneratedQuizPreview } from "@/components/quiz/GeneratedQuizPreview";
import type { GeneratedHideLineQuiz, GeneratedHideWordQuiz } from "@/types/quiz";

describe("GeneratedQuizPreview Arabic reading UX", () => {
  const wordQuiz: GeneratedHideWordQuiz = {
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

  const lineQuiz: GeneratedHideLineQuiz = {
    originalText: "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ",
    quizText: "____\nالرَّحْمَٰنِ الرَّحِيمِ",
    method: "HIDE_LINE",
    requestedCount: 1,
    hiddenCount: 1,
    selectedTokenIndexes: [0],
    selectedLineIndexes: [0],
    answers: [
      {
        index: 1,
        kind: "line",
        lineIndex: 0,
        tokenIndex: 0,
        answer: "بِسْمِ اللَّهِ",
      },
    ],
  };

  it("renders generated quiz panel", () => {
    render(<GeneratedQuizPreview quiz={wordQuiz} />);

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByText("Generated Quiz")).toBeInTheDocument();
  });

  it("renders Arabic reading panel for quiz text", () => {
    render(<GeneratedQuizPreview quiz={wordQuiz} />);

    expect(screen.getByTestId("generated-quiz-reading-panel")).toBeInTheDocument();
    expect(screen.getByTestId("generated-quiz-text")).toHaveAttribute("dir", "rtl");
    expect(screen.getByTestId("generated-quiz-text")).toHaveAttribute("lang", "ar");
    expect(screen.getByTestId("generated-quiz-text")).toHaveTextContent(
      "بِسْمِ ____ ____ الرَّحِيمِ",
    );
  });

  it("shows method pill for word study", () => {
    render(<GeneratedQuizPreview quiz={wordQuiz} />);

    expect(screen.getByTestId("generated-method-pill")).toHaveTextContent(
      "Word Study",
    );
  });

  it("shows method pill for line study", () => {
    render(<GeneratedQuizPreview quiz={lineQuiz} />);

    expect(screen.getByTestId("generated-method-pill")).toHaveTextContent(
      "Line Study",
    );
  });

  it("shows hidden answer placeholders by default", () => {
    render(<GeneratedQuizPreview quiz={wordQuiz} />);

    expect(screen.getByTestId("answer-display-1")).toHaveTextContent("••••");
    expect(screen.getByTestId("answer-display-2")).toHaveTextContent("••••");
  });

  it("keeps answer display rtl", () => {
    render(<GeneratedQuizPreview quiz={wordQuiz} />);

    expect(screen.getByTestId("answer-display-1")).toHaveAttribute("dir", "rtl");
    expect(screen.getByTestId("answer-display-1")).toHaveAttribute("lang", "ar");
  });

  it("reveals one Arabic answer", async () => {
    const user = userEvent.setup();

    render(<GeneratedQuizPreview quiz={wordQuiz} />);

    await user.click(screen.getByRole("button", { name: /reveal answer 1/i }));

    expect(screen.getByTestId("answer-display-1")).toHaveTextContent("اللَّهِ");
    expect(screen.getByTestId("answer-display-2")).toHaveTextContent("••••");
    expect(screen.getByTestId("study-progress-text")).toHaveTextContent(
      "1 of 2 answers revealed · 50%",
    );
  });

  it("reveals all Arabic answers", async () => {
    const user = userEvent.setup();

    render(<GeneratedQuizPreview quiz={wordQuiz} />);

    await user.click(screen.getByRole("button", { name: /reveal all answers/i }));

    expect(screen.getByTestId("answer-display-1")).toHaveTextContent("اللَّهِ");
    expect(screen.getByTestId("answer-display-2")).toHaveTextContent("الرَّحْمَٰنِ");
  });
});

















