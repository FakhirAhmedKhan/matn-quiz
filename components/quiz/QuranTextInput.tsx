"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils/cn";

interface QuranTextInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  showClearButton?: boolean;
  className?: string;
}

export function QuranTextInput({
  value,
  onChange,
  label = "Paste Quran or Matn Text",
  placeholder = "اكتب أو الصق النص العربي هنا...",
  helperText = "Paste Arabic Quran or Islamic matn text. The text will be preserved exactly as entered.",
  error,
  disabled = false,
  maxLength = 5000,
  rows = 10,
  showClearButton = true,
  className,
}: QuranTextInputProps) {
  const hasValue = value.trim().length > 0;

  const handleClear = () => {
    if (disabled) return;
    onChange("");
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            {label}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {helperText}
          </p>
        </div>

        {showClearButton && hasValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={handleClear}
          >
            Clear
          </Button>
        )}
      </div>

      <Textarea
        id="quran-text-input"
        name="quranText"
        rtl
        rows={rows}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        error={error}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-72 text-2xl leading-loose"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span>
          Characters:{" "}
          <strong className="font-semibold text-slate-950">
            {value.length}
          </strong>
        </span>

        <span>
          Limit:{" "}
          <strong className="font-semibold text-slate-950">
            {maxLength}
          </strong>
        </span>

        <span>
          Direction:{" "}
          <strong className="font-semibold text-slate-950">
            RTL
          </strong>
        </span>
      </div>
    </div>
  );
}
