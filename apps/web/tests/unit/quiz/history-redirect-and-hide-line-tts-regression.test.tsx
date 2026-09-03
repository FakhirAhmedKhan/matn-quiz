import {
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  SavedQuizHistoryItem,
} from "@/components/quiz/SavedQuizHistory";
import {
  buildSpeakableTextForVisibleLine,
  buildTtsLineOptions,
} from "@/lib/quiz/tts-safe-text";
import type {
  SavedQuizRecord,
} from "@/lib/quiz/quiz-history";
import type {
  GeneratedHideLineQuiz,
} from "@/types/quiz";

function createLineQuiz(
  selectedLineIndexes: number[] = [2],
): GeneratedHideLineQuiz {
  return {
    originalText:
      "visible first\nhidden middle\nvisible last",
    quizText:
      "visible first\n____\nvisible last",
    method: "HIDE_LINE",
    requestedCount: 1,
    hiddenCount: 1,
    selectedTokenIndexes: [2],
    selectedLineIndexes,
    answers: [
      {
        index: 1,
        tokenIndex: 2,
        lineIndex: 1,
        answer: "hidden middle",
        kind: "line",
      },
    ],
  };
}

function createSavedRecord(): SavedQuizRecord {
  return {
    id: "saved-1",
    version: 1,
    title: "Saved Quiz",
    quiz: createLineQuiz(),
    createdAt:
      "2026-09-04T00:00:00.000Z",
    updatedAt:
      "2026-09-04T00:00:00.000Z",
  };
}

describe("history redirect and hide-line TTS regressions", () => {
  it("keeps the reusable history item behavior unchanged by default", () => {
    const onOpen = vi.fn();

    render(
      <SavedQuizHistoryItem
        record={createSavedRecord()}
        onOpen={onOpen}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Open Quiz",
      }),
    ).toBeInTheDocument();
  });

  it("supports a study destination without requiring next/router hooks", () => {
    render(
      <SavedQuizHistoryItem
        record={createSavedRecord()}
        onOpen={vi.fn()}
        onDelete={vi.fn()}
        openHref="/study"
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Open Quiz",
      }),
    ).toHaveAttribute(
      "href",
      "/study",
    );
  });

  it("keeps newline-preserving token indexes for HIDE_LINE", () => {
    const lines =
      buildTtsLineOptions(
        createLineQuiz(),
      );

    expect(
      lines.map(
        (line) =>
          line.tokenIndex,
      ),
    ).toEqual([
      0,
      2,
      4,
    ]);

    expect(lines[1]).toMatchObject({
      tokenIndex: 2,
      hidden: true,
      speakableText: "",
    });

    expect(lines[2]).toMatchObject({
      tokenIndex: 4,
      hidden: false,
      speakableText:
        "visible last",
    });
  });

  it("uses hidden answer tokenIndex as an additional TTS safety fallback", () => {
    const quiz =
      createLineQuiz([]);

    const lines =
      buildTtsLineOptions(quiz);

    expect(lines[1]).toMatchObject({
      tokenIndex: 2,
      hidden: true,
      speakableText: "",
    });

    expect(
      buildSpeakableTextForVisibleLine(
        quiz,
        2,
      ),
    ).toBe("");
  });

  it("still allows visible HIDE_LINE text", () => {
    const quiz =
      createLineQuiz();

    expect(
      buildSpeakableTextForVisibleLine(
        quiz,
        0,
      ),
    ).toBe(
      "visible first",
    );

    expect(
      buildSpeakableTextForVisibleLine(
        quiz,
        4,
      ),
    ).toBe(
      "visible last",
    );
  });
});