import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  formatSavedQuizDate,
  getSavedQuizPreview,
  SavedQuizHistory,
} from "@/components/quiz/SavedQuizHistory";
import type { SavedQuizRecord } from "@/lib/quiz/quiz-history";

describe("SavedQuizHistory state polish", () => {
  const record: SavedQuizRecord = {
    id: "quiz_1",
    version: 1,
    title: "Hide Words · 1 hidden · بِسْمِ اللَّهِ",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:10:00.000Z",
    quiz: {
      originalText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      quizText: "بِسْمِ ____ الرَّحْمَٰنِ الرَّحِيمِ",
      method: "HIDE_WORD",
      requestedCount: 1,
      hiddenCount: 1,
      selectedTokenIndexes: [2],
      answers: [
        {
          index: 1,
          kind: "word",
          wordIndex: 1,
          tokenIndex: 2,
          answer: "اللَّهِ",
        },
      ],
    },
  };

  it("formats saved quiz dates", () => {
    expect(formatSavedQuizDate("2026-09-01T00:10:00.000Z")).toBe(
      "2026-09-01 00:10",
    );
    expect(formatSavedQuizDate("bad-date")).toBe("Unknown date");
  });

  it("creates saved quiz preview", () => {
    expect(getSavedQuizPreview(record)).toContain("بِسْمِ ____");
  });

  it("renders polished empty state", () => {
    render(
      <SavedQuizHistory
        items={[]}
        onOpen={() => {}}
        onDelete={() => {}}
        onClear={() => {}}
      />,
    );

    expect(screen.getByTestId("saved-quiz-history")).toBeInTheDocument();
    expect(screen.getByTestId("saved-quiz-empty")).toHaveTextContent(
      "No saved quizzes yet.",
    );
    expect(screen.getByTestId("saved-quiz-empty")).toHaveTextContent(
      "Generate a quiz and use Save Quiz",
    );
    expect(
      screen.getByRole("button", { name: /clear history/i }),
    ).toBeDisabled();
  });

  it("renders saved quiz item", () => {
    render(
      <SavedQuizHistory
        items={[record]}
        onOpen={() => {}}
        onDelete={() => {}}
        onClear={() => {}}
      />,
    );

    expect(screen.getByTestId("saved-quiz-list")).toBeInTheDocument();
    expect(screen.getByTestId("saved-quiz-item")).toBeInTheDocument();
    expect(screen.getByTestId("saved-quiz-title")).toHaveTextContent(
      "Hide Words",
    );
    expect(screen.getByTestId("saved-quiz-method")).toHaveTextContent(
      "Hide Words",
    );
    expect(screen.getByTestId("saved-quiz-preview")).toHaveTextContent(
      "بِسْمِ ____",
    );
  });

  it("calls saved quiz callbacks", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onDelete = vi.fn();
    const onClear = vi.fn();

    render(
      <SavedQuizHistory
        items={[record]}
        onOpen={onOpen}
        onDelete={onDelete}
        onClear={onClear}
      />,
    );

    await user.click(screen.getByRole("button", { name: /open quiz/i }));
    await user.click(screen.getByRole("button", { name: /delete saved quiz/i }));
    await user.click(screen.getByRole("button", { name: /clear history/i }));

    expect(onOpen).toHaveBeenCalledWith(record);
    expect(onDelete).toHaveBeenCalledWith("quiz_1");
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});




