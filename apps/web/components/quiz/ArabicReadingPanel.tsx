"use client";

import {
  getArabicReadingDensityClasses,
  getArabicReadingDirection,
  getArabicReadingLanguage,
  getArabicReadingMetaText,
  type ArabicReadingDensity,
} from "@/lib/quiz/arabic-reading";
import {
  focusRingClasses,
  getReadingPanelAriaLabel,
} from "@/lib/ui/accessibility";
import { cn } from "@/lib/utils/cn";

interface ArabicReadingPanelProps {
  title: string;
  text: string;
  description?: string;
  density?: ArabicReadingDensity;
  testId?: string;
  textTestId?: string;
  className?: string;
}

export function ArabicReadingPanel({
  title,
  text,
  description,
  density = "comfortable",
  testId = "arabic-reading-panel",
  textTestId = "arabic-reading-text",
  className,
}: ArabicReadingPanelProps) {
  return (
    <section data-testid={testId} className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-950">{title}</h3>

          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {description}
            </p>
          )}
        </div>

        <p
          data-testid={`${testId}-meta`}
          className="text-xs font-medium uppercase tracking-wide text-slate-500"
        >
          {getArabicReadingMetaText(text)}
        </p>
      </div>

      <div
        data-testid={textTestId}
        aria-label={getReadingPanelAriaLabel(title)}
        tabIndex={0}
        dir={getArabicReadingDirection()}
        lang={getArabicReadingLanguage()}
        className={cn(
          "arabic-text whitespace-pre-wrap rounded-3xl border border-slate-200 bg-slate-50 p-5 text-right font-medium text-slate-950 shadow-inner shadow-slate-200/60 sm:p-6",
          getArabicReadingDensityClasses(density),
          focusRingClasses,
        )}
      >
        {text}
      </div>
    </section>
  );
}
