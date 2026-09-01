"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { StudyProgress } from "@/lib/quiz/study-session";

interface AnswerRevealControlsProps {
  progress: StudyProgress;
  onRevealAll: () => void;
  onHideAll: () => void;
  onReset: () => void;
  disabled?: boolean;
  className?: string;
}

interface AnswerRevealToggleProps {
  answerIndex: number;
  revealed: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

export function AnswerRevealToggle({
  answerIndex,
  revealed,
  onToggle,
  disabled = false,
  className,
}: AnswerRevealToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={revealed}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      {revealed ? `Hide Answer ${answerIndex}` : `Reveal Answer ${answerIndex}`}
    </button>
  );
}

export function AnswerRevealControls({
  progress,
  onRevealAll,
  onHideAll,
  onReset,
  disabled = false,
  className,
}: AnswerRevealControlsProps) {
  const isDisabled = disabled || progress.total === 0;

  return (
    <section
      data-testid="answer-reveal-controls"
      className={cn("rounded-2xl border border-slate-200 bg-slate-50 p-4", className)}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Study Progress</p>

          <p data-testid="study-progress-text" className="mt-1 text-sm text-slate-600">
            {progress.revealed} of {progress.total} answers revealed · {progress.percentage}%
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isDisabled || progress.complete}
            onClick={onRevealAll}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
            Reveal All Answers
          </button>

          <button
            type="button"
            disabled={isDisabled || progress.revealed === 0}
            onClick={onHideAll}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <EyeOff className="h-4 w-4" />
            Hide All Answers
          </button>

          <button
            type="button"
            disabled={isDisabled || progress.revealed === 0}
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Study
          </button>
        </div>
      </div>
    </section>
  );
}
