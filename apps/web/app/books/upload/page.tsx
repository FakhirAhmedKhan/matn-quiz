import Link from "next/link";
import { Library } from "lucide-react";

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
        description="Upload a PDF book for the demo library. New books start as pending and must be verified before appearing publicly."
        action={
          <Link
            href="/books"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Library
              aria-hidden="true"
              className="h-4 w-4"
            />
            Public Library
          </Link>
        }
      />

      <ResponsiveCard ariaLabel="Book upload">
        <BookUploadForm />
      </ResponsiveCard>
    </AppPageShell>
  );
}