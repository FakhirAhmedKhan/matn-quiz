import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StudySessionResumePanel } from "@/components/quiz/StudySessionResumePanel";
import {
  createPersistedStudySessionDocument,
  type PersistedStudySessionPayload,
} from "@/lib/quiz/study-session-persistence";
import {
  createQuizReviewState,
  markReviewAnswerCorrect,
} from "@/lib/quiz/review-session";
import {
  createQuizStudyState,
  revealAnswer,
} from "@/lib/quiz/study-session";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("StudySessionResumePanel", () => {
  const now = new Date("2026-09-01T00:00:00.000Z");
  const later = new Date("2026-09-01T00:10:00.000Z");

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

  function createDocument() {
    const freshPayload: PersistedStudySessionPayload = {
      studyState: createQuizStudyState(quiz),
      reviewState: createQuizReviewState(quiz, {
        now,
      }),
    };

    return createPersistedStudySessionDocument(
      {
        studyState: revealAnswer(freshPayload.studyState, 1),
        reviewState: markReviewAnswerCorrect(freshPayload.reviewState, 1, {
          now: later,
        }),
      },
      {
        now: later,
        sessionId: "study_resume",
      },
    );
  }

  it("renders empty state", () => {
    render(
      <StudySessionResumePanel
        document={null}
        onResume={() => {}}
        onClear={() => {}}
      />,
    );

    expect(screen.getByTestId("study-session-resume-panel")).toBeInTheDocument();
    expect(screen.getByTestId("study-session-resume-state")).toHaveTextContent(
      "No session",
    );
    expect(screen.getByTestId("study-session-resume-empty")).toHaveTextContent(
      "No unfinished study session is saved in this browser.",
    );
  });

  it("renders saved session card", () => {
    render(
      <StudySessionResumePanel
        document={createDocument()}
        onResume={() => {}}
        onClear={() => {}}
      />,
    );

    expect(screen.getByTestId("study-session-resume-state")).toHaveTextContent(
      "Session found",
    );
    expect(screen.getByTestId("study-session-resume-summary")).toHaveTextContent(
      "1 revealed · 1 reviewed · 100% accuracy",
    );
    expect(screen.getByTestId("study-session-resume-saved-at")).toHaveTextContent(
      "Saved at 2026-09-01 00:10",
    );
    expect(screen.getByTestId("study-session-resume-progress-state")).toHaveTextContent(
      "Progress available",
    );
  });

  it("calls resume callback", async () => {
    const user = userEvent.setup();
    const document = createDocument();
    const onResume = vi.fn();

    render(
      <StudySessionResumePanel
        document={document}
        onResume={onResume}
        onClear={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: /resume session/i }));

    expect(onResume).toHaveBeenCalledWith(document);
  });

  it("calls clear callback", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(
      <StudySessionResumePanel
        document={createDocument()}
        onResume={() => {}}
        onClear={onClear}
      />,
    );

    await user.click(screen.getByRole("button", { name: /clear session/i }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});











