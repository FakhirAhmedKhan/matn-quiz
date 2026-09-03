"use client";

import { Clipboard, Download, FileJson, Upload } from "lucide-react";
import { useState } from "react";
import {
  copyShareableQuizJsonToClipboard,
  exportShareableQuizAsJsonFile,
} from "@/lib/quiz/shareable-quiz-export";
import {
  getImportShareableQuizIssueSummary,
  validateImportedShareableQuizText,
} from "@/lib/quiz/shareable-quiz-import";
import {
  getShareableQuizDocumentSummary,
  type ShareableQuizDocument,
} from "@/lib/quiz/shareable-quiz";
import {
  focusRingClasses,
  interactiveTransitionClasses,
  pressableClasses,
} from "@/lib/ui/accessibility";
import { cn } from "@/lib/utils/cn";
import type { GeneratedQuiz } from "@/types/quiz";

interface ShareableQuizPanelProps {
  quiz: GeneratedQuiz | null;
  onImportQuiz: (quiz: GeneratedQuiz, document: ShareableQuizDocument) => void;
  className?: string;
}

type ShareableQuizStatus =
  | "idle"
  | "exported"
  | "copied"
  | "copy-failed"
  | "imported"
  | "import-failed";

export function ShareableQuizPanel({
  quiz,
  onImportQuiz,
  className,
}: ShareableQuizPanelProps) {
  const [importText, setImportText] = useState("");
  const [status, setStatus] = useState<ShareableQuizStatus>("idle");
  const [message, setMessage] = useState<string | undefined>();

  const hasQuiz = Boolean(quiz);
  const hasImportText = importText.trim().length > 0;

  const handleExportJson = () => {
    if (!quiz) {
      setStatus("import-failed");
      setMessage("Generate or import a quiz before exporting JSON.");
      return;
    }

    const exported = exportShareableQuizAsJsonFile(quiz);

    setStatus(exported ? "exported" : "import-failed");
    setMessage(
      exported
        ? "Shareable JSON file exported."
        : "JSON export is not available in this browser.",
    );
  };

  const handleCopyJson = async () => {
    if (!quiz) {
      setStatus("copy-failed");
      setMessage("Generate or import a quiz before copying JSON.");
      return;
    }

    const copied = await copyShareableQuizJsonToClipboard(quiz);

    setStatus(copied ? "copied" : "copy-failed");
    setMessage(
      copied
        ? "Shareable JSON copied."
        : "JSON copy is not available in this browser.",
    );
  };

  const handleImportJson = () => {
    const result = validateImportedShareableQuizText(importText);

    if (!result.valid) {
      setStatus("import-failed");
      setMessage(getImportShareableQuizIssueSummary(result.issues));
      return;
    }

    onImportQuiz(result.quiz, result.document);
    setStatus("imported");
    setMessage(`Imported quiz opened. ${getShareableQuizDocumentSummary(result.document)}`);
  };

  const handleResetImport = () => {
    setImportText("");
    setStatus("idle");
    setMessage(undefined);
  };

  const actionButtonClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
    focusRingClasses,
    interactiveTransitionClasses,
    pressableClasses,
  );

  return (
    <section
      data-testid="shareable-quiz-panel"
      aria-label="Import and export quiz JSON"
      className={cn("space-y-5", className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Import / Export Quiz JSON
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Export the current quiz as shareable JSON or paste a Matn Quiz JSON
            export to reopen it.
          </p>
        </div>

        <span
          data-testid="shareable-quiz-state"
          className={cn(
            "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold",
            hasQuiz
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-slate-200 bg-slate-50 text-slate-600",
          )}
        >
          {hasQuiz ? "Quiz ready" : "No quiz yet"}
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <FileJson className="h-4 w-4" />
          Export current quiz
        </div>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          Export JSON keeps the original text, hidden quiz text, method, answers,
          and metadata.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!hasQuiz}
            onClick={handleExportJson}
            className={cn(
              actionButtonClasses,
              "bg-emerald-700 text-white hover:bg-emerald-800",
            )}
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>

          <button
            type="button"
            disabled={!hasQuiz}
            onClick={handleCopyJson}
            className={cn(
              actionButtonClasses,
              "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700",
            )}
          >
            <Clipboard className="h-4 w-4" />
            Copy JSON
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <Upload className="h-4 w-4" />
          Import quiz JSON
        </div>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          Paste a JSON export created by Matn Quiz, then open it in the study UI.
        </p>

        <textarea
          data-testid="shareable-import-textarea"
          value={importText}
          onChange={(event) => {
            setImportText(event.target.value);
            setStatus("idle");
            setMessage(undefined);
          }}
          className="mt-4 min-h-36 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          placeholder='Paste Matn Quiz JSON here, for example: {"appId":"matn-quiz", ...}'
          spellCheck={false}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!hasImportText}
            onClick={handleImportJson}
            className={cn(
              actionButtonClasses,
              "bg-slate-950 text-white hover:bg-slate-800",
            )}
          >
            <Upload className="h-4 w-4" />
            Open Imported Quiz
          </button>

          <button
            type="button"
            disabled={!hasImportText && !message}
            onClick={handleResetImport}
            className={cn(
              actionButtonClasses,
              "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950",
            )}
          >
            Reset Import
          </button>
        </div>
      </div>

      {message && (
        <p
          data-testid="shareable-quiz-status"
          role="status"
          aria-live="polite"
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            status === "import-failed" || status === "copy-failed"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-800",
          )}
        >
          {message}
        </p>
      )}
    </section>
  );
}
