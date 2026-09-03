"use client";

import Link from "next/link";

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

          <Link
            href={`/books/${uploadedBook.id}`}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Review & Verify
          </Link>
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