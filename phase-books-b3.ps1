$ErrorActionPreference = "Continue"

Write-Host "=== BOOK LIBRARY B3 - PUBLIC VERIFIED LIBRARY ===" -ForegroundColor Cyan

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
    Write-Host "B3 cannot start because B1/B2 files are missing." -ForegroundColor Red
    Read-Host "Press Enter to close"
    return
}

Write-Host ""
Write-Host "Updating /api/books with GET public library endpoint..." -ForegroundColor Yellow

Write-NoBom "apps\web\app\api\books\route.ts" @'
import { NextResponse } from "next/server";

import { getBookRepository } from "@/lib/books/book-repository-provider";
import { LocalBookStorage } from "@/lib/books/book-storage";
import {
  fileToBytes,
  hasPdfSignature,
  parseBookUploadFormData,
} from "@/lib/books/book-upload-request";
import { validateBookUpload } from "@/lib/books/book-validation";

export const runtime = "nodejs";

function errorResponse(
  message: string,
  status: number,
  errors?: string[],
) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      errors: errors ?? [],
    },
    { status },
  );
}

export async function GET() {
  try {
    const repository = getBookRepository();
    const books = await repository.listPublicBooks();

    return NextResponse.json(
      {
        ok: true,
        books,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "[books-list] Failed to load public books:",
      error,
    );

    return errorResponse(
      "Unable to load the public book library.",
      500,
    );
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return errorResponse(
        "Book upload must use multipart/form-data.",
        415,
      );
    }

    const formData = await request.formData();
    const parsed = parseBookUploadFormData(formData);

    if (!parsed) {
      return errorResponse(
        "A PDF book file is required.",
        400,
        ["A PDF book file is required."],
      );
    }

    const validation = validateBookUpload(parsed.input);

    if (!validation.valid) {
      return errorResponse(
        "Book upload validation failed.",
        400,
        validation.errors,
      );
    }

    const pdfSignatureIsValid = await hasPdfSignature(parsed.bookFile);

    if (!pdfSignatureIsValid) {
      return errorResponse(
        "Book file does not contain a valid PDF signature.",
        400,
        [
          "The uploaded file does not appear to be a valid PDF.",
        ],
      );
    }

    const storage = new LocalBookStorage();

    const storedBook = await storage.saveBookFile({
      name: parsed.bookFile.name,
      type: parsed.bookFile.type,
      size: parsed.bookFile.size,
      bytes: await fileToBytes(parsed.bookFile),
    });

    const storedCover = parsed.coverFile
      ? await storage.saveCover({
          name: parsed.coverFile.name,
          type: parsed.coverFile.type,
          size: parsed.coverFile.size,
          bytes: await fileToBytes(parsed.coverFile),
        })
      : null;

    const repository = getBookRepository();

    const book = await repository.create({
      title: parsed.input.title,
      author: parsed.input.author,
      description: parsed.input.description || null,
      category: parsed.input.category || null,
      language: parsed.input.language || null,
      coverUrl: storedCover?.publicUrl ?? null,
      fileUrl: storedBook.publicUrl,
      fileName: storedBook.fileName,
      mimeType: storedBook.mimeType,
      fileSize: storedBook.size,
    });

    return NextResponse.json(
      {
        ok: true,
        book,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "[books-upload] Failed to upload book:",
      error,
    );

    return errorResponse(
      "Unable to upload the book.",
      500,
    );
  }
}
'@

Write-Host "Creating BookCard..." -ForegroundColor Yellow

Write-NoBom "apps\web\components\books\BookCard.tsx" @'
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
'@

Write-Host "Creating BookGrid..." -ForegroundColor Yellow

Write-NoBom "apps\web\components\books\BookGrid.tsx" @'
import type { BookRecord } from "@/lib/books/book-types";

import { BookCard } from "./BookCard";

export interface BookGridProps {
  books: BookRecord[];
}

export function BookGrid({
  books,
}: BookGridProps) {
  return (
    <div
      data-testid="book-grid"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
        />
      ))}
    </div>
  );
}
'@

Write-Host "Creating BookLibrary client..." -ForegroundColor Yellow

Write-NoBom "apps\web\components\books\BookLibrary.tsx" @'
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
'@

Write-Host "Updating books component barrel..." -ForegroundColor Yellow

Write-NoBom "apps\web\components\books\index.ts" @'
export * from "./BookCard";
export * from "./BookGrid";
export * from "./BookLibrary";
export * from "./BookUploadForm";
'@

Write-Host "Creating /books page..." -ForegroundColor Yellow

Write-NoBom "apps\web\app\books\page.tsx" @'
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
'@

Write-Host "Updating /books/upload navigation..." -ForegroundColor Yellow

Write-NoBom "apps\web\app\books\upload\page.tsx" @'
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
'@

Write-Host "Creating GET API test..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\api\books-route.test.ts" @'
import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { GET } from "@/app/api/books/route";
import {
  getBookRepository,
  resetDemoBookRepositoryForTests,
} from "@/lib/books/book-repository-provider";
import { BOOK_STATUSES } from "@/lib/books/book-types";

describe("GET /api/books", () => {
  beforeEach(() => {
    resetDemoBookRepositoryForTests();
  });

  it("returns only verified books", async () => {
    const repository =
      getBookRepository();

    await repository.create({
      title: "Pending Book",
      author: "Pending Author",
      fileUrl: "/pending.pdf",
    });

    const verified =
      await repository.create({
        title: "Verified Book",
        author: "Verified Author",
        fileUrl: "/verified.pdf",
      });

    await repository.verify(
      verified.id,
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.books).toHaveLength(1);
    expect(data.books[0].title).toBe(
      "Verified Book",
    );
    expect(data.books[0].status).toBe(
      BOOK_STATUSES.VERIFIED,
    );
  });
});
'@

Write-Host "Creating BookCard test..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\components\BookCard.test.tsx" @'
import {
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
} from "vitest";

import { BookCard } from "@/components/books";
import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

function createBook(
  overrides: Partial<BookRecord> = {},
): BookRecord {
  return {
    id: "book-1",
    title: "Demo Book",
    author: "Demo Author",
    description: "Description",
    category: "Education",
    language: "English",
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
    ...overrides,
  };
}

describe("BookCard", () => {
  it("renders book information", () => {
    render(
      <BookCard
        book={createBook()}
      />,
    );

    expect(
      screen.getByText("Demo Book"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Demo Author"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Education"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("English"),
    ).toBeInTheDocument();
  });

  it("links to the book details route", () => {
    render(
      <BookCard
        book={createBook()}
      />,
    );

    expect(
      screen.getByRole("link", {
        name: "View Book",
      }),
    ).toHaveAttribute(
      "href",
      "/books/book-1",
    );
  });

  it("shows a cover placeholder", () => {
    render(
      <BookCard
        book={createBook({
          coverUrl: null,
        })}
      />,
    );

    expect(
      screen.getByText(
        "No cover uploaded",
      ),
    ).toBeInTheDocument();
  });
});
'@

Write-Host "Creating BookGrid test..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\components\BookGrid.test.tsx" @'
import {
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
} from "vitest";

import { BookGrid } from "@/components/books";
import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

function book(
  id: string,
  title: string,
): BookRecord {
  return {
    id,
    title,
    author: "Author",
    description: null,
    category: null,
    language: null,
    coverUrl: null,
    fileUrl: `/${id}.pdf`,
    fileName: `${id}.pdf`,
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

describe("BookGrid", () => {
  it("renders every book", () => {
    render(
      <BookGrid
        books={[
          book("1", "Book One"),
          book("2", "Book Two"),
        ]}
      />,
    );

    expect(
      screen.getAllByTestId(
        "book-card",
      ),
    ).toHaveLength(2);

    expect(
      screen.getByText("Book One"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Book Two"),
    ).toBeInTheDocument();
  });
});
'@

Write-Host "Creating BookLibrary test..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\components\BookLibrary.test.tsx" @'
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

import { BookLibrary } from "@/components/books";
import { BOOK_STATUSES } from "@/lib/books/book-types";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("BookLibrary", () => {
  it("shows the empty state", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          books: [],
        }),
      }),
    );

    render(<BookLibrary />);

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-library-empty",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "No verified books yet",
      ),
    ).toBeInTheDocument();
  });

  it("renders verified books returned by the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          books: [
            {
              id: "verified-1",
              title: "Public Book",
              author: "Public Author",
              description: null,
              category: "History",
              language: "English",
              coverUrl: null,
              fileUrl: "/public.pdf",
              fileName: "public.pdf",
              mimeType:
                "application/pdf",
              fileSize: 100,
              status:
                BOOK_STATUSES.VERIFIED,
              verifiedAt:
                "2026-09-04T00:00:00.000Z",
              createdAt:
                "2026-09-04T00:00:00.000Z",
              updatedAt:
                "2026-09-04T00:00:00.000Z",
            },
          ],
        }),
      }),
    );

    render(<BookLibrary />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Public Book",
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows an error state when loading fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          ok: false,
          error: "Library unavailable",
        }),
      }),
    );

    render(<BookLibrary />);

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-library-error",
        ),
      ).toHaveTextContent(
        "Library unavailable",
      );
    });
  });
});
'@

Write-Host "Creating /books page test..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\pages\BooksPage.test.tsx" @'
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

import BooksPage from "@/app/books/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/books",
}));

describe("BooksPage", () => {
  it("renders the public library page", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          books: [],
        }),
      }),
    );

    render(<BooksPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Public Books",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /Upload Book/i,
      }),
    ).toHaveAttribute(
      "href",
      "/books/upload",
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-library-empty",
        ),
      ).toBeInTheDocument();
    });
  });
});
'@

Write-Host "Writing B3 status document..." -ForegroundColor Yellow

Write-NoBom "apps\web\PHASE-BOOKS-B3-STATUS.md" @'
# Book Library B3 Status

## Goal

Create the public verified-book library.

## Added

- `GET /api/books`
- `/books`
- `BookCard`
- `BookGrid`
- `BookLibrary`
- Loading state
- Error state
- Empty state
- Upload link from the library
- Public Library link from upload page

## Public visibility rule

The GET endpoint uses:

```txt
repository.listPublicBooks()
```

Only books with:

```txt
VERIFIED
```

status are returned.

Pending books remain hidden from the public library.

## Demo limitation

The current repository is in memory.

Restarting the Next.js server clears demo book records.

Uploaded PDF files remain on disk locally, but their in-memory metadata is reset.

A persistent repository will be added later.

## Next Phase

B4:

- `/books/[bookId]`
- book detail page
- pending/admin-style book view
- Verify button
- `PENDING -> VERIFIED`
- verifiedAt timestamp
- book lookup API
- verification API
'@

Write-Host ""
Write-Host "Running B3 focused tests..." -ForegroundColor Cyan

pnpm --filter "@matn-quiz/web" exec vitest run `
  tests/unit/api/books-route.test.ts `
  tests/unit/components/BookCard.test.tsx `
  tests/unit/components/BookGrid.test.tsx `
  tests/unit/components/BookLibrary.test.tsx `
  tests/unit/pages/BooksPage.test.tsx `
  --testTimeout=20000

if ($LASTEXITCODE -ne 0) {
    $ok = $false
    Write-Host ""
    Write-Host "B3 focused tests FAILED." -ForegroundColor Red
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
    Write-Host "B3 verification PASSED." -ForegroundColor Green

    git add `
      apps/web/app/api/books/route.ts `
      apps/web/app/books/page.tsx `
      apps/web/app/books/upload/page.tsx `
      apps/web/components/books/BookCard.tsx `
      apps/web/components/books/BookGrid.tsx `
      apps/web/components/books/BookLibrary.tsx `
      apps/web/components/books/index.ts `
      apps/web/tests/unit/api/books-route.test.ts `
      apps/web/tests/unit/components/BookCard.test.tsx `
      apps/web/tests/unit/components/BookGrid.test.tsx `
      apps/web/tests/unit/components/BookLibrary.test.tsx `
      apps/web/tests/unit/pages/BooksPage.test.tsx `
      apps/web/PHASE-BOOKS-B3-STATUS.md

    $pending = git status --porcelain

    if ($pending) {
        git commit -m "feat(web): add public book library"

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "B3 committed successfully." -ForegroundColor Green
        }
    }
    else {
        Write-Host "No B3 changes to commit." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "=== BOOK LIBRARY B3 COMPLETE ===" -ForegroundColor Green
    Write-Host "Public library: http://localhost:3000/books" -ForegroundColor Cyan
    Write-Host "Upload page:    http://localhost:3000/books/upload" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "NOTE: Uploaded books are PENDING, so /books stays empty until B4 adds verification." -ForegroundColor Yellow
    Write-Host "Next phase: B4 - Book Details + Verify flow" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "=== B3 STOPPED - NOTHING COMMITTED ===" -ForegroundColor Red
    Write-Host "Send me the failed test/build output." -ForegroundColor Yellow
}

Read-Host "Press Enter to close"
