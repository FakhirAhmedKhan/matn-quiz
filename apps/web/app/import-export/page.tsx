"use client";

import Link from "next/link";

import { AppPageShell, AppStepHeader } from "@/components/layout";
import { ShareableQuizSection } from "@/components/page/home";
import usePage from "@/hooks/usePage";

export default function ImportExportPage() {
  const page = usePage();

  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Share"
        title="Import / Export"
        description="Export your quiz as shareable JSON, or import a saved quiz to continue studying."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/study"
              data-testid="import-export-back-study-link"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Back to Study
            </Link>

            <Link
              href="/history"
              data-testid="import-export-history-link"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-slate-950/20 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              History
            </Link>
          </div>
        }
      />

      <ShareableQuizSection page={page} />
    </AppPageShell>
  );
}