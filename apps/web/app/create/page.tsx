"use client";

import Link from "next/link";

import { AppPageShell, AppStepHeader } from "@/components/layout";
import { QuranTextSection } from "@/components/page/home";
import usePage from "@/hooks/usePage";

export default function CreateTextPage() {
  const page = usePage();

  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Step 1 of 3"
        title="Paste Arabic Text"
        description="Start by adding the Quran, hadith, or matn text you want to memorize."
        action={
          <Link
            href="/create/method"
            data-testid="create-next-method-link"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Continue
          </Link>
        }
      />

      <div className="space-y-6">
        <QuranTextSection page={page} />
      </div>
    </AppPageShell>
  );
}