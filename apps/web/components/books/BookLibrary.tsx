"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, RefreshCw, Upload } from "lucide-react";

import type { BookRecord } from "@/lib/books/book-types";

import { BookGrid } from "./BookGrid";

interface PublicBooksResponse {
  ok: boolean;
  books?: BookRecord[];
  error?: string;
}

export function BookLibrary() {
  const [books, setBooks] =
    useState<BookRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadBooks() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/books",
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data =
        (await response.json()) as PublicBooksResponse;

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error ??
            "Unable to load books.",
        );
      }

      setBooks(data.books ?? []);
    } catch (loadError) {
      setBooks([]);

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load books.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBooks();
  }, []);

  if (loading) {
    return (
      <div
        data-testid="book-library-loading"
        className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

        <p className="mt-4 font-semibold text-slate-600">
          Loading verified books...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-testid="book-library-error"
        role="alert"
        className="rounded-3xl border border-rose-200 bg-rose-50 p-6"
      >
        <p className="font-bold text-rose-800">
          Could not load the library.
        </p>

        <p className="mt-2 text-sm text-rose-700">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            void loadBooks();
          }}
          className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-800"
        >
          <RefreshCw
            aria-hidden="true"
            className="h-4 w-4"
          />
          Try Again
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div
        data-testid="book-library-empty"
        className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <BookOpen
            aria-hidden="true"
            className="h-7 w-7"
          />
        </div>

        <h2 className="mt-5 text-xl font-extrabold text-slate-950">
          No verified books yet
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
          Books appear in this public library after they are verified.
          Verification will be added in the next phase.
        </p>

        <Link
          href="/books/upload"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
        >
          <Upload
            aria-hidden="true"
            className="h-4 w-4"
          />
          Upload a Book
        </Link>
      </div>
    );
  }

  return (
    <BookGrid books={books} />
  );
}