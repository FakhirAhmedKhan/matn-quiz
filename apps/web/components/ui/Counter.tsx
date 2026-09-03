"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CounterProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  onChange: (value: number) => void;
  className?: string;
}

export function Counter({
  value,
  min = 1,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  disabled = false,
  label,
  onChange,
  className,
}: CounterProps) {
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  const decrease = () => {
    if (!canDecrease) return;
    onChange(Math.max(min, value - step));
  };

  const increase = () => {
    if (!canIncrease) return;
    onChange(Math.min(max, value + step));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <p className="text-sm font-medium text-slate-800">
          {label}
        </p>
      )}

      <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={decrease}
          disabled={!canDecrease}
          aria-label="Decrease value"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="min-w-12 px-4 text-center text-base font-semibold text-slate-950">
          {value}
        </span>

        <button
          type="button"
          onClick={increase}
          disabled={!canIncrease}
          aria-label="Increase value"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {Number.isFinite(max) && max !== Number.MAX_SAFE_INTEGER && (
        <p className="text-xs text-slate-500">
          Maximum: {max}
        </p>
      )}
    </div>
  );
}
