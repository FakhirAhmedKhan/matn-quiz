import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ShareableQuizPanel } from "@/components/quiz/ShareableQuizPanel";
import {
  createShareableQuizDocument,
  serializeShareableQuizDocument,
} from "@/lib/quiz/shareable-quiz";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("ShareableQuizPanel", () => {
  const exportedAt = new Date("2026-09-01T00:00:00.000Z");

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

  beforeEach(() => {
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:shareable-json"),
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders disabled export actions without quiz", () => {
    render(<ShareableQuizPanel quiz={null} onImportQuiz={() => {}} />);

    expect(screen.getByTestId("shareable-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("shareable-quiz-state")).toHaveTextContent(
      "No quiz yet",
    );
    expect(screen.getByRole("button", { name: /export json/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /copy json/i })).toBeDisabled();
  });

  it("enables export actions with quiz", () => {
    render(<ShareableQuizPanel quiz={quiz} onImportQuiz={() => {}} />);

    expect(screen.getByTestId("shareable-quiz-state")).toHaveTextContent(
      "Quiz ready",
    );
    expect(screen.getByRole("button", { name: /export json/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /copy json/i })).toBeEnabled();
  });

  it("exports JSON file", async () => {
    const user = userEvent.setup();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    render(<ShareableQuizPanel quiz={quiz} onImportQuiz={() => {}} />);

    await user.click(screen.getByRole("button", { name: /export json/i }));

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(screen.getByTestId("shareable-quiz-status")).toHaveTextContent(
      "Shareable JSON file exported.",
    );

    clickSpy.mockRestore();
  });

  it("copies JSON to clipboard", async () => {
    const user = userEvent.setup();

    render(<ShareableQuizPanel quiz={quiz} onImportQuiz={() => {}} />);

    await user.click(screen.getByRole("button", { name: /copy json/i }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("shareable-quiz-status")).toHaveTextContent(
      "Shareable JSON copied.",
    );
  });

  it("imports valid JSON", async () => {
    const user = userEvent.setup();
    const onImportQuiz = vi.fn();
    const document = createShareableQuizDocument(quiz, {
      exportedAt,
    });

    render(<ShareableQuizPanel quiz={null} onImportQuiz={onImportQuiz} />);

    fireEvent.change(screen.getByTestId("shareable-import-textarea"), {
      target: { value: serializeShareableQuizDocument(document) },
    });

    await user.click(screen.getByRole("button", { name: /open imported quiz/i }));

    expect(onImportQuiz).toHaveBeenCalledWith(quiz, document);
    expect(screen.getByTestId("shareable-quiz-status")).toHaveTextContent(
      "Imported quiz opened.",
    );
  });

  it("shows import validation error", async () => {
    const user = userEvent.setup();

    render(<ShareableQuizPanel quiz={null} onImportQuiz={() => {}} />);

    fireEvent.change(screen.getByTestId("shareable-import-textarea"), {
      target: { value: "{bad json" },
    });

    await user.click(screen.getByRole("button", { name: /open imported quiz/i }));

    expect(screen.getByTestId("shareable-quiz-status")).toHaveTextContent(
      "Imported file is not valid JSON.",
    );
  });

  it("resets import text and status", async () => {
    const user = userEvent.setup();

    render(<ShareableQuizPanel quiz={null} onImportQuiz={() => {}} />);

    fireEvent.change(screen.getByTestId("shareable-import-textarea"), {
      target: { value: "{bad json" },
    });

    await user.click(screen.getByRole("button", { name: /open imported quiz/i }));

    expect(screen.getByTestId("shareable-quiz-status")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reset import/i }));

    expect(screen.getByTestId("shareable-import-textarea")).toHaveValue("");
    expect(screen.queryByTestId("shareable-quiz-status")).not.toBeInTheDocument();
  });
});

