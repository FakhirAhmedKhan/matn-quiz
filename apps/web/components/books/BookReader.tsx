"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

export interface BookReaderProps {
  bookId: string;
}

interface BookDetailResponse {
  ok: boolean;
  error?: string;
  book?: BookRecord;
}

export function BookReader({
  bookId,
}: BookReaderProps) {
  const [book, setBook] =
    useState<BookRecord | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBook() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/books/${bookId}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data =
          (await response.json()) as BookDetailResponse;

        if (
          !response.ok ||
          !data.ok ||
          !data.book
        ) {
          throw new Error(
            data.error ??
              "Unable to load book.",
          );
        }

        if (!cancelled) {
          setBook(data.book);
        }
      } catch (loadError) {
        if (!cancelled) {
          setBook(null);

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load book.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBook();

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  if (loading) {
    return (
      <div
        data-testid="book-reader-loading"
        className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm"
      >
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

        <p className="mt-4 font-semibold text-slate-600">
          Opening book...
        </p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div
        data-testid="book-reader-error"
        role="alert"
        className="rounded-3xl border border-rose-200 bg-rose-50 p-6"
      >
        <p className="font-bold text-rose-800">
          Book could not be opened.
        </p>

        <p className="mt-2 text-sm text-rose-700">
          {error ?? "Book not found."}
        </p>

        <Link
          href="/books"
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white"
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-4 w-4"
          />
          Back to Library
        </Link>
      </div>
    );
  }

  if (
    book.status !==
    BOOK_STATUSES.VERIFIED
  ) {
    return (
      <div
        data-testid="book-reader-unverified"
        className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
            <ShieldAlert
              aria-hidden="true"
              className="h-6 w-6"
            />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-950">
              Verification required
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              This book is still pending. Verify it from the book details page before opening the public reader.
            </p>

            <Link
              href={`/books/${book.id}`}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-amber-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-800"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-4 w-4"
              />
              Back to Book Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      data-testid="book-reader"
      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-emerald-700">
            <BookOpen
              aria-hidden="true"
              className="h-4 w-4"
            />

            <span className="text-xs font-extrabold uppercase tracking-[0.14em]">
              PDF Reader
            </span>
          </div>

          <h2 className="mt-1 truncate text-lg font-extrabold text-slate-950">
            {book.title}
          </h2>

          <p className="truncate text-sm text-slate-500">
            {book.author}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/books/${book.id}`}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft
              aria-hidden="true"
              className="h-4 w-4"
            />
            Book Details
          </Link>

          <a
            href={book.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            <ExternalLink
              aria-hidden="true"
              className="h-4 w-4"
            />
            Open PDF
          </a>
        </div>
      </div>

      <div className="bg-slate-100 p-2 sm:p-3">
        <iframe
          data-testid="book-pdf-frame"
          src={book.fileUrl}
          title={`${book.title} PDF reader`}
          className="h-[72vh] min-h-[560px] w-full rounded-2xl border border-slate-300 bg-white sm:h-[78vh]"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
}