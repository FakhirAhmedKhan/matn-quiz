import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { createShareableQuizJsonText } from "@/lib/quiz/shareable-quiz-export";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("Shareable quiz import/export flow", () => {
  const arabicText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  const importedQuiz: GeneratedHideWordQuiz = {
    originalText: arabicText,
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
    window.localStorage.clear();

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:shareable-json"),
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("copies generated quiz as shareable JSON", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: arabicText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /copy json/i }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("shareable-quiz-status")).toHaveTextContent(
      "Shareable JSON copied.",
    );
  });

  it("imports pasted shareable JSON into study UI", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    const importJson = createShareableQuizJsonText(importedQuiz, {
      exportedAt: new Date("2026-09-01T00:00:00.000Z"),
    });

    fireEvent.change(screen.getByTestId("shareable-import-textarea"), {
      target: { value: importJson },
    });

    await user.click(screen.getByRole("button", { name: /open imported quiz/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("history-status")).toHaveTextContent(
      "Imported quiz opened.",
    );
    expect(screen.getByTestId("generated-quiz-summary")).toHaveTextContent(
      "Hide Words: 2 hidden items",
    );
  });

  it("shows import validation error for bad JSON", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getByTestId("shareable-import-textarea"), {
      target: { value: "{bad json" },
    });

    await user.click(screen.getByRole("button", { name: /open imported quiz/i }));

    expect(screen.getByTestId("shareable-quiz-status")).toHaveTextContent(
      "Imported file is not valid JSON.",
    );
  });
});

















