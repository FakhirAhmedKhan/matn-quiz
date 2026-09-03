import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
} from "@/types/quiz";
import { QuizTtsPanel } from "@/components/quiz/QuizTtsPanel";

class MockSpeechSynthesisUtterance {
  text: string;
  lang = "";
  rate = 1;
  pitch = 1;

  constructor(text: string) {
    this.text = text;
  }
}

const wordQuiz: GeneratedHideWordQuiz = {
  originalText: "بسم الله الرحمن الرحيم",
  quizText: "بسم ____ الرحمن الرحيم",
  method: "HIDE_WORD",
  requestedCount: 1,
  hiddenCount: 1,
  selectedTokenIndexes: [2],
  answers: [
    {
      index: 1,
      tokenIndex: 2,
      wordIndex: 1,
      answer: "الله",
      kind: "word",
    },
  ],
};

const lineQuiz: GeneratedHideLineQuiz = {
  originalText: "بسم الله\nالرحمن الرحيم\nالحمد لله",
  quizText: "بسم الله\n____\nالحمد لله",
  method: "HIDE_LINE",
  requestedCount: 1,
  hiddenCount: 1,
  selectedTokenIndexes: [2],
  selectedLineIndexes: [2],
  answers: [
    {
      index: 1,
      tokenIndex: 2,
      lineIndex: 1,
      answer: "الرحمن الرحيم",
      kind: "line",
    },
  ],
};

describe("QuizTtsPanel", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("SpeechSynthesisUtterance", MockSpeechSynthesisUtterance);
    vi.stubGlobal("speechSynthesis", {
      cancel: vi.fn(),
      speak: vi.fn(),
    });
  });

  it("speaks visible word quiz text without hidden words", () => {
    render(<QuizTtsPanel quiz={wordQuiz} />);

    fireEvent.click(
      screen.getByRole("button", { name: /speak visible quiz text/i }),
    );

    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0];

    expect(utterance).toMatchObject({
      text: "بسم الرحمن الرحيم",
    });
    expect(JSON.stringify(utterance)).not.toContain("الله");
    expect(JSON.stringify(utterance)).not.toContain("____");
  });

  it("renders line controls and disables hidden line audio", () => {
    render(<QuizTtsPanel quiz={lineQuiz} />);

    expect(screen.getAllByTestId("tts-line-option")).toHaveLength(3);
    expect(
      screen.getByRole("button", {
        name: /hidden line 2 cannot be played/i,
      }),
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", { name: /speak visible line 1/i }),
    );

    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0];

    expect(utterance).toMatchObject({
      text: "بسم الله",
    });
    expect(JSON.stringify(utterance)).not.toContain("الرحمن الرحيم");
    expect(JSON.stringify(utterance)).not.toContain("____");
  });
});


