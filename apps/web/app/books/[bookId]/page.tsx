import Link from "next/link";
import { Library } from "lucide-react";

import {
  AppPageShell,
  AppStepHeader,
} from "@/components/layout";
import { BookDetails } from "@/components/books";

interface BookDetailsPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { bookId } = await params;

  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Book Library"
        title="Book Details"
        description="Review the book information, verify pending uploads, and open verified books for reading."
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

      <BookDetails
        bookId={bookId}
      />
    </AppPageShell>
  );
}