"use client";

import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className,
  id,
  name,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const descriptionId = error
    ? `${inputId}-error`
    : helperText
      ? `${inputId}-helper`
      : undefined;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-800"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        className={cn(
          "h-11 w-full rounded-xl border bg-white px-4 text-sm text-slate-950 shadow-sm transition",
          "placeholder:text-slate-400",
          "focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          error ? "border-red-400" : "border-slate-300",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-sm text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
