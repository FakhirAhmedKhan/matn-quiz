"use client";

import type { HomePageState } from "./types";

interface HistoryStatusSectionProps {
  page: HomePageState;
}

export function HistoryStatusSection({ page }: HistoryStatusSectionProps) {
  if (!page.historyStatus) {
    return null;
  }

  return (
    <div
      data-testid="history-status"
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
    >
      {page.historyStatus}
    </div>
  );
}
