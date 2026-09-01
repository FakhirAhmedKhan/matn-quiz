import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GeneratedQuizPreview } from "@/components/quiz/GeneratedQuizPreview";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("GeneratedQuizPreview", () => {
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

  it("renders generated quiz panel", () => {
    render(<GeneratedQuizPreview quiz={quiz} />);

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByText("Generated Quiz")).toBeInTheDocument();
  });

  it("renders success message", () => {
    render(<GeneratedQuizPreview quiz={quiz} />);

    expect(screen.getByTestId("generation-success-message")).toHaveTextContent(
      "Text accepted with Hide Words and hide count 1.",
    );
  });

  it("renders quiz summary", () => {
    render(<GeneratedQuizPreview quiz={quiz} />);

    expect(screen.getByTestId("generated-quiz-summary")).toHaveTextContent(
      "Hide Words: 1 hidden item",
    );
  });

  it("renders quiz text and answers", () => {
    render(<GeneratedQuizPreview quiz={quiz} />);

    expect(screen.getByTestId("generated-quiz-text")).toHaveTextContent(
      "____ اللَّهِ",
    );

    expect(screen.getAllByTestId("generated-answer-item")).toHaveLength(1);
    expect(screen.getByText("بِسْمِ")).toBeInTheDocument();
  });
});
