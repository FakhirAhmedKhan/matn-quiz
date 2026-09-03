$ErrorActionPreference = "Continue"

Write-Host "=== BOOK LIBRARY B2 - UPLOAD API + UI ===" -ForegroundColor Cyan

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$ok = $true

function Write-NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
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

$requiredB1Files = @(
    "apps\web\lib\books\book-types.ts",
    "apps\web\lib\books\book-validation.ts",
    "apps\web\lib\books\book-storage.ts",
    "apps\web\lib\books\book-repository.ts",
    "apps\web\lib\books\demo-book-repository.ts",
    "apps\web\lib\books\book-config.ts"
)

foreach ($file in $requiredB1Files) {
    if (!(Test-Path $file)) {
        Write-Host "MISSING B1 FILE: $file" -ForegroundColor Red
        $ok = $false
    }
}

if (!$ok) {
    Write-Host ""
    Write-Host "B2 cannot start because B1 foundation is incomplete." -ForegroundColor Red
    Read-Host "Press Enter to close"
    return
}

Write-Host ""
Write-Host "Creating shared demo repository provider..." -ForegroundColor Yellow

Write-NoBom "apps\web\lib\books\book-repository-provider.ts" @'
import type { BookRepository } from "./book-repository";
import { getBookFeatureConfig } from "./book-config";
import { DemoBookRepository } from "./demo-book-repository";

type BookRepositoryGlobal = typeof globalThis & {
  __matnQuizDemoBookRepository?: DemoBookRepository;
};

const repositoryGlobal = globalThis as BookRepositoryGlobal;

export function getBookRepository(): BookRepository {
  const config = getBookFeatureConfig();

  if (!config.demoMode) {
    throw new Error(
      "BOOKS_DEMO_MODE is disabled, but a Prisma Book repository has not been configured yet.",
    );
  }

  repositoryGlobal.__matnQuizDemoBookRepository ??=
    new DemoBookRepository();

  return repositoryGlobal.__matnQuizDemoBookRepository;
}

export function resetDemoBookRepositoryForTests(): void {
  repositoryGlobal.__matnQuizDemoBookRepository?.clear();
  delete repositoryGlobal.__matnQuizDemoBookRepository;
}
'@

Write-Host "Creating upload request helpers..." -ForegroundColor Yellow

Write-NoBom "apps\web\lib\books\book-upload-request.ts" @'
import type {
  BookUploadFileMetadata,
  BookUploadInput,
} from "./book-types";

export interface ParsedBookUpload {
  input: BookUploadInput;
  bookFile: File;
  coverFile: File | null;
}

function getTextValue(
  formData: FormData,
  key: string,
): string {
  const value = formData.get(key);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function isUploadedFile(
  value: FormDataEntryValue | null,
): value is File {
  return (
    typeof File !== "undefined" &&
    value instanceof File &&
    value.name.trim().length > 0
  );
}

function toMetadata(
  file: File,
): BookUploadFileMetadata {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
  };
}

export function parseBookUploadFormData(
  formData: FormData,
): ParsedBookUpload | null {
  const bookValue = formData.get("bookFile");
  const coverValue = formData.get("coverFile");

  if (!isUploadedFile(bookValue)) {
    return null;
  }

  const coverFile = isUploadedFile(coverValue)
    ? coverValue
    : null;

  return {
    input: {
      title: getTextValue(formData, "title"),
      author: getTextValue(formData, "author"),
      description: getTextValue(formData, "description"),
      category: getTextValue(formData, "category"),
      language: getTextValue(formData, "language"),
      bookFile: toMetadata(bookValue),
      coverFile: coverFile ? toMetadata(coverFile) : null,
    },
    bookFile: bookValue,
    coverFile,
  };
}

export async function fileToBytes(
  file: File,
): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

export async function hasPdfSignature(
  file: File,
): Promise<boolean> {
  if (file.size < 5) {
    return false;
  }

  const header = new Uint8Array(
    await file.slice(0, 5).arrayBuffer(),
  );

  return (
    header[0] === 0x25 &&
    header[1] === 0x50 &&
    header[2] === 0x44 &&
    header[3] === 0x46 &&
    header[4] === 0x2d
  );
}
'@

Write-Host "Creating POST /api/books..." -ForegroundColor Yellow

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
        ["The uploaded file does not appear to be a valid PDF."],
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
    console.error("[books-upload] Failed to upload book:", error);

    return errorResponse(
      "Unable to upload the book.",
      500,
    );
  }
}
'@

Write-Host "Creating Book upload form..." -ForegroundColor Yellow

Write-NoBom "apps\web\components\books\BookUploadForm.tsx" @'
"use client";

import {
  type FormEvent,
  useRef,
  useState,
} from "react";

interface UploadedBook {
  id: string;
  title: string;
  author: string;
  status: string;
  fileUrl: string;
  coverUrl: string | null;
}

interface UploadResponse {
  ok: boolean;
  error?: string;
  errors?: string[];
  book?: UploadedBook;
}

export function BookUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadedBook, setUploadedBook] =
    useState<UploadedBook | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitting(true);
    setErrors([]);
    setUploadedBook(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as UploadResponse;

      if (!response.ok || !data.ok) {
        setErrors(
          data.errors?.length
            ? data.errors
            : [data.error ?? "Unable to upload book."],
        );
        return;
      }

      if (!data.book) {
        setErrors([
          "Book upload completed without a book record.",
        ]);
        return;
      }

      setUploadedBook(data.book);
      formRef.current?.reset();
    } catch {
      setErrors([
        "Could not connect to the book upload service.",
      ]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      data-testid="book-upload-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="book-title" className="block text-sm font-bold text-slate-900">
            Book title
          </label>
          <input
            id="book-title"
            name="title"
            required
            maxLength={200}
            className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm"
            placeholder="Enter book title"
          />
        </div>

        <div>
          <label htmlFor="book-author" className="block text-sm font-bold text-slate-900">
            Author
          </label>
          <input
            id="book-author"
            name="author"
            required
            maxLength={160}
            className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm"
            placeholder="Enter author name"
          />
        </div>

        <div>
          <label htmlFor="book-category" className="block text-sm font-bold text-slate-900">
            Category
          </label>
          <input
            id="book-category"
            name="category"
            maxLength={100}
            className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm"
            placeholder="Education, Poetry, History..."
          />
        </div>

        <div>
          <label htmlFor="book-language" className="block text-sm font-bold text-slate-900">
            Language
          </label>
          <input
            id="book-language"
            name="language"
            maxLength={100}
            className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm"
            placeholder="Arabic, Urdu, English..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="book-description" className="block text-sm font-bold text-slate-900">
          Description
        </label>
        <textarea
          id="book-description"
          name="description"
          rows={5}
          maxLength={5000}
          className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm"
          placeholder="Add a short description of the book..."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <label htmlFor="book-file" className="block text-sm font-bold text-slate-950">
            PDF book
          </label>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            PDF only. Maximum size 25 MB.
          </p>
          <input
            id="book-file"
            data-testid="book-file-input"
            name="bookFile"
            type="file"
            accept=".pdf,application/pdf"
            required
            className="mt-4 block w-full text-sm text-slate-700"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <label htmlFor="book-cover" className="block text-sm font-bold text-slate-950">
            Cover image
          </label>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Optional. JPG, PNG, or WEBP. Maximum 5 MB.
          </p>
          <input
            id="book-cover"
            data-testid="book-cover-input"
            name="coverFile"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="mt-4 block w-full text-sm text-slate-700"
          />
        </div>
      </div>

      {errors.length > 0 ? (
        <div
          data-testid="book-upload-errors"
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4"
        >
          <p className="font-bold text-rose-800">
            Upload could not be completed.
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-700">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {uploadedBook ? (
        <div
          data-testid="book-upload-success"
          role="status"
          className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5"
        >
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-700">
            Upload complete
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            {uploadedBook.title}
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            by {uploadedBook.author}
          </p>

          <p className="mt-3 text-sm font-semibold text-amber-700">
            Status: {uploadedBook.status}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            The book is stored locally for this MVP and is waiting for verification.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          data-testid="book-upload-submit"
          disabled={submitting}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? "Uploading..." : "Upload Book"}
        </button>

        <p className="text-xs leading-5 text-slate-500">
          MVP storage uses this server's local filesystem.
        </p>
      </div>
    </form>
  );
}
'@

Write-Host "Creating books component barrel..." -ForegroundColor Yellow

Write-NoBom "apps\web\components\books\index.ts" @'
export * from "./BookUploadForm";
'@

Write-Host "Creating /books/upload page..." -ForegroundColor Yellow

Write-NoBom "apps\web\app\books\upload\page.tsx" @'
import Link from "next/link";

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
        description="Upload a PDF book for the demo library. New books start as pending and can be verified in a later phase."
        action={
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Back Home
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

Write-Host "Creating local upload folders..." -ForegroundColor Yellow

$uploadDirs = @(
    "apps\web\public\uploads\books\files",
    "apps\web\public\uploads\books\covers"
)

foreach ($dir in $uploadDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force $dir | Out-Null
    }

    New-Item -ItemType File -Path "$dir\.gitkeep" -Force | Out-Null
}

Write-Host "Updating .gitignore for demo uploads..." -ForegroundColor Yellow

$gitignorePath = ".gitignore"

if (Test-Path $gitignorePath) {
    $gitignore = [System.IO.File]::ReadAllText(
        (Resolve-Path $gitignorePath).Path
    ).TrimStart([char]0xFEFF)
}
else {
    $gitignore = ""
}

$uploadIgnoreBlock = @'

# Book Library local demo uploads
apps/web/public/uploads/books/files/*
apps/web/public/uploads/books/covers/*
!apps/web/public/uploads/books/files/.gitkeep
!apps/web/public/uploads/books/covers/.gitkeep
'@

if ($gitignore -notmatch "Book Library local demo uploads") {
    $gitignore = $gitignore.TrimEnd() + $uploadIgnoreBlock + "`r`n"
    Write-NoBom $gitignorePath $gitignore
}

Write-Host "Writing B2 status document..." -ForegroundColor Yellow

Write-NoBom "apps\web\PHASE-BOOKS-B2-STATUS.md" @'
# Book Library B2 Status

## Added

- POST /api/books
- /books/upload
- PDF upload
- Optional cover upload
- Local file storage
- Demo repository provider
- Upload validation
- PDF signature validation

## Local storage

public/uploads/books/files/
public/uploads/books/covers/

New books start as PENDING.

## Next

B3:
- /books
- public verified-book library
- BookCard
- BookGrid
- GET books API
'@

Write-Host ""
Write-Host "Running production web build..." -ForegroundColor Cyan

pnpm --filter "@matn-quiz/web" build

if ($LASTEXITCODE -ne 0) {
    $ok = $false
    Write-Host "Production build FAILED." -ForegroundColor Red
}

if ($ok) {
    git add `
      apps/web/app/api/books `
      apps/web/app/books/upload `
      apps/web/components/books `
      apps/web/lib/books/book-repository-provider.ts `
      apps/web/lib/books/book-upload-request.ts `
      apps/web/public/uploads/books/files/.gitkeep `
      apps/web/public/uploads/books/covers/.gitkeep `
      apps/web/PHASE-BOOKS-B2-STATUS.md `
      .gitignore

    $pending = git status --porcelain

    if ($pending) {
        git commit -m "feat(web): add book upload flow"
    }

    Write-Host ""
    Write-Host "=== BOOK LIBRARY B2 COMPLETE ===" -ForegroundColor Green
    Write-Host "Test: http://localhost:3000/books/upload" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "=== B2 STOPPED ===" -ForegroundColor Red
}

Read-Host "Press Enter to close"
