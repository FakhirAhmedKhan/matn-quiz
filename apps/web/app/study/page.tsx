"use client";

import Link from "next/link";

import { AppPageShell, AppStepHeader } from "@/components/layout";
import {
  GeneratedQuizSection,
  ResumeStudySection,
} from "@/components/page/home";
import usePage from "@/hooks/usePage";

export default function StudyPage() {
  const page = usePage();

  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Study"
        title="Question & Answer"
        description="Review your generated quiz, reveal answers safely, mark progress, and listen only to visible Arabic text."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/create/count"
              data-testid="study-back-create-link"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Back to Setup
            </Link>

            <Link
              href="/history"
              data-testid="study-open-history-link"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-slate-950/20 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              History
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        <ResumeStudySection page={page} />
        <GeneratedQuizSection page={page} />
      </div>
    </AppPageShell>
  );
}