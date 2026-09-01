import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  formatSavedQuizDate,
  getSavedQuizPreview,
  SavedQuizHistory,
  SavedQuizHistoryItem,
} from "@/components/quiz/SavedQuizHistory";
import type { SavedQuizRecord } from "@/lib/quiz/quiz-history";
import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
} from "@/types/quiz";

describe("SavedQuizHistory component", () => {
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

  const wordRecord: SavedQuizRecord = {
    id: "word-record",
    version: 1,
    title: "Hide Words · 2 hidden · بِسْمِ اللَّهِ",
    quiz: wordQuiz,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  };

  const lineRecord: SavedQuizRecord = {
    id: "line-record",
    version: 1,
    title: "Hide Lines · 1 hidden · بِسْمِ اللَّهِ",
    quiz: lineQuiz,
    createdAt: "2026-09-02T10:30:00.000Z",
    updatedAt: "2026-09-02T10:30:00.000Z",
  };

  it("formats saved quiz date", () => {
    expect(formatSavedQuizDate("2026-09-01T00:00:00.000Z")).toBe(
      "2026-09-01 00:00",
    );
  });

  it("returns unknown date for invalid date text", () => {
    expect(formatSavedQuizDate("")).toBe("Unknown date");
  });

  it("gets saved quiz preview", () => {
    expect(getSavedQuizPreview(wordRecord)).toBe(
      "بِسْمِ ____ ____ الرَّحِيمِ",
    );
  });

  it("truncates long saved quiz preview", () => {
    const record: SavedQuizRecord = {
      ...wordRecord,
      quiz: {
        ...wordQuiz,
        quizText: "ا".repeat(120),
      },
    };

    expect(getSavedQuizPreview(record)).toHaveLength(93);
    expect(getSavedQuizPreview(record).endsWith("...")).toBe(true);
  });

  it("renders empty history state", () => {
    render(
      <SavedQuizHistory
        items={[]}
        onOpen={() => {}}
        onDelete={() => {}}
        onClear={() => {}}
      />,
    );

    expect(screen.getByTestId("saved-quiz-history")).toBeInTheDocument();
    expect(screen.getByText("Saved Quiz History")).toBeInTheDocument();
    expect(screen.getByTestId("saved-quiz-empty")).toHaveTextContent(
      "No saved quizzes yet.",
    );
    expect(
      screen.getByRole("button", { name: /clear history/i }),
    ).toBeDisabled();
  });

  it("renders saved quiz list", () => {
    render(
      <SavedQuizHistory
        items={[wordRecord, lineRecord]}
        onOpen={() => {}}
        onDelete={() => {}}
        onClear={() => {}}
      />,
    );

    expect(screen.getByTestId("saved-quiz-list")).toBeInTheDocument();
    expect(screen.getAllByTestId("saved-quiz-item")).toHaveLength(2);
    expect(screen.getAllByTestId("saved-quiz-title")[0]).toHaveTextContent(
      "Hide Words · 2 hidden",
    );
    expect(screen.getAllByTestId("saved-quiz-title")[1]).toHaveTextContent(
      "Hide Lines · 1 hidden",
    );
  });

  it("renders method labels", () => {
    render(
      <SavedQuizHistory
        items={[wordRecord, lineRecord]}
        onOpen={() => {}}
        onDelete={() => {}}
        onClear={() => {}}
      />,
    );

    expect(screen.getAllByTestId("saved-quiz-method")[0]).toHaveTextContent(
      "Hide Words",
    );
    expect(screen.getAllByTestId("saved-quiz-method")[1]).toHaveTextContent(
      "Hide Lines",
    );
  });

  it("uses rtl preview text", () => {
    render(
      <SavedQuizHistoryItem
        record={wordRecord}
        onOpen={() => {}}
        onDelete={() => {}}
      />,
    );

    expect(screen.getByTestId("saved-quiz-preview")).toHaveAttribute("dir", "rtl");
    expect(screen.getByTestId("saved-quiz-preview")).toHaveAttribute("lang", "ar");
  });

  it("opens saved quiz record", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    render(
      <SavedQuizHistory
        items={[wordRecord]}
        onOpen={onOpen}
        onDelete={() => {}}
        onClear={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: /open quiz/i }));

    expect(onOpen).toHaveBeenCalledWith(wordRecord);
  });

  it("deletes saved quiz record", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <SavedQuizHistory
        items={[wordRecord]}
        onOpen={() => {}}
        onDelete={onDelete}
        onClear={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledWith("word-record");
  });

  it("clears saved quiz history", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(
      <SavedQuizHistory
        items={[wordRecord]}
        onOpen={() => {}}
        onDelete={() => {}}
        onClear={onClear}
      />,
    );

    await user.click(screen.getByRole("button", { name: /clear history/i }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("disables item actions when disabled", () => {
    render(
      <SavedQuizHistory
        items={[wordRecord]}
        onOpen={() => {}}
        onDelete={() => {}}
        onClear={() => {}}
        disabled
      />,
    );

    expect(screen.getByRole("button", { name: /open quiz/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /delete/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /clear history/i })).toBeDisabled();
  });
});
















