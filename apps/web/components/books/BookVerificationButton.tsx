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