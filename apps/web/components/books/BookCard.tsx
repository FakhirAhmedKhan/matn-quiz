import Link from "next/link";
import { BookOpen, Languages } from "lucide-react";

import type { BookRecord } from "@/lib/books/book-types";

export interface BookCardProps {
  book: BookRecord;
}

export function BookCard({
  book,
}: BookCardProps) {
  return (
    <article
      data-testid="book-card"
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-slate-100">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-slate-500">
            <div className="rounded-2xl bg-emerald-100 p-4 text-emerald-700">
              <BookOpen
                aria-hidden="true"
                className="h-8 w-8"
              />
            </div>

            <p className="text-sm font-semibold">
              No cover uploaded
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h2 className="line-clamp-2 text-lg font-extrabold tracking-tight text-slate-950">
            {book.title}
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-600">
            {book.author}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {book.category ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {book.category}
            </span>
          ) : null}

          {book.language ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              <Languages
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />
              {book.language}
            </span>
          ) : null}
        </div>

        <Link
          href={`/books/${book.id}`}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          View Book
        </Link>
      </div>
    </article>
  );
}