$ErrorActionPreference = "Continue"

Write-Host "=== BOOK LIBRARY B4 - BOOK DETAILS + VERIFY FLOW ===" -ForegroundColor Cyan

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$ok = $true

function Write-NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [AllowEmptyString()]
        [Parameter(Mandatory = $true)][string]$Content
    )

    $fullPath = Join-Path (Get-Location) $Path
    $dir = Split-Path $fullPath -Parent

    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force $dir | Out-Null
    }

    [System.IO.File]::WriteAllText(
        $fullPath,
        $Content,
        $utf8NoBom
    )
}

$requiredFiles = @(
    "apps\web\lib\books\book-types.ts",
    "apps\web\lib\books\book-repository.ts",
    "apps\web\lib\books\demo-book-repository.ts",
    "apps\web\lib\books\book-repository-provider.ts",
    "apps\web\app\api\books\route.ts",
    "apps\web\app\books\page.tsx",
    "apps\web\components\books\BookCard.tsx",
    "apps\web\components\books\BookGrid.tsx",
    "apps\web\components\books\BookLibrary.tsx",
    "apps\web\components\books\BookUploadForm.tsx"
)

foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        Write-Host "MISSING REQUIRED FILE: $file" -ForegroundColor Red
        $ok = $false
    }
}

if (!$ok) {
    Write-Host ""
    Write-Host "B4 cannot start because B1/B2/B3 files are missing." -ForegroundColor Red
    Write-Host "Run the earlier phase first, then rerun B4." -ForegroundColor Yellow
    Read-Host "Press Enter to close"
    return
}

Write-Host ""
Write-Host "Creating book detail API..." -ForegroundColor Yellow

Write-NoBom "apps\web\app\api\books\[bookId]\route.ts" @'
import { NextResponse } from "next/server";

import { getBookRepository } from "@/lib/books/book-repository-provider";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    bookId: string;
  }>;
}

function errorResponse(
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
    },
    {
      status,
    },
  );
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { bookId } = await context.params;

    if (!bookId.trim()) {
      return errorResponse(
        "Book id is required.",
        400,
      );
    }

    const repository =
      getBookRepository();

    const book =
      await repository.findById(bookId);

    if (!book) {
      return errorResponse(
        "Book not found.",
        404,
      );
    }

    return NextResponse.json(
      {
        ok: true,
        book,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "[book-detail] Failed to load book:",
      error,
    );

    return errorResponse(
      "Unable to load the book.",
      500,
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { bookId } = await context.params;

    if (!bookId.trim()) {
      return errorResponse(
        "Book id is required.",
        400,
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse(
        "Invalid request body.",
        400,
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("action" in body) ||
      body.action !== "verify"
    ) {
      return errorResponse(
        'Verification request must use action "verify".',
        400,
      );
    }

    const repository =
      getBookRepository();

    const book =
      await repository.verify(bookId);

    if (!book) {
      return errorResponse(
        "Book not found.",
        404,
      );
    }

    return NextResponse.json(
      {
        ok: true,
        book,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "[book-verify] Failed to verify book:",
      error,
    );

    return errorResponse(
      "Unable to verify the book.",
      500,
    );
  }
}
'@

Write-Host "Creating Verify button..." -ForegroundColor Yellow

Write-NoBom "apps\web\components\books\BookVerificationButton.tsx" @'
"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import type { BookRecord } from "@/lib/books/book-types";

export interface BookVerificationButtonProps {
  bookId: string;
  disabled?: boolean;
  onVerified: (
    book: BookRecord,
  ) => void;
}

interface VerifyResponse {
  ok: boolean;
  error?: string;
  book?: BookRecord;
}

export function BookVerificationButton({
  bookId,
  disabled = false,
  onVerified,
}: BookVerificationButtonProps) {
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleVerify() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/books/${bookId}`,
        {
          method: "PATCH",
          headers: {
            "content-type":
              "application/json",
          },
          body: JSON.stringify({
            action: "verify",
          }),
        },
      );

      const data =
        (await response.json()) as VerifyResponse;

      if (
        !response.ok ||
        !data.ok ||
        !data.book
      ) {
        throw new Error(
          data.error ??
            "Unable to verify book.",
        );
      }

      onVerified(data.book);
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Unable to verify book.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        data-testid="book-verify-button"
        disabled={
          disabled ||
          submitting
        }
        onClick={() => {
          void handleVerify();
        }}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <CheckCircle2
          aria-hidden="true"
          className="h-4 w-4"
        />

        {submitting
          ? "Verifying..."
          : "Verify Book"}
      </button>

      {error ? (
        <p
          data-testid="book-verify-error"
          role="alert"
          className="mt-2 text-sm font-semibold text-rose-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
'@

Write-Host "Creating BookDetails component..." -ForegroundColor Yellow

Write-NoBom "apps\web\components\books\BookDetails.tsx" @'
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
'@

Write-Host "Updating books component barrel..." -ForegroundColor Yellow

Write-NoBom "apps\web\components\books\index.ts" @'
export * from "./BookCard";
export * from "./BookDetails";
export * from "./BookGrid";
export * from "./BookLibrary";
export * from "./BookUploadForm";
export * from "./BookVerificationButton";
'@

Write-Host "Creating /books/[bookId] page..." -ForegroundColor Yellow

Write-NoBom "apps\web\app\books\[bookId]\page.tsx" @'
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
'@

Write-Host "Adding post-upload details link..." -ForegroundColor Yellow

$uploadFormPath = "apps\web\components\books\BookUploadForm.tsx"
$uploadForm = [System.IO.File]::ReadAllText(
    (Resolve-Path $uploadFormPath).Path
).TrimStart([char]0xFEFF)

if ($uploadForm -notmatch 'import Link from "next/link";') {
    $uploadForm = $uploadForm.Replace(
        '"use client";' + "`r`n",
        '"use client";' + "`r`n`r`n" + 'import Link from "next/link";' + "`r`n"
    )

    if ($uploadForm -notmatch 'import Link from "next/link";') {
        $uploadForm = $uploadForm.Replace(
            '"use client";' + "`n",
            '"use client";' + "`n`n" + 'import Link from "next/link";' + "`n"
        )
    }
}

$oldSuccessText = @'
          <p className="mt-2 text-xs leading-5 text-slate-500">
            The book is stored locally for this MVP and is waiting for verification.
          </p>
'@

$newSuccessText = @'
          <p className="mt-2 text-xs leading-5 text-slate-500">
            The book is stored locally for this MVP and is waiting for verification.
          </p>

          <Link
            href={`/books/${uploadedBook.id}`}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Review & Verify
          </Link>
'@

if ($uploadForm -notmatch "Review & Verify") {
    $uploadForm = $uploadForm.Replace(
        $oldSuccessText,
        $newSuccessText
    )
}

[System.IO.File]::WriteAllText(
    (Resolve-Path $uploadFormPath).Path,
    $uploadForm,
    $utf8NoBom
)

Write-Host "Creating detail API tests..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\api\book-detail-route.test.ts" @'
import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  GET,
  PATCH,
} from "@/app/api/books/[bookId]/route";
import {
  getBookRepository,
  resetDemoBookRepositoryForTests,
} from "@/lib/books/book-repository-provider";
import { BOOK_STATUSES } from "@/lib/books/book-types";

function context(
  bookId: string,
) {
  return {
    params: Promise.resolve({
      bookId,
    }),
  };
}

describe("/api/books/[bookId]", () => {
  beforeEach(() => {
    resetDemoBookRepositoryForTests();
  });

  it("gets a book by id", async () => {
    const repository =
      getBookRepository();

    const created =
      await repository.create({
        title: "Detail Book",
        author: "Author",
        fileUrl: "/detail.pdf",
      });

    const response = await GET(
      new Request(
        `http://localhost/api/books/${created.id}`,
      ),
      context(created.id),
    );

    const data =
      await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.book.id).toBe(
      created.id,
    );
  });

  it("returns 404 for an unknown book", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/books/missing",
      ),
      context("missing"),
    );

    expect(response.status).toBe(404);
  });

  it("verifies a pending book", async () => {
    const repository =
      getBookRepository();

    const created =
      await repository.create({
        title: "Pending Book",
        author: "Author",
        fileUrl: "/pending.pdf",
      });

    const response = await PATCH(
      new Request(
        `http://localhost/api/books/${created.id}`,
        {
          method: "PATCH",
          headers: {
            "content-type":
              "application/json",
          },
          body: JSON.stringify({
            action: "verify",
          }),
        },
      ),
      context(created.id),
    );

    const data =
      await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.book.status).toBe(
      BOOK_STATUSES.VERIFIED,
    );
    expect(
      data.book.verifiedAt,
    ).toBeTruthy();

    const publicBooks =
      await repository.listPublicBooks();

    expect(publicBooks).toHaveLength(1);
  });

  it("rejects unsupported patch actions", async () => {
    const repository =
      getBookRepository();

    const created =
      await repository.create({
        title: "Pending Book",
        author: "Author",
        fileUrl: "/pending.pdf",
      });

    const response = await PATCH(
      new Request(
        `http://localhost/api/books/${created.id}`,
        {
          method: "PATCH",
          headers: {
            "content-type":
              "application/json",
          },
          body: JSON.stringify({
            action: "delete",
          }),
        },
      ),
      context(created.id),
    );

    expect(response.status).toBe(400);
  });
});
'@

Write-Host "Creating Verify button tests..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\components\BookVerificationButton.test.tsx" @'
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { BookVerificationButton } from "@/components/books";
import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

afterEach(() => {
  vi.unstubAllGlobals();
});

function verifiedBook(): BookRecord {
  return {
    id: "book-1",
    title: "Demo Book",
    author: "Author",
    description: null,
    category: null,
    language: null,
    coverUrl: null,
    fileUrl: "/demo.pdf",
    fileName: "demo.pdf",
    mimeType: "application/pdf",
    fileSize: 100,
    status: BOOK_STATUSES.VERIFIED,
    verifiedAt:
      "2026-09-04T00:00:00.000Z",
    createdAt:
      "2026-09-04T00:00:00.000Z",
    updatedAt:
      "2026-09-04T00:00:00.000Z",
  };
}

describe("BookVerificationButton", () => {
  it("verifies a book", async () => {
    const user = userEvent.setup();
    const onVerified = vi.fn();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        ok: true,
        book: verifiedBook(),
      }),
    });

    vi.stubGlobal(
      "fetch",
      fetchMock,
    );

    render(
      <BookVerificationButton
        bookId="book-1"
        onVerified={onVerified}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Verify Book",
      }),
    );

    await waitFor(() => {
      expect(onVerified).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/books/book-1",
      expect.objectContaining({
        method: "PATCH",
      }),
    );
  });

  it("shows verification errors", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          ok: false,
          error: "Verify failed",
        }),
      }),
    );

    render(
      <BookVerificationButton
        bookId="book-1"
        onVerified={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Verify Book",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-verify-error",
        ),
      ).toHaveTextContent(
        "Verify failed",
      );
    });
  });
});
'@

Write-Host "Creating BookDetails tests..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\components\BookDetails.test.tsx" @'
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { BookDetails } from "@/components/books";
import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

afterEach(() => {
  vi.unstubAllGlobals();
});

function book(
  status = BOOK_STATUSES.PENDING,
): BookRecord {
  return {
    id: "book-1",
    title: "Detail Book",
    author: "Detail Author",
    description: "Book description",
    category: "Education",
    language: "English",
    coverUrl: null,
    fileUrl: "/detail.pdf",
    fileName: "detail.pdf",
    mimeType: "application/pdf",
    fileSize: 100,
    status,
    verifiedAt:
      status ===
      BOOK_STATUSES.VERIFIED
        ? "2026-09-04T00:00:00.000Z"
        : null,
    createdAt:
      "2026-09-04T00:00:00.000Z",
    updatedAt:
      "2026-09-04T00:00:00.000Z",
  };
}

describe("BookDetails", () => {
  it("shows pending details and verify action", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: book(),
        }),
      }),
    );

    render(
      <BookDetails
        bookId="book-1"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Detail Book",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(
        "book-status",
      ),
    ).toHaveTextContent(
      "PENDING",
    );

    expect(
      screen.getByRole("button", {
        name: "Verify Book",
      }),
    ).toBeInTheDocument();
  });

  it("updates the UI after verification", async () => {
    const user = userEvent.setup();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: book(),
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: book(
            BOOK_STATUSES.VERIFIED,
          ),
        }),
      });

    vi.stubGlobal(
      "fetch",
      fetchMock,
    );

    render(
      <BookDetails
        bookId="book-1"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Verify Book",
        }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", {
        name: "Verify Book",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-status",
        ),
      ).toHaveTextContent(
        "VERIFIED",
      );
    });

    expect(
      screen.getByRole("link", {
        name: "Read Book",
      }),
    ).toHaveAttribute(
      "href",
      "/books/book-1/read",
    );
  });

  it("shows a load error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          ok: false,
          error: "Book not found.",
        }),
      }),
    );

    render(
      <BookDetails
        bookId="missing"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-details-error",
        ),
      ).toHaveTextContent(
        "Book not found.",
      );
    });
  });
});
'@

Write-Host "Creating book details page test..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\pages\BookDetailsPage.test.tsx" @'
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import BookDetailsPage from "@/app/books/[bookId]/page";

vi.mock("next/navigation", () => ({
  usePathname: () =>
    "/books/book-1",
}));

describe("BookDetailsPage", () => {
  it("renders the book details page", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: {
            id: "book-1",
            title: "Page Book",
            author: "Author",
            description: null,
            category: null,
            language: "English",
            coverUrl: null,
            fileUrl: "/page.pdf",
            fileName: "page.pdf",
            mimeType:
              "application/pdf",
            fileSize: 100,
            status: "PENDING",
            verifiedAt: null,
            createdAt:
              "2026-09-04T00:00:00.000Z",
            updatedAt:
              "2026-09-04T00:00:00.000Z",
          },
        }),
      }),
    );

    const element =
      await BookDetailsPage({
        params: Promise.resolve({
          bookId: "book-1",
        }),
      });

    render(element);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Book Details",
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Page Book",
        ),
      ).toBeInTheDocument();
    });
  });
});
'@

Write-Host "Writing B4 status document..." -ForegroundColor Yellow

Write-NoBom "apps\web\PHASE-BOOKS-B4-STATUS.md" @'
# Book Library B4 Status

## Goal

Add book details and MVP verification.

## Added

- `GET /api/books/[bookId]`
- `PATCH /api/books/[bookId]`
- `/books/[bookId]`
- `BookDetails`
- `BookVerificationButton`
- Pending status display
- Verified status display
- `PENDING -> VERIFIED`
- `verifiedAt`
- Read Book action after verification
- Review & Verify link after upload

## MVP verification

The current verification flow intentionally has no authentication or moderator permissions.

Clicking:

```txt
Verify Book
```

immediately changes:

```txt
PENDING
```

to:

```txt
VERIFIED
```

This is demo-only behavior.

## Public library result

After verification, the repository's:

```txt
listPublicBooks()
```

includes the book.

Refreshing `/books` can then show the verified book while the same demo server repository remains alive.

## Demo limitation

Book metadata currently lives in an in-memory repository.

Restarting the Next.js development server clears book metadata.

Local uploaded files remain on disk.

## Next Phase

B5:

- `/books/[bookId]/read`
- responsive PDF reader
- embedded browser PDF viewer
- back to details
- verified-book reading guard
'@

Write-Host ""
Write-Host "Running B4 focused tests..." -ForegroundColor Cyan

pnpm --filter "@matn-quiz/web" exec vitest run `
  tests/unit/api/book-detail-route.test.ts `
  tests/unit/components/BookVerificationButton.test.tsx `
  tests/unit/components/BookDetails.test.tsx `
  tests/unit/pages/BookDetailsPage.test.tsx `
  --testTimeout=20000

if ($LASTEXITCODE -ne 0) {
    $ok = $false
    Write-Host ""
    Write-Host "B4 focused tests FAILED." -ForegroundColor Red
}

if ($ok) {
    Write-Host ""
    Write-Host "Running full web test suite..." -ForegroundColor Cyan

    pnpm test

    if ($LASTEXITCODE -ne 0) {
        $ok = $false
        Write-Host ""
        Write-Host "Full web test suite FAILED." -ForegroundColor Red
    }
}

if ($ok) {
    Write-Host ""
    Write-Host "Running production web build..." -ForegroundColor Cyan

    pnpm --filter "@matn-quiz/web" build

    if ($LASTEXITCODE -ne 0) {
        $ok = $false
        Write-Host ""
        Write-Host "Production build FAILED." -ForegroundColor Red
    }
}

if ($ok) {
    Write-Host ""
    Write-Host "B4 verification PASSED." -ForegroundColor Green

    git add `
      "apps/web/app/api/books/[bookId]/route.ts" `
      "apps/web/app/books/[bookId]/page.tsx" `
      apps/web/components/books/BookDetails.tsx `
      apps/web/components/books/BookVerificationButton.tsx `
      apps/web/components/books/BookUploadForm.tsx `
      apps/web/components/books/index.ts `
      apps/web/tests/unit/api/book-detail-route.test.ts `
      apps/web/tests/unit/components/BookVerificationButton.test.tsx `
      apps/web/tests/unit/components/BookDetails.test.tsx `
      apps/web/tests/unit/pages/BookDetailsPage.test.tsx `
      apps/web/PHASE-BOOKS-B4-STATUS.md

    $pending = git status --porcelain

    if ($pending) {
        git commit -m "feat(web): add book verification flow"

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "B4 committed successfully." -ForegroundColor Green
        }
    }
    else {
        Write-Host "No B4 changes to commit." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "=== BOOK LIBRARY B4 COMPLETE ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Manual flow:" -ForegroundColor Cyan
    Write-Host "1. http://localhost:3000/books/upload"
    Write-Host "2. Upload PDF"
    Write-Host "3. Click Review & Verify"
    Write-Host "4. Click Verify Book"
    Write-Host "5. Open http://localhost:3000/books"
    Write-Host ""
    Write-Host "Next phase: B5 - PDF Reader" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "=== B4 STOPPED - NOTHING COMMITTED ===" -ForegroundColor Red
    Write-Host "Send me the failed test/build output." -ForegroundColor Yellow
}

Read-Host "Press Enter to close"
