"use client";

import { BookOpenCheck, RotateCcw, Trash2 } from "lucide-react";
import {
  getPersistedStudySessionProgressSummary,
  getPersistedStudySessionSavedAtLabel,
  hasPersistedStudySessionProgress,
  type PersistedStudySessionDocument,
} from "@/lib/quiz/study-session-persistence";
import {
  focusRingClasses,
  interactiveTransitionClasses,
  pressableClasses,
} from "@/lib/ui/accessibility";
import { cn } from "@/lib/utils/cn";

interface StudySessionResumePanelProps {
  document: PersistedStudySessionDocument | null;
  onResume: (document: PersistedStudySessionDocument) => void;
  onClear: () => void;
  className?: string;
}

export function StudySessionResumePanel({
  document,
  onResume,
  onClear,
  className,
}: StudySessionResumePanelProps) {
  const hasSession = Boolean(document);
  const hasProgress = document ? hasPersistedStudySessionProgress(document) : false;

  const buttonClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
    focusRingClasses,
    interactiveTransitionClasses,
    pressableClasses,
  );

  return (
    <section
      data-testid="study-session-resume-panel"
      aria-label="Resume saved study session"
      className={cn("space-y-4", className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Resume Study Session
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Continue your last unfinished quiz review from this browser.
          </p>
        </div>

        <span
          data-testid="study-session-resume-state"
          className={cn(
            "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold",
            hasSession
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-slate-200 bg-slate-50 text-slate-600",
          )}
        >
          {hasSession ? "Session found" : "No session"}
        </span>
      </div>

      {document ? (
        <div
          data-testid="study-session-resume-card"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
        >
          <div className="flex items-start gap-3">
            <BookOpenCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

            <div className="min-w-0 flex-1">
              <p
                data-testid="study-session-resume-summary"
                className="text-sm font-semibold text-emerald-900"
              >
                {getPersistedStudySessionProgressSummary(document)}
              </p>

              <p
                data-testid="study-session-resume-saved-at"
                className="mt-1 text-sm text-emerald-800"
              >
                Saved at {getPersistedStudySessionSavedAtLabel(document)}
              </p>

              <p
                data-testid="study-session-resume-progress-state"
                className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-700"
              >
                {hasProgress ? "Progress available" : "No progress yet"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onResume(document)}
              className={cn(
                buttonClasses,
                "bg-emerald-700 text-white hover:bg-emerald-800",
              )}
            >
              <RotateCcw className="h-4 w-4" />
              Resume Session
            </button>

            <button
              type="button"
              onClick={onClear}
              className={cn(
                buttonClasses,
                "border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50",
              )}
            >
              <Trash2 className="h-4 w-4" />
              Clear Session
            </button>
          </div>
        </div>
      ) : (
        <div
          data-testid="study-session-resume-empty"
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
        >
          No unfinished study session is saved in this browser.
        </div>
      )}
    </section>
  );
}
