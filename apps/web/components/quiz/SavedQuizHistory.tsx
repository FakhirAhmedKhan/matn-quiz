"use client";

import Link from "next/link";
import { Clock3, FolderOpen, Trash2 } from "lucide-react";
import { EmptyStatePanel } from "@/components/ui/FeedbackStatePanel";
import { getGeneratedQuizMethodLabel } from "@/lib/quiz/unified-quiz";
import type { SavedQuizRecord } from "@/lib/quiz/quiz-history";
import {
  focusRingClasses,
  interactiveTransitionClasses,
  pressableClasses,
} from "@/lib/ui/accessibility";
import { getMethodAccentClasses } from "@/lib/ui/design-system";
import { cn } from "@/lib/utils/cn";

interface SavedQuizHistoryProps {
  items: SavedQuizRecord[];
  onOpen: (record: SavedQuizRecord) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  openHref?: string;
  disabled?: boolean;
  className?: string;
}

interface SavedQuizHistoryItemProps {
  record: SavedQuizRecord;
  onOpen: (record: SavedQuizRecord) => void;
  onDelete: (id: string) => void;
  openHref?: string;
  disabled?: boolean;
}

export function formatSavedQuizDate(value: string): string {
  if (!value || Number.isNaN(Date.parse(value))) {
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
  openHref,
  disabled = false,
}: SavedQuizHistoryItemProps) {
  const methodLabel = getGeneratedQuizMethodLabel(record.quiz.method);

  const buttonClasses = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
    focusRingClasses,
    interactiveTransitionClasses,
    pressableClasses,
  );

  const openClasses = cn(
    buttonClasses,
    "bg-emerald-700 text-white hover:bg-emerald-800",
  );

  return (
    <li
      data-testid="saved-quiz-item"
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <span
            data-testid="saved-quiz-method"
            className={cn(
              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
              getMethodAccentClasses(record.quiz.method),
            )}
          >
            {methodLabel}
          </span>

          <h3
            data-testid="saved-quiz-title"
            className="mt-3 text-base font-semibold text-slate-950"
          >
            {record.title}
          </h3>

          <p
            data-testid="saved-quiz-preview"
            dir="rtl"
            lang="ar"
            className="mt-2 text-right text-sm leading-7 text-slate-600"
          >
            {getSavedQuizPreview(record)}
          </p>

          <p className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500">
            <Clock3 className="h-3.5 w-3.5" />
            {formatSavedQuizDate(record.updatedAt)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {disabled || !openHref ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onOpen(record)}
              className={openClasses}
            >
              <FolderOpen className="h-4 w-4" />
              Open Quiz
            </button>
          ) : (
            <Link
              href={openHref}
              role="button"
              onClick={() => onOpen(record)}
              className={openClasses}
            >
              <FolderOpen className="h-4 w-4" />
              Open Quiz
            </Link>
          )}

          <button
            type="button"
            disabled={disabled}
            aria-label={`Delete saved quiz ${record.title}`}
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
  openHref,
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
            Reopen, review, or delete quizzes saved in this browser.
          </p>
        </div>

        <button
          type="button"
          disabled={!hasItems || disabled}
          onClick={onClear}
          className={cn(
            "inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50",
            focusRingClasses,
            interactiveTransitionClasses,
            pressableClasses,
          )}
        >
          <Trash2 className="h-4 w-4" />
          Clear History
        </button>
      </div>

      {hasItems ? (
        <ol data-testid="saved-quiz-list" className="space-y-3">
          {items.map((record) => (
            <SavedQuizHistoryItem
              key={record.id}
              record={record}
              onOpen={onOpen}
              onDelete={onDelete}
              openHref={openHref}
              disabled={disabled}
            />
          ))}
        </ol>
      ) : (
        <div data-testid="saved-quiz-empty">
          <EmptyStatePanel
            compact
            title="No saved quizzes yet."
            description="Generate a quiz and use Save Quiz to keep it here for later."
          />
        </div>
      )}
    </section>
  );
}