import Link from "next/link";
import { Library } from "lucide-react";

import {
  AppPageShell,
  AppStepHeader,
} from "@/components/layout";
import { BookReader } from "@/components/books";

interface BookReaderPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

export default async function BookReaderPage({
  params,
}: BookReaderPageProps) {
  const { bookId } = await params;

  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Book Library"
        title="Read Book"
        description="Read the verified PDF directly in your browser."
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

      <BookReader
        bookId={bookId}
      />
    </AppPageShell>
  );
}