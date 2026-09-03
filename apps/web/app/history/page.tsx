"use client";

import Link from "next/link";

import { AppPageShell, AppStepHeader } from "@/components/layout";
import {
  HistoryStatusSection,
  SavedHistorySection,
} from "@/components/page/home";
import usePage from "@/hooks/usePage";

export default function HistoryPage() {
  const page = usePage();

  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="History"
        title="Saved Quiz History"
        description="Open previous quizzes, continue studying, delete old items, or clear your saved quiz history."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/create"
              data-testid="history-create-link"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Create Quiz
            </Link>

            <Link
              href="/study"
              data-testid="history-study-link"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-slate-950/20 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Study
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        <HistoryStatusSection page={page} />
        <SavedHistorySection page={page} />
      </div>
    </AppPageShell>
  );
}