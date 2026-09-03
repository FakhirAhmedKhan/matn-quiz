"use client";

import {
  CheckCircle2,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import {
  getQuizReviewCompletionText,
  getQuizReviewProgress,
  getQuizReviewProgressSummary,
  getQuizReviewScoreText,
  type QuizReviewState,
} from "@/lib/quiz/review-session";
import {
  focusRingClasses,
  interactiveTransitionClasses,
  pressableClasses,
} from "@/lib/ui/accessibility";
import { getProgressBarWidth } from "@/lib/ui/design-system";
import { cn } from "@/lib/utils/cn";

interface ReviewProgressSummaryProps {
  state: QuizReviewState;
  onResetReview?: () => void;
  className?: string;
}

interface ReviewProgressMetricProps {
  label: string;
  value: string | number;
  description?: string;
  tone?: "default" | "success" | "danger" | "warning";
  icon?: "target" | "correct" | "incorrect" | "accuracy";
}

export function getReviewAccuracyTone(
  accuracyPercentage: number,
): "default" | "success" | "warning" | "danger" {
  if (accuracyPercentage >= 80) {
    return "success";
  }

  if (accuracyPercentage >= 50) {
    return "warning";
  }

  if (accuracyPercentage > 0) {
    return "danger";
  }

  return "default";
}

export function getReviewProgressStatusLabel(complete: boolean): string {
  return complete ? "Review complete" : "Review in progress";
}

function getMetricToneClasses(
  tone: ReviewProgressMetricProps["tone"] = "default",
): string {
  if (tone === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }

  if (tone === "danger") {
    return "border-red-200 bg-red-50 text-red-800";
  }

  if (tone === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  return "border-slate-200 bg-slate-50 text-slate-900";
}

function ReviewProgressMetric({
  label,
  value,
  description,
  tone = "default",
  icon = "target",
}: ReviewProgressMetricProps) {
  return (
    <div
      data-testid="review-progress-metric"
      className={cn(
        "rounded-2xl border p-4",
        getMetricToneClasses(tone),
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon === "target" && <Target className="h-4 w-4" />}
        {icon === "correct" && <CheckCircle2 className="h-4 w-4" />}
        {icon === "incorrect" && <XCircle className="h-4 w-4" />}
        {icon === "accuracy" && <Trophy className="h-4 w-4" />}
        {label}
      </div>

      <p
        data-testid={`review-progress-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="mt-2 text-3xl font-bold"
      >
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs opacity-80">
          {description}
        </p>
      )}
    </div>
  );
}

export function ReviewProgressSummary({
  state,
  onResetReview,
  className,
}: ReviewProgressSummaryProps) {
  const progress = getQuizReviewProgress(state);
  const statusLabel = getReviewProgressStatusLabel(progress.complete);
  const canReset = progress.reviewed > 0;

  return (
    <section
      data-testid="review-progress-summary"
      aria-label="Review progress summary"
      className={cn(
        "space-y-5 rounded-2xl border border-slate-200 bg-white p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">
            Review Progress
          </h3>

          <p
            data-testid="review-progress-summary-text"
            className="mt-1 text-sm leading-6 text-slate-600"
          >
            {getQuizReviewProgressSummary(state)}
          </p>
        </div>

        <span
          data-testid="review-progress-status"
          className={cn(
            "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold",
            progress.complete
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-slate-200 bg-slate-50 text-slate-600",
          )}
        >
          {statusLabel}
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <p
            data-testid="review-completion-text"
            className="font-medium text-slate-700"
          >
            {getQuizReviewCompletionText(state)}
          </p>

          <p
            data-testid="review-percentage-text"
            className="font-semibold text-slate-950"
          >
            {progress.reviewPercentage}%
          </p>
        </div>

        <div
          role="progressbar"
          aria-label="Review completion progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.reviewPercentage}
          aria-valuetext={`${progress.reviewPercentage} percent reviewed`}
          data-testid="review-progress-bar"
          className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200"
        >
          <div
            data-testid="review-progress-bar-fill"
            className="h-full rounded-full bg-emerald-700 transition-all"
            style={{ width: getProgressBarWidth(progress.reviewPercentage) }}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReviewProgressMetric
          label="Reviewed"
          value={`${progress.reviewed}/${progress.total}`}
          description="Answers checked"
          icon="target"
        />

        <ReviewProgressMetric
          label="Correct"
          value={progress.correct}
          description="Marked correct"
          tone="success"
          icon="correct"
        />

        <ReviewProgressMetric
          label="Incorrect"
          value={progress.incorrect}
          description="Marked incorrect"
          tone="danger"
          icon="incorrect"
        />

        <ReviewProgressMetric
          label="Accuracy"
          value={`${progress.accuracyPercentage}%`}
          description={getQuizReviewScoreText(state)}
          tone={getReviewAccuracyTone(progress.accuracyPercentage)}
          icon="accuracy"
        />
      </div>

      {onResetReview && (
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Reset review progress"
            disabled={!canReset}
            onClick={onResetReview}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50",
              focusRingClasses,
              interactiveTransitionClasses,
              pressableClasses,
            )}
          >
            <RotateCcw className="h-4 w-4" />
            Reset Review
          </button>
        </div>
      )}
    </section>
  );
}
