import Link from "next/link";
import { Upload } from "lucide-react";

import {
  AppPageShell,
  AppStepHeader,
} from "@/components/layout";
import { BookLibrary } from "@/components/books";

export default function BooksPage() {
  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Book Library"
        title="Public Books"
        description="Browse books that have been verified and made available for public reading."
        action={
          <Link
            href="/books/upload"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <Upload
              aria-hidden="true"
              className="h-4 w-4"
            />
            Upload Book
          </Link>
        }
      />

      <BookLibrary />
    </AppPageShell>
  );
}