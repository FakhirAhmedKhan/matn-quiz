"use client";

import { Clock3, FolderOpen, RotateCcw, Trash2 } from "lucide-react";
import { getGeneratedQuizMethodLabel } from "@/lib/quiz/unified-quiz";
import { getMethodAccentClasses } from "@/lib/ui/design-system";
import {
  focusRingClasses,
  interactiveTransitionClasses,
  pressableClasses,
} from "@/lib/ui/accessibility";
import { cn } from "@/lib/utils/cn";
import type { SavedQuizRecord } from "@/lib/quiz/quiz-history";

interface SavedQuizHistoryProps {
  items: SavedQuizRecord[];
  onOpen: (record: SavedQuizRecord) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  disabled?: boolean;
  className?: string;
}

interface SavedQuizHistoryItemProps {
  record: SavedQuizRecord;
  onOpen: (record: SavedQuizRecord) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export function formatSavedQuizDate(value: string): string {
  if (!value || value.length < 16) {
    return "Unknown date";
  }

  return value.slice(0, 16).replace("T", " ");
}

export function getSavedQuizPreview(record: SavedQuizRecord): string {
  const preview = record.quiz.quizText.replace(/\s+/g, " ").trim();

  if (preview.length === 0) {
    return "No preview available.";
  }

  return preview.length > 90 ? `${preview.slice(0, 90)}...` : preview;
}

export function SavedQuizHistoryItem({
  record,
  onOpen,
  onDelete,
  disabled = false,
}: SavedQuizHistoryItemProps) {
  const methodLabel = getGeneratedQuizMethodLabel(record.quiz.method);

  const buttonClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
    focusRingClasses,
    interactiveTransitionClasses,
    pressableClasses,
    "disabled:cursor-not-allowed disabled:opacity-50",
  );

  return (
    <li
      data-testid="saved-quiz-item"
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              data-testid="saved-quiz-method"
              className={cn(
                "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                getMethodAccentClasses(record.quiz.method),
              )}
            >
              {methodLabel}
            </span>

            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              {record.quiz.hiddenCount} hidden
            </span>
          </div>

          <h3
            data-testid="saved-quiz-title"
            className="mt-3 line-clamp-2 text-base font-semibold text-slate-950"
          >
            {record.title}
          </h3>

          <p
            data-testid="saved-quiz-preview"
            dir="rtl"
            lang="ar"
            className="arabic-text mt-3 line-clamp-2 text-right text-lg leading-loose text-slate-700"
          >
            {getSavedQuizPreview(record)}
          </p>

          <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <Clock3 className="h-4 w-4" />
            <time dateTime={record.createdAt}>
              {formatSavedQuizDate(record.createdAt)}
            </time>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onOpen(record)}
            className={cn(
              buttonClasses,
              "bg-emerald-700 text-white hover:bg-emerald-800",
            )}
          >
            <FolderOpen className="h-4 w-4" />
            Open Quiz
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => onDelete(record.id)}
            className={cn(
              buttonClasses,
              "border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50",
            )}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export function SavedQuizHistory({
  items,
  onOpen,
  onDelete,
  onClear,
  disabled = false,
  className,
}: SavedQuizHistoryProps) {
  const hasItems = items.length > 0;

  return (
    <section
      data-testid="saved-quiz-history"
      aria-label="Saved quiz history"
      className={cn("space-y-4", className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Saved Quiz History
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Reopen quizzes saved on this browser.
          </p>
        </div>

        <button
          type="button"
          disabled={disabled || !hasItems}
          onClick={onClear}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50",
            focusRingClasses,
            interactiveTransitionClasses,
            pressableClasses,
          )}
        >
          <RotateCcw className="h-4 w-4" />
          Clear History
        </button>
      </div>

      {!hasItems ? (
        <div
          data-testid="saved-quiz-empty"
          className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center"
        >
          <p className="text-sm font-semibold text-slate-950">
            No saved quizzes yet.
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Generate and save a quiz to see it here.
          </p>
        </div>
      ) : (
        <ol data-testid="saved-quiz-list" className="space-y-3">
          {items.map((record) => (
            <SavedQuizHistoryItem
              key={record.id}
              record={record}
              onOpen={onOpen}
              onDelete={onDelete}
              disabled={disabled}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
