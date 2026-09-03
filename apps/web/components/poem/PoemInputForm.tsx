"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  clearPoemDraft,
  createPoemDraft,
  hasPoemText,
  loadPoemDraft,
  savePoemDraft,
  type PoemDraft,
  type PoemLayout,
} from "@/lib/poem/poem-storage";

const samplePoem = `ÛØ¯ÛŒÛ Ø³Ù„Ø§Ù…
Ø¢Ù…Ø¯Ø§Ø± Ù†Ø¨ÙˆØª Ù¾Û Ù„Ø§Ú©Ú¾ÙˆÚº Ø³Ù„Ø§Ù…
Ø±ÙˆØ­ Ø¨Ø²Ù… Ø±Ø³Ø§Ù„Øª Ù¾Û Ù„Ø§Ú©Ú¾ÙˆÚº Ø³Ù„Ø§Ù…
Ø§ÛŒØ³Û’ Ù†ÙˆØ±ÛŒ Ø¬Ù…Ø§Ù„Øª Ù¾Û Ù„Ø§Ú©Ú¾ÙˆÚº Ø³Ù„Ø§Ù…
Ù…Ø¸ÛØ± Ø°Ø§Øª Ù‚Ø¯Ø±Øª Ù¾Û Ù„Ø§Ú©Ú¾ÙˆÚº Ø³Ù„Ø§Ù…`;

export function PoemInputForm() {
  const [draft, setDraft] = useState<PoemDraft>(() => createPoemDraft());

  useEffect(() => {
    setDraft(loadPoemDraft());
  }, []);

  function updateDraft(nextDraft: Partial<PoemDraft>) {
    setDraft(savePoemDraft(nextDraft));
  }

  function handleLayoutChange(layout: PoemLayout) {
    updateDraft({ layout });
  }

  function handleFontSizeChange(fontSize: number) {
    updateDraft({ fontSize });
  }

  function handleClear() {
    setDraft(clearPoemDraft());
  }

  function handleLoadSample() {
    setDraft(
      savePoemDraft({
        title: "ÛØ¯ÛŒÛ Ø³Ù„Ø§Ù…",
        text: samplePoem,
        layout: "TWO_COLUMN",
        fontSize: 30,
      }),
    );
  }

  const canOpenReader = hasPoemText(draft);

  return (
    <div data-testid="poem-input-form" className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <div>
            <label
              htmlFor="poem-title"
              className="block text-sm font-bold text-slate-900"
            >
              Poem title
            </label>
            <input
              id="poem-title"
              data-testid="poem-title-input"
              value={draft.title}
              onChange={(event) => updateDraft({ title: event.target.value })}
              placeholder="Ù…Ø«Ù„Ø§Ù‹: ÛØ¯ÛŒÛ Ø³Ù„Ø§Ù…"
              dir="rtl"
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-right text-lg font-semibold text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="poem-text"
              className="block text-sm font-bold text-slate-900"
            >
              Poem text
            </label>
            <textarea
              id="poem-text"
              data-testid="poem-text-input"
              value={draft.text}
              onChange={(event) => updateDraft({ text: event.target.value })}
              placeholder="Ø§Ù¾Ù†ÛŒ Ù†Ø¸Ù…ØŒ Ù†Ø¹ØªØŒ Ø³Ù„Ø§Ù… ÛŒØ§ Ø´Ø¹Ø± ÛŒÛØ§Úº Ù¾ÛŒØ³Ù¹ Ú©Ø±ÛŒÚº..."
              dir="rtl"
              lang="ur"
              rows={12}
              className="mt-2 w-full resize-y rounded-3xl border border-slate-300 bg-white px-5 py-4 text-right text-2xl leading-loose text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
              <span data-testid="poem-character-count">
                Characters: {draft.text.length}
              </span>
              <span>Direction: RTL</span>
            </div>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-bold text-slate-950">Reader settings</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose how the poem should appear in the reader.
          </p>

          <fieldset className="mt-5 space-y-3">
            <legend className="text-sm font-bold text-slate-900">
              Layout
            </legend>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300">
              <input
                type="radio"
                aria-label="Two column"
                name="poem-layout"
                value="TWO_COLUMN"
                checked={draft.layout === "TWO_COLUMN"}
                onChange={() => handleLayoutChange("TWO_COLUMN")}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-bold text-slate-950">
                  Two column
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Best for nazm, naat, salam, and page-style reading.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300">
              <input
                type="radio"
                aria-label="Single column"
                name="poem-layout"
                value="SINGLE_COLUMN"
                checked={draft.layout === "SINGLE_COLUMN"}
                onChange={() => handleLayoutChange("SINGLE_COLUMN")}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-bold text-slate-950">
                  Single column
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Best for mobile reading and short poems.
                </span>
              </span>
            </label>
          </fieldset>

          <div className="mt-6">
            <p className="text-sm font-bold text-slate-900">Font size</p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                data-testid="poem-font-decrease"
                onClick={() => handleFontSizeChange(draft.fontSize - 2)}
                className="flex size-10 items-center justify-center rounded-2xl border border-slate-300 bg-white text-lg font-bold text-slate-700 transition hover:bg-slate-50"
              >
                âˆ’
              </button>

              <div
                data-testid="poem-font-size"
                className="min-w-16 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-center text-sm font-bold text-slate-950"
              >
                {draft.fontSize}px
              </div>

              <button
                type="button"
                data-testid="poem-font-increase"
                onClick={() => handleFontSizeChange(draft.fontSize + 2)}
                className="flex size-10 items-center justify-center rounded-2xl border border-slate-300 bg-white text-lg font-bold text-slate-700 transition hover:bg-slate-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <Link
              href="/poem/read"
              data-testid="poem-open-reader-link"
              aria-disabled={!canOpenReader}
              className={[
                "inline-flex min-h-11 items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                canOpenReader
                  ? "bg-emerald-700 text-white shadow-emerald-900/20 hover:bg-emerald-800"
                  : "pointer-events-none bg-slate-200 text-slate-500",
              ].join(" ")}
            >
              Open Reader
            </Link>

            <button
              type="button"
              data-testid="poem-load-sample-button"
              onClick={handleLoadSample}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Load sample
            </button>

            <button
              type="button"
              data-testid="poem-clear-button"
              onClick={handleClear}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-bold text-rose-700 shadow-sm transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              Clear poem
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}