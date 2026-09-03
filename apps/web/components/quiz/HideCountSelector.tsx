"use client";

import { useMemo } from "react";
import { Counter } from "@/components/ui/Counter";
import { cn } from "@/lib/utils/cn";
import {
  getHideCountLimits,
  normalizeHideCount,
} from "@/lib/quiz/hide-count";
import type { QuizMethod } from "@/types/quiz";

interface HideCountSelectorProps {
  value: number;
  text: string;
  method: QuizMethod;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function HideCountSelector({
  value,
  text,
  method,
  onChange,
  disabled = false,
  className,
}: HideCountSelectorProps) {
  const limits = useMemo(
    () => getHideCountLimits(text, method),
    [text, method],
  );

  const isDisabled = disabled || limits.disabled;

  const safeValue = limits.disabled
    ? limits.defaultValue
    : normalizeHideCount(value, text, method);

  const handleChange = (nextValue: number) => {
    if (isDisabled) return;

    onChange(normalizeHideCount(nextValue, text, method));
  };

  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h2 className="text-xl font-semibold text-slate-950">
          {limits.label}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {limits.helperText}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <Counter
          value={safeValue}
          min={limits.min}
          max={limits.max}
          disabled={isDisabled}
          onChange={handleChange}
        />

        <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
          <p>
            Minimum:{" "}
            <strong className="font-semibold text-slate-950">
              {limits.min}
            </strong>
          </p>

          <p>
            Maximum:{" "}
            <strong
              data-testid="hide-count-max"
              className="font-semibold text-slate-950"
            >
              {limits.max}
            </strong>
          </p>

          <p>
            Available:{" "}
            <strong
              data-testid="available-hide-count"
              className="font-semibold text-slate-950"
            >
              {limits.available}
            </strong>
          </p>
        </div>

        {isDisabled && (
          <p
            data-testid="hide-count-disabled-message"
            className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700"
          >
            Add valid Arabic text before choosing how much content to hide.
          </p>
        )}
      </div>
    </section>
  );
}
