"use client";

import Link from "next/link";

import { AppPageShell, AppStepHeader, ResponsiveCard } from "@/components/layout";

export default function PoemReadPage() {
  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Poem Reader"
        title="Read Poem"
        description="A two-column poem reader will be added here in the next phase."
        action={
          <Link
            href="/poem"
            data-testid="poem-back-setup-link"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Back to Setup
          </Link>
        }
      />

      <ResponsiveCard ariaLabel="Poem reader placeholder">
        <h2 className="text-xl font-bold tracking-tight text-slate-950">
          Reader layout coming next
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          P4 will render the poem like a page with right and left columns.
        </p>
      </ResponsiveCard>
    </AppPageShell>
  );
}