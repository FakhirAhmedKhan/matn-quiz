"use client";

import Link from "next/link";

import { AppPageShell, AppStepHeader } from "@/components/layout";
import {
  GeneratedQuizSection,
  QuizSetupSummarySection,
} from "@/components/page/home";
import usePage from "@/hooks/usePage";

export default function CreateCountPage() {
  const page = usePage();

  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Step 3 of 3"
        title="Set Hide Count"
        description="Choose how many words or lines should be hidden, then generate your study quiz."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/create/method"
              data-testid="create-back-method-link"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Back
            </Link>

            <Link
              href="/study"
              data-testid="create-open-study-link"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-slate-950/20 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Open Study
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        <QuizSetupSummarySection page={page} />
        <GeneratedQuizSection page={page} />
      </div>
    </AppPageShell>
  );
}