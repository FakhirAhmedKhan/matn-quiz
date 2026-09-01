"use client";

import { Copy, Download, RotateCcw } from "lucide-react";
import { useState } from "react";
import {
  copyTextToClipboard,
  exportQuizAsTextFile,
  formatGeneratedQuizAnswers,
  formatGeneratedQuizAsText,
} from "@/lib/quiz/quiz-export";
import { cn } from "@/lib/utils/cn";
import type { GeneratedQuiz } from "@/types/quiz";

interface QuizActionBarProps {
  quiz: GeneratedQuiz;
  onResetQuiz: () => void;
  className?: string;
}

type ActionStatus =
  | "idle"
  | "copied-quiz"
  | "copied-answers"
  | "copy-failed"
  | "exported";

export function QuizActionBar({
  quiz,
  onResetQuiz,
  className,
}: QuizActionBarProps) {
  const [status, setStatus] = useState<ActionStatus>("idle");

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
    "copied-quiz": "Quiz copied.",
    "copied-answers": "Answers copied.",
    "copy-failed": "Copy is not available in this browser.",
    exported: "Text file exported.",
  }[status];

  return (
    <section
      data-testid="quiz-action-bar"
      className={cn("rounded-2xl border border-slate-200 bg-white p-4", className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-950">Quiz Actions</p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopyQuiz}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <Copy className="h-4 w-4" />
            Copy Quiz
          </button>

          <button
            type="button"
            onClick={handleCopyAnswers}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <Copy className="h-4 w-4" />
            Copy Answers
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <Download className="h-4 w-4" />
            Export TXT
          </button>

          <button
            type="button"
            onClick={onResetQuiz}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Quiz
          </button>
        </div>
      </div>

      {statusText && (
        <p
          data-testid="quiz-action-status"
          className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600"
        >
          {statusText}
        </p>
      )}
    </section>
  );
}
