"use client";

import { Copy, Download, RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import {
  copyTextToClipboard,
  exportQuizAsTextFile,
  formatGeneratedQuizAnswers,
  formatGeneratedQuizAsText,
} from "@/lib/quiz/quiz-export";
import {
  focusRingClasses,
  getActionStatusAnnouncement,
  interactiveTransitionClasses,
  pressableClasses,
} from "@/lib/ui/accessibility";
import { cn } from "@/lib/utils/cn";
import type { GeneratedQuiz } from "@/types/quiz";

interface QuizActionBarProps {
  quiz: GeneratedQuiz;
  onResetQuiz: () => void;
  onSaveQuiz?: () => void;
  className?: string;
}

type ActionStatus =
  | "idle"
  | "saved"
  | "copied-quiz"
  | "copied-answers"
  | "copy-failed"
  | "exported";

export function QuizActionBar({
  quiz,
  onResetQuiz,
  onSaveQuiz,
  className,
}: QuizActionBarProps) {
  const [status, setStatus] = useState<ActionStatus>("idle");

  const handleSaveQuiz = () => {
    onSaveQuiz?.();
    setStatus("saved");
  };

  const handleCopyQuiz = async () => {
    const copied = await copyTextToClipboard(formatGeneratedQuizAsText(quiz));
    setStatus(copied ? "copied-quiz" : "copy-failed");
  };

  const handleCopyAnswers = async () => {
    const copied = await copyTextToClipboard(formatGeneratedQuizAnswers(quiz));
    setStatus(copied ? "copied-answers" : "copy-failed");
  };

  const handleExport = () => {
    exportQuizAsTextFile(quiz);
    setStatus("exported");
  };

  const statusText = {
    idle: "",
    saved: "Quiz saved.",
    "copied-quiz": "Quiz copied.",
    "copied-answers": "Answers copied.",
    "copy-failed": "Copy is not available in this browser.",
    exported: "Text file exported.",
  }[status];

  const actionButtonClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-700",
    focusRingClasses,
    interactiveTransitionClasses,
    pressableClasses,
  );

  return (
    <section
      data-testid="quiz-action-bar"
      aria-label="Quiz actions"
      className={cn("rounded-2xl border border-slate-200 bg-white p-4", className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-950">Quiz Actions</p>

        <div className="flex flex-wrap gap-2">
          {onSaveQuiz && (
            <button
              type="button"
              aria-label="Save Quiz"
              onClick={handleSaveQuiz}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800",
                focusRingClasses,
                interactiveTransitionClasses,
                pressableClasses,
              )}
            >
              <Save className="h-4 w-4" />
              Save Quiz
            </button>
          )}

          <button
            type="button"
            aria-label="Copy Quiz"
            onClick={handleCopyQuiz}
            className={actionButtonClasses}
          >
            <Copy className="h-4 w-4" />
            Copy Quiz
          </button>

          <button
            type="button"
            aria-label="Copy Answers"
            onClick={handleCopyAnswers}
            className={actionButtonClasses}
          >
            <Copy className="h-4 w-4" />
            Copy Answers
          </button>

          <button
            type="button"
            aria-label="Export TXT"
            onClick={handleExport}
            className={actionButtonClasses}
          >
            <Download className="h-4 w-4" />
            Export TXT
          </button>

          <button
            type="button"
            aria-label="Reset Quiz"
            onClick={onResetQuiz}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800",
              focusRingClasses,
              interactiveTransitionClasses,
              pressableClasses,
            )}
          >
            <RotateCcw className="h-4 w-4" />
            Reset Quiz
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {getActionStatusAnnouncement(statusText)}
      </p>

      {statusText && (
        <p
          data-testid="quiz-action-status"
          role="status"
          aria-live="polite"
          className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600"
        >
          {statusText}
        </p>
      )}
    </section>
  );
}
