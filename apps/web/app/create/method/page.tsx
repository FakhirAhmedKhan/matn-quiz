"use client";

import Link from "next/link";

import { AppPageShell, AppStepHeader } from "@/components/layout";
import { QuizOptionsSection } from "@/components/page/home";
import usePage from "@/hooks/usePage";

export default function CreateMethodPage() {
  const page = usePage();

  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Step 2 of 3"
        title="Choose Quiz Method"
        description="Decide whether the quiz should hide individual words or complete lines."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/create"
              data-testid="create-back-text-link"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Back
            </Link>

            <Link
              href="/create/count"
              data-testid="create-next-count-link"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Continue
            </Link>
          </div>
        }
      />

      <QuizOptionsSection page={page} />
    </AppPageShell>
  );
}