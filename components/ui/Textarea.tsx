"use client";

import type { TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rtl?: boolean;
}

export function Textarea({
  label,
  error,
  helperText,
  rtl = false,
  className,
  id,
  name,
  maxLength,
  value,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? name ?? generatedId;
  const descriptionId = error
    ? `${textareaId}-error`
    : helperText
      ? `${textareaId}-helper`
      : undefined;

  const valueLength =
    typeof value === "string"
      ? value.length
      : typeof props.defaultValue === "string"
        ? props.defaultValue.length
        : 0;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-slate-800"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        name={name}
        dir={rtl ? "rtl" : "ltr"}
        maxLength={maxLength}
        value={value}
        className={cn(
          "min-h-36 w-full resize-y rounded-2xl border bg-white px-4 py-3 text-sm text-slate-950 shadow-sm transition",
          "placeholder:text-slate-400",
          "focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          rtl && "arabic-text text-right text-xl leading-loose",
          error ? "border-red-400" : "border-slate-300",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        {...props}
      />

      <div className="flex items-center justify-between gap-4">
        <div>
          {error && (
            <p id={`${textareaId}-error`} className="text-sm text-red-600">
              {error}
            </p>
          )}

          {!error && helperText && (
            <p id={`${textareaId}-helper`} className="text-sm text-slate-500">
              {helperText}
            </p>
          )}
        </div>

        {maxLength && (
          <p className="shrink-0 text-xs text-slate-400">
            {valueLength}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
