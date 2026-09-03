"use client";

import Link from "next/link";

import { AppPageShell, AppStepHeader, ResponsiveCard } from "@/components/layout";

export default function PoemPage() {
  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Poem Reader"
        title="Poem / Nazm Setup"
        description="Paste an Urdu or Arabic poem, choose a reading layout, and open it in a clean reader."
        action={
          <Link
            href="/poem/read"
            data-testid="poem-open-reader-link"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Open Reader
          </Link>
        }
      />

      <ResponsiveCard ariaLabel="Poem setup placeholder">
        <h2 className="text-xl font-bold tracking-tight text-slate-950">
          Poem input coming next
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          P1 and P2 added navigation and storage. The input form will be added in P3.
        </p>
      </ResponsiveCard>
    </AppPageShell>
  );
}