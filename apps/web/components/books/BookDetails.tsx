"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Languages,
  Tag,
  UserRound,
} from "lucide-react";

import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

import { BookVerificationButton } from "./BookVerificationButton";

export interface BookDetailsProps {
  bookId: string;
}

interface BookDetailResponse {
  ok: boolean;
  error?: string;
  book?: BookRecord;
}

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "Not verified yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      dateStyle: "medium",
    },
  ).format(date);
}

export function BookDetails({
  bookId,
}: BookDetailsProps) {
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
        data-testid="book-details-loading"
        className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

        <p className="mt-4 font-semibold text-slate-600">
          Loading book...
        </p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div
        data-testid="book-details-error"
        role="alert"
        className="rounded-3xl border border-rose-200 bg-rose-50 p-6"
      >
        <p className="font-bold text-rose-800">
          Book could not be loaded.
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

  const verified =
    book.status ===
    BOOK_STATUSES.VERIFIED;

  return (
    <article
      data-testid="book-details"
      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.5fr)]">
        <div className="bg-gradient-to-br from-emerald-50 via-white to-slate-100 p-6 sm:p-8">
          <div className="mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="rounded-3xl bg-emerald-100 p-5 text-emerald-700">
                  <BookOpen
                    aria-hidden="true"
                    className="h-10 w-10"
                  />
                </div>

                <p className="text-sm font-bold text-slate-500">
                  No cover uploaded
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span
              data-testid="book-status"
              className={
                verified
                  ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-700"
                  : "inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-700"
              }
            >
              {verified ? (
                <CheckCircle2
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
              ) : (
                <Clock3
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
              )}

              {book.status}
            </span>

            {book.category ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                <Tag
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
                {book.category}
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {book.title}
          </h1>

          <p className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-slate-600">
            <UserRound
              aria-hidden="true"
              className="h-4 w-4"
            />
            {book.author}
          </p>

          {book.description ? (
            <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-600 sm:text-base">
              {book.description}
            </p>
          ) : (
            <p className="mt-6 text-sm italic text-slate-400">
              No description was provided.
            </p>
          )}

          <dl className="mt-8 grid gap-4 rounded-3xl bg-slate-50 p-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                Language
              </dt>
              <dd className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-700">
                <Languages
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                {book.language ??
                  "Not specified"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                Uploaded
              </dt>
              <dd className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-700">
                <CalendarDays
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                {formatDate(
                  book.createdAt,
                )}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                Verification
              </dt>
              <dd className="mt-1 text-sm font-bold text-slate-700">
                {formatDate(
                  book.verifiedAt,
                )}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                File
              </dt>
              <dd className="mt-1 truncate text-sm font-bold text-slate-700">
                {book.fileName ??
                  "PDF document"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {verified ? (
              <Link
                href={`/books/${book.id}/read`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <BookOpen
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                Read Book
              </Link>
            ) : (
              <BookVerificationButton
                bookId={book.id}
                onVerified={(verifiedBook) => {
                  setBook(verifiedBook);
                }}
              />
            )}

            <Link
              href="/books"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-4 w-4"
              />
              Back to Library
            </Link>
          </div>

          {!verified ? (
            <p
              data-testid="book-pending-note"
              className="mt-4 text-xs leading-5 text-amber-700"
            >
              MVP moderation mode: clicking Verify Book immediately publishes this book to the public library.
            </p>
          ) : (
            <p
              data-testid="book-verified-note"
              className="mt-4 text-xs leading-5 text-emerald-700"
            >
              This book is verified and is now eligible to appear in the public library.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}