"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  getPoemDisplayTitle,
  hasPoemText,
  splitPoemIntoColumns,
  splitPoemLines,
  type PoemDraft,
  type PoemLayout,
} from "@/lib/poem/poem-storage";

interface PoemReaderProps {
  draft: PoemDraft;
  onLayoutChange?: (layout: PoemLayout) => void;
  onFontSizeChange?: (fontSize: number) => void;
  onClear?: () => void;
}

function PoemLine({ children }: { children: string }) {
  return (
    <p className="min-h-9 text-right leading-[2.25] tracking-wide text-slate-950 sm:min-h-10">
      {children}
    </p>
  );
}

export function PoemReader({
  draft,
  onLayoutChange,
  onFontSizeChange,
  onClear,
}: PoemReaderProps) {
  const [copyStatus, setCopyStatus] = useState("");

  const title = getPoemDisplayTitle(draft);
  const hasText = hasPoemText(draft);
  const lines = useMemo(() => splitPoemLines(draft.text), [draft.text]);
  const columns = useMemo(() => splitPoemIntoColumns(draft.text), [draft.text]);

  async function handleCopyPoem() {
    const textToCopy = `${title}\n\n${draft.text}`.trim();

    try {
      await navigator.clipboard?.writeText(textToCopy);
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Copy failed");
    }
  }

  function handlePrintPoem() {
    window.print();
  }

  if (!hasText) {
    return (
      <div
        data-testid="poem-reader-empty"
        className="rounded-4xl border border-dashed border-slate-300 bg-white p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-slate-950">No poem yet</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
          Paste a poem first, then open the reader to view it in a clean
          page-style layout.
        </p>
        <Link
          href="/poem"
          data-testid="poem-empty-back-link"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Add poem
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="poem-reader" className="space-y-5">
      <div
        data-testid="poem-reader-toolbar"
        className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            Reader Controls
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            {lines.length} lines ·{" "}
            {draft.layout === "TWO_COLUMN" ? "Two column" : "Single column"} ·{" "}
            {draft.fontSize}px
          </p>
          {copyStatus ? (
            <p
              data-testid="poem-copy-status"
              role="status"
              className="mt-1 text-xs font-bold text-emerald-700"
            >
              {copyStatus}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <Link
            href="/poem"
            data-testid="poem-edit-link"
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Edit
          </Link>

          <button
            type="button"
            data-testid="reader-copy-button"
            onClick={handleCopyPoem}
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Copy
          </button>

          <button
            type="button"
            data-testid="reader-print-button"
            onClick={handlePrintPoem}
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Print
          </button>

          <button
            type="button"
            data-testid="reader-single-column-button"
            onClick={() => onLayoutChange?.("SINGLE_COLUMN")}
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Single
          </button>

          <button
            type="button"
            data-testid="reader-two-column-button"
            onClick={() => onLayoutChange?.("TWO_COLUMN")}
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Two
          </button>

          <button
            type="button"
            data-testid="reader-font-decrease"
            onClick={() => onFontSizeChange?.(draft.fontSize - 2)}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            −
          </button>

          <button
            type="button"
            data-testid="reader-font-increase"
            onClick={() => onFontSizeChange?.(draft.fontSize + 2)}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            +
          </button>

          <button
            type="button"
            data-testid="reader-clear-button"
            onClick={onClear}
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 shadow-sm transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Clear
          </button>
        </div>
      </div>

      <article
        data-testid="poem-reader-page"
        dir="rtl"
        lang="ur"
        className="rounded-4xl border border-slate-200 bg-[#fffdf7] px-4 py-7 shadow-sm shadow-slate-200/70 sm:px-8 sm:py-9 lg:px-12 print:border-0 print:bg-white print:shadow-none"
      >
        <header className="mb-7 text-center sm:mb-9">
          <h2
            data-testid="poem-reader-title"
            className="text-3xl font-bold tracking-tight text-slate-950"
          >
            {title}
          </h2>
        </header>

        {draft.layout === "TWO_COLUMN" ? (
          <div
            data-testid="poem-two-column-layout"
            className="grid gap-5 md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)]"
            style={{ fontSize: `${draft.fontSize}px`, direction: "ltr" }}
          >
            <div
              data-testid="poem-left-column"
              dir="rtl"
              className="space-y-1 text-right"
            >
              {columns.leftColumn.map((line, index) => (
                <PoemLine key={`${line}-${index}`}>{line}</PoemLine>
              ))}
            </div>

            <div
              aria-hidden="true"
              data-testid="poem-center-space"
              className="hidden border-x border-dashed border-slate-200/70 md:block"
            />

            <div
              data-testid="poem-right-column"
              dir="rtl"
              className="space-y-1 text-right"
            >
              {columns.rightColumn.map((line, index) => (
                <PoemLine key={`${line}-${index}`}>{line}</PoemLine>
              ))}
            </div>
          </div>
        ) : (
          <div
            data-testid="poem-single-column-layout"
            className="mx-auto max-w-3xl space-y-1 text-right"
            style={{ fontSize: `${draft.fontSize}px` }}
          >
            {lines.map((line, index) => (
              <PoemLine key={`${line}-${index}`}>{line}</PoemLine>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}