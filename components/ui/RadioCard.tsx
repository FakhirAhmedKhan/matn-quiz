"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface RadioCardProps {
  title: string;
  description?: string;
  value: string;
  selected: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  onSelect: (value: string) => void;
  className?: string;
}

export function RadioCard({
  title,
  description,
  value,
  selected,
  icon,
  disabled = false,
  onSelect,
  className,
}: RadioCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(value)}
      className={cn(
        "flex w-full items-start gap-4 rounded-2xl border bg-white p-5 text-left shadow-sm transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2",
        selected
          ? "border-emerald-600 ring-2 ring-emerald-100"
          : "border-slate-200 hover:border-emerald-300",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <span
        className={cn(
          "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-emerald-700" : "border-slate-300",
        )}
        aria-hidden="true"
      >
        {selected && (
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
        )}
      </span>

      {icon && (
        <span className="mt-0.5 shrink-0 text-emerald-700">
          {icon}
        </span>
      )}

      <span>
        <span className="block font-semibold text-slate-950">
          {title}
        </span>

        {description && (
          <span className="mt-1 block text-sm leading-6 text-slate-600">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}
