"use client";

import { Button } from "@/components/ui";
import { ResponsiveCard } from "@/components/layout";
import type { HomePageState } from "./types";

interface QuizSetupSummarySectionProps {
  page: HomePageState;
}

function SummaryMetric({
  label,
  value,
  testId,
  compact = false,
}: {
  label: string;
  value: string | number;
  testId: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p
        data-testid={testId}
        className={
          compact
            ? "mt-2 text-lg font-bold text-slate-950"
            : "mt-2 text-3xl font-bold text-slate-950"
        }
      >
        {value}
      </p>
    </div>
  );
}

export function QuizSetupSummarySection({
  page,
}: QuizSetupSummarySectionProps) {
  const statusText =
    page.generateError ??
    page.historyStatus ??
    (page.canGenerate
      ? "Ready to generate quiz"
      : "Waiting for valid Arabic text and hide count");

  return (
    <ResponsiveCard>
      <section data-testid="quiz-setup-summary" aria-labelledby="quiz-summary-title">
        <div className="space-y-1">
          <h2
            id="quiz-summary-title"
            className="text-2xl font-semibold tracking-tight text-slate-950"
          >
            Quiz Setup Summary
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            These values are used by the unified quiz generator.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryMetric
            label="Arabic Words"
            value={page.stats.arabicWords}
            testId="arabic-word-count"
          />
          <SummaryMetric
            label="Valid Lines"
            value={page.stats.validLines}
            testId="valid-line-count"
          />
          <SummaryMetric
            label="Characters"
            value={page.stats.characters}
            testId="character-count"
          />
          <SummaryMetric
            label="Selected Method"
            value={page.selectedMethod?.label ?? "Hide Words"}
            testId="selected-method"
            compact
          />
          <SummaryMetric
            label="Hide Count"
            value={page.hideCount}
            testId="selected-hide-count"
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600" role="status" aria-live="polite">
            Status:{" "}
            <strong
              className={page.generateError ? "text-red-700" : "text-slate-500"}
            >
              {statusText}
            </strong>
          </p>

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={!page.canGenerate}
            onClick={page.handleGenerate}
          >
            Continue
          </Button>
        </div>
      </section>
    </ResponsiveCard>
  );
}
