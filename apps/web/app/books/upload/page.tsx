import Link from "next/link";

import {
  AppPageShell,
  AppStepHeader,
  ResponsiveCard,
} from "@/components/layout";
import { BookUploadForm } from "@/components/books";

export default function BookUploadPage() {
  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Book Library"
        title="Upload a Book"
        description="Upload a PDF book for the demo library. New books start as pending and can be verified in a later phase."
        action={
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Back Home
          </Link>
        }
      />

      <ResponsiveCard ariaLabel="Book upload">
        <BookUploadForm />
      </ResponsiveCard>
    </AppPageShell>
  );
}