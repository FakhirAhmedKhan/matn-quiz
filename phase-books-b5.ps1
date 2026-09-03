$ErrorActionPreference = "Continue"

Write-Host "=== BOOK LIBRARY B5 - PDF READER ===" -ForegroundColor Cyan

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
    "apps\web\lib\books\book-repository-provider.ts",
    "apps\web\app\api\books\[bookId]\route.ts",
    "apps\web\app\books\[bookId]\page.tsx",
    "apps\web\components\books\BookDetails.tsx",
    "apps\web\components\books\BookVerificationButton.tsx"
)

foreach ($file in $requiredFiles) {
    if (!(Test-Path -LiteralPath $file)) {
        Write-Host "MISSING REQUIRED FILE: $file" -ForegroundColor Red
        $ok = $false
    }
}

if (!$ok) {
    Write-Host ""
    Write-Host "B5 cannot start because B4 files are missing." -ForegroundColor Red
    Write-Host "Run/finish B4 first, then rerun B5." -ForegroundColor Yellow
    Read-Host "Press Enter to close"
    return
}

Write-Host ""
Write-Host "Creating BookReader component..." -ForegroundColor Yellow

Write-NoBom "apps\web\components\books\BookReader.tsx" @'
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
'@

Write-Host "Updating books component barrel..." -ForegroundColor Yellow

$indexPath = "apps\web\components\books\index.ts"
$indexContent = [System.IO.File]::ReadAllText(
    (Resolve-Path $indexPath).Path
).TrimStart([char]0xFEFF)

if ($indexContent -notmatch 'export \* from "\./BookReader";') {
    $indexContent = $indexContent.TrimEnd() +
        "`r`n" +
        'export * from "./BookReader";' +
        "`r`n"

    [System.IO.File]::WriteAllText(
        (Resolve-Path $indexPath).Path,
        $indexContent,
        $utf8NoBom
    )
}

Write-Host "Creating /books/[bookId]/read page..." -ForegroundColor Yellow

Write-NoBom "apps\web\app\books\[bookId]\read\page.tsx" @'
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
'@

Write-Host "Creating BookReader tests..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\components\BookReader.test.tsx" @'
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { BookReader } from "@/components/books";
import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

afterEach(() => {
  vi.unstubAllGlobals();
});

function createBook(
  status = BOOK_STATUSES.VERIFIED,
): BookRecord {
  return {
    id: "book-1",
    title: "Reader Book",
    author: "Reader Author",
    description: null,
    category: "Education",
    language: "English",
    coverUrl: null,
    fileUrl:
      "/uploads/books/files/reader.pdf",
    fileName: "reader.pdf",
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

describe("BookReader", () => {
  it("renders a verified PDF in an iframe", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: createBook(),
        }),
      }),
    );

    render(
      <BookReader
        bookId="book-1"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-pdf-frame",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(
        "book-pdf-frame",
      ),
    ).toHaveAttribute(
      "src",
      "/uploads/books/files/reader.pdf",
    );

    expect(
      screen.getByTitle(
        "Reader Book PDF reader",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Open PDF",
      }),
    ).toHaveAttribute(
      "href",
      "/uploads/books/files/reader.pdf",
    );
  });

  it("blocks pending books from the reader", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: createBook(
            BOOK_STATUSES.PENDING,
          ),
        }),
      }),
    );

    render(
      <BookReader
        bookId="book-1"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-reader-unverified",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId(
        "book-pdf-frame",
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText(
        "Verification required",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error when the book cannot be loaded", async () => {
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
      <BookReader
        bookId="missing"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-reader-error",
        ),
      ).toHaveTextContent(
        "Book not found.",
      );
    });
  });
});
'@

Write-Host "Creating BookReader page test..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\pages\BookReaderPage.test.tsx" @'
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

import BookReaderPage from "@/app/books/[bookId]/read/page";

vi.mock("next/navigation", () => ({
  usePathname: () =>
    "/books/book-1/read",
}));

describe("BookReaderPage", () => {
  it("renders the PDF reader page", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: {
            id: "book-1",
            title: "Reader Page Book",
            author: "Author",
            description: null,
            category: null,
            language: "English",
            coverUrl: null,
            fileUrl:
              "/uploads/books/files/page.pdf",
            fileName: "page.pdf",
            mimeType:
              "application/pdf",
            fileSize: 100,
            status: "VERIFIED",
            verifiedAt:
              "2026-09-04T00:00:00.000Z",
            createdAt:
              "2026-09-04T00:00:00.000Z",
            updatedAt:
              "2026-09-04T00:00:00.000Z",
          },
        }),
      }),
    );

    const element =
      await BookReaderPage({
        params: Promise.resolve({
          bookId: "book-1",
        }),
      });

    render(element);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Read Book",
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-pdf-frame",
        ),
      ).toBeInTheDocument();
    });
  });
});
'@

Write-Host "Writing B5 status document..." -ForegroundColor Yellow

Write-NoBom "apps\web\PHASE-BOOKS-B5-STATUS.md" @'
# Book Library B5 Status

## Goal

Add an MVP PDF reader for verified books.

## Added

- `/books/[bookId]/read`
- `BookReader`
- Embedded browser PDF iframe
- Book title and author in reader toolbar
- Back to Book Details
- Back to Public Library
- Open PDF in a new browser tab
- Loading state
- Error state
- Verification guard

## Verification rule

Only books with:

```txt
VERIFIED
```

status render the embedded PDF reader.

Pending books show:

```txt
Verification required
```

and are directed back to the book details page.

## Reader

The MVP reader uses the browser's built-in PDF rendering:

```tsx
<iframe src={book.fileUrl} />
```

No custom PDF rendering dependency is required.

## Local demo behavior

PDF files are read from:

```txt
public/uploads/books/files/
```

This works for local/demo development.

Local uploads are not persistent production storage on Vercel.

## Next Phase

B6:

- final Book Library test coverage
- responsive/accessibility polish
- navigation integration
- full regression verification
- production build verification
- update project context documentation
'@

Write-Host ""
Write-Host "Running B5 focused tests..." -ForegroundColor Cyan

pnpm --filter "@matn-quiz/web" exec vitest run `
  tests/unit/components/BookReader.test.tsx `
  tests/unit/pages/BookReaderPage.test.tsx `
  --testTimeout=20000

if ($LASTEXITCODE -ne 0) {
    $ok = $false
    Write-Host ""
    Write-Host "B5 focused tests FAILED." -ForegroundColor Red
}

if ($ok) {
    Write-Host ""
    Write-Host "Running complete web test suite..." -ForegroundColor Cyan

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
    Write-Host "B5 verification PASSED." -ForegroundColor Green

    git add `
      "apps/web/app/books/[bookId]/read/page.tsx" `
      apps/web/components/books/BookReader.tsx `
      apps/web/components/books/index.ts `
      apps/web/tests/unit/components/BookReader.test.tsx `
      apps/web/tests/unit/pages/BookReaderPage.test.tsx `
      apps/web/PHASE-BOOKS-B5-STATUS.md

    $pending = git status --porcelain

    if ($pending) {
        git commit -m "feat(web): add book pdf reader"

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "B5 committed successfully." -ForegroundColor Green
        }
    }
    else {
        Write-Host "No B5 changes to commit." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "=== BOOK LIBRARY B5 COMPLETE ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Manual flow:" -ForegroundColor Cyan
    Write-Host "1. pnpm dev"
    Write-Host "2. Upload a real PDF at http://localhost:3000/books/upload"
    Write-Host "3. Open Review & Verify"
    Write-Host "4. Click Verify Book"
    Write-Host "5. Click Read Book"
    Write-Host "6. Confirm PDF displays inside the page"
    Write-Host ""
    Write-Host "Next phase: B6 - Final polish + navigation + regression verification" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "=== B5 STOPPED - NOTHING COMMITTED ===" -ForegroundColor Red
    Write-Host "Send me the failed test/build output." -ForegroundColor Yellow
}

Read-Host "Press Enter to close"
