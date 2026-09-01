"use client";

import { CheckCircle2, HelpCircle, RotateCcw, XCircle } from "lucide-react";
import {
  getReviewAnswerStatusLabel,
  type ReviewAnswerStatus,
} from "@/lib/quiz/review-session";
import {
  focusRingClasses,
  interactiveTransitionClasses,
  pressableClasses,
} from "@/lib/ui/accessibility";
import { cn } from "@/lib/utils/cn";

interface ReviewAnswerStatusBadgeProps {
  status: ReviewAnswerStatus;
  className?: string;
}

interface ReviewAnswerControlsProps {
  answerIndex: number;
  status: ReviewAnswerStatus;
  onMarkCorrect: (answerIndex: number) => void;
  onMarkIncorrect: (answerIndex: number) => void;
  onResetAnswer: (answerIndex: number) => void;
  disabled?: boolean;
  className?: string;
}

export function getReviewAnswerStatusClasses(
  status: ReviewAnswerStatus,
): string {
  if (status === "correct") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (status === "incorrect") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

export function ReviewAnswerStatusBadge({
  status,
  className,
}: ReviewAnswerStatusBadgeProps) {
  const label = getReviewAnswerStatusLabel(status);

  return (
    <span
      data-testid="review-answer-status-badge"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        getReviewAnswerStatusClasses(status),
        className,
      )}
    >
      {status === "correct" && <CheckCircle2 className="h-3.5 w-3.5" />}
      {status === "incorrect" && <XCircle className="h-3.5 w-3.5" />}
      {status === "unanswered" && <HelpCircle className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}

export function ReviewAnswerControls({
  answerIndex,
  status,
  onMarkCorrect,
  onMarkIncorrect,
  onResetAnswer,
  disabled = false,
  className,
}: ReviewAnswerControlsProps) {
  const correctSelected = status === "correct";
  const incorrectSelected = status === "incorrect";
  const canReset = status !== "unanswered" && !disabled;

  const baseButtonClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
    focusRingClasses,
    interactiveTransitionClasses,
    pressableClasses,
  );

  return (
    <section
      data-testid="review-answer-controls"
      aria-label={`Review controls for answer ${answerIndex}`}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4",
        className,
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-950">
          Review Answer {answerIndex}
        </p>

        <ReviewAnswerStatusBadge status={status} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-label={`Mark answer ${answerIndex} correct`}
          aria-pressed={correctSelected}
          disabled={disabled}
          onClick={() => onMarkCorrect(answerIndex)}
          className={cn(
            baseButtonClasses,
            correctSelected
              ? "bg-emerald-700 text-white hover:bg-emerald-800"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
          )}
        >
          <CheckCircle2 className="h-4 w-4" />
          Correct
        </button>

        <button
          type="button"
          aria-label={`Mark answer ${answerIndex} incorrect`}
          aria-pressed={incorrectSelected}
          disabled={disabled}
          onClick={() => onMarkIncorrect(answerIndex)}
          className={cn(
            baseButtonClasses,
            incorrectSelected
              ? "bg-red-700 text-white hover:bg-red-800"
              : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
          )}
        >
          <XCircle className="h-4 w-4" />
          Incorrect
        </button>

        <button
          type="button"
          aria-label={`Reset answer ${answerIndex} review`}
          disabled={!canReset}
          onClick={() => onResetAnswer(answerIndex)}
          className={cn(
            baseButtonClasses,
            "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950",
          )}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </section>
  );
}
