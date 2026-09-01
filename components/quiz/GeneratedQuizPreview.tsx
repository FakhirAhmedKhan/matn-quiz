"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  AnswerRevealControls,
  AnswerRevealToggle,
} from "@/components/quiz/AnswerRevealControls";
import { ArabicReadingPanel } from "@/components/quiz/ArabicReadingPanel";
import { QuizActionBar } from "@/components/quiz/QuizActionBar";
import { ReviewAnswerControls } from "@/components/quiz/ReviewAnswerControls";
import { ReviewProgressSummary } from "@/components/quiz/ReviewProgressSummary";
import {
  createQuizReviewState,
  getQuizReviewProgress,
  getReviewAnswerState,
  markReviewAnswerCorrect,
  markReviewAnswerIncorrect,
  resetQuizReviewState,
  resetReviewAnswer,
  type QuizReviewState,
} from "@/lib/quiz/review-session";
import {
  createQuizStudyState,
  getAnswerDisplayValue,
  getStudyProgress,
  hideAllAnswers,
  isAnswerRevealed,
  resetStudyState,
  revealAllAnswers,
  toggleAnswer,
  type QuizStudyState,
} from "@/lib/quiz/study-session";
import { createPersistedStudySessionId } from "@/lib/quiz/study-session-persistence";
import {
  clearPersistedStudySession,
  savePersistedStudySession,
} from "@/lib/quiz/study-session-repository";
import { getGeneratedQuizSummary } from "@/lib/quiz/unified-quiz";
import {
  arabicAnswerClasses,
  getMethodAccentClasses,
} from "@/lib/ui/design-system";
import { cn } from "@/lib/utils/cn";
import type { GeneratedQuiz } from "@/types/quiz";

interface GeneratedQuizPreviewProps {
  quiz: GeneratedQuiz;
  onResetQuiz?: () => void;
  onSaveQuiz?: () => void;
  initialStudyState?: QuizStudyState;
  initialReviewState?: QuizReviewState;
  studySessionId?: string;
  className?: string;
}

function hasStudyOrReviewProgress(
  studyState: QuizStudyState,
  reviewState: QuizReviewState,
): boolean {
  const studyProgress = getStudyProgress(studyState);
  const reviewProgress = getQuizReviewProgress(reviewState);

  return studyProgress.revealed > 0 || reviewProgress.reviewed > 0;
}

export function GeneratedQuizPreview({
  quiz,
  onResetQuiz,
  onSaveQuiz,
  initialStudyState,
  initialReviewState,
  studySessionId: providedStudySessionId,
  className,
}: GeneratedQuizPreviewProps) {
  const fallbackStudyState = useMemo(() => createQuizStudyState(quiz), [quiz]);
  const fallbackReviewState = useMemo(() => createQuizReviewState(quiz), [quiz]);

  const [studyState, setStudyState] = useState<QuizStudyState>(
    initialStudyState ?? fallbackStudyState,
  );
  const [reviewState, setReviewState] = useState<QuizReviewState>(
    initialReviewState ?? fallbackReviewState,
  );
  const [studySessionId, setStudySessionId] = useState(
    providedStudySessionId ?? createPersistedStudySessionId(),
  );
  const [autoSaveStatus, setAutoSaveStatus] = useState(
    initialStudyState || initialReviewState
      ? "Study session resumed."
      : "Study session ready.",
  );

  useEffect(() => {
    const nextStudyState = initialStudyState ?? createQuizStudyState(quiz);
    const nextReviewState = initialReviewState ?? createQuizReviewState(quiz);

    setStudyState(nextStudyState);
    setReviewState(nextReviewState);
    setStudySessionId(providedStudySessionId ?? createPersistedStudySessionId());

    if (initialStudyState || initialReviewState) {
      setAutoSaveStatus("Study session resumed.");
      return;
    }

    setAutoSaveStatus("Study session ready.");
    clearPersistedStudySession();
  }, [quiz, initialStudyState, initialReviewState, providedStudySessionId]);

  useEffect(() => {
    if (!hasStudyOrReviewProgress(studyState, reviewState)) {
      clearPersistedStudySession();
      setAutoSaveStatus(
        initialStudyState || initialReviewState
          ? "Study session resumed."
          : "Study session ready.",
      );
      return;
    }

    const saved = savePersistedStudySession(
      {
        studyState,
        reviewState,
      },
      {
        sessionId: studySessionId,
      },
    );

    setAutoSaveStatus(
      saved
        ? "Study session auto-saved."
        : "Study session auto-save unavailable.",
    );
  }, [studyState, reviewState, studySessionId, initialStudyState, initialReviewState]);

  const progress = getStudyProgress(studyState);

  return (
    <section
      data-testid="generated-quiz-panel"
      className={cn("space-y-6", className)}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <CheckCircle2 className="h-5 w-5 shrink-0" />

        <p data-testid="generation-success-message">
          Text accepted with{" "}
          <strong>
            {quiz.method === "HIDE_WORD" ? "Hide Words" : "Hide Lines"}
          </strong>{" "}
          and hide count{" "}
          <strong data-testid="generated-hidden-count">
            {quiz.hiddenCount}
          </strong>
          .
        </p>
      </div>

      <p
        data-testid="study-session-save-status"
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
      >
        {autoSaveStatus}
      </p>

      <QuizActionBar
        quiz={quiz}
        onSaveQuiz={onSaveQuiz}
        onResetQuiz={() => {
          setStudyState((current) => resetStudyState(current));
          setReviewState((current) => resetQuizReviewState(current));
          clearPersistedStudySession();
          onResetQuiz?.();
        }}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Generated Quiz
          </h2>

          <p
            data-testid="generated-quiz-summary"
            className="mt-1 text-sm leading-6 text-slate-600"
          >
            {getGeneratedQuizSummary(quiz)}
          </p>
        </div>

        <span
          data-testid="generated-method-pill"
          className={cn(
            "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold",
            getMethodAccentClasses(quiz.method),
          )}
        >
          {quiz.method === "HIDE_WORD" ? "Word Study" : "Line Study"}
        </span>
      </div>

      <AnswerRevealControls
        progress={progress}
        onRevealAll={() => setStudyState((current) => revealAllAnswers(current))}
        onHideAll={() => setStudyState((current) => hideAllAnswers(current))}
        onReset={() => setStudyState((current) => resetStudyState(current))}
      />

      <ReviewProgressSummary
        state={reviewState}
        onResetReview={() =>
          setReviewState((current) => resetQuizReviewState(current))
        }
      />

      <ArabicReadingPanel
        title="Quiz Text"
        description="Read the generated quiz from right to left with preserved line spacing."
        text={quiz.quizText}
        density={quiz.method === "HIDE_LINE" ? "spacious" : "comfortable"}
        testId="generated-quiz-reading-panel"
        textTestId="generated-quiz-text"
      />

      <div>
        <h3 className="text-sm font-semibold text-slate-950">Answers</h3>

        <ol data-testid="generated-answer-list" className="mt-3 space-y-3">
          {quiz.answers.map((answer) => {
            const revealed = isAnswerRevealed(studyState, answer.index);
            const reviewAnswer = getReviewAnswerState(
              reviewState,
              answer.index,
            );

            return (
              <li
                key={`${answer.kind}-${answer.tokenIndex}-${answer.index}`}
                data-testid="generated-answer-item"
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Answer {answer.index}
                    </p>

                    <span
                      className={cn(
                        "mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                        answer.kind === "word"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-indigo-200 bg-indigo-50 text-indigo-800",
                      )}
                    >
                      {answer.kind === "word" ? "Word" : "Line"}
                    </span>
                  </div>

                  <AnswerRevealToggle
                    answerIndex={answer.index}
                    revealed={revealed}
                    onToggle={() =>
                      setStudyState((current) =>
                        toggleAnswer(current, answer.index),
                      )
                    }
                  />
                </div>

                <p
                  data-testid={`answer-display-${answer.index}`}
                  dir="rtl"
                  lang="ar"
                  className={cn(
                    arabicAnswerClasses,
                    "rounded-2xl bg-slate-50 px-4 py-3",
                    revealed ? "text-slate-950" : "text-slate-400",
                  )}
                >
                  {getAnswerDisplayValue(answer, studyState)}
                </p>

                <ReviewAnswerControls
                  answerIndex={answer.index}
                  status={reviewAnswer?.status ?? "unanswered"}
                  onMarkCorrect={(answerIndex) =>
                    setReviewState((current) =>
                      markReviewAnswerCorrect(current, answerIndex),
                    )
                  }
                  onMarkIncorrect={(answerIndex) =>
                    setReviewState((current) =>
                      markReviewAnswerIncorrect(current, answerIndex),
                    )
                  }
                  onResetAnswer={(answerIndex) =>
                    setReviewState((current) =>
                      resetReviewAnswer(current, answerIndex),
                    )
                  }
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
