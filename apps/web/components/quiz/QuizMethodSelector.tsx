"use client";

import type { ReactNode } from "react";
import { FileText, Type } from "lucide-react";
import { RadioCard } from "@/components/ui/RadioCard";
import { QUIZ_METHOD_OPTIONS, QUIZ_METHODS } from "@/lib/constants/quiz";
import { cn } from "@/lib/utils/cn";
import type { QuizMethod } from "@/types/quiz";

interface QuizMethodSelectorProps {
  value: QuizMethod;
  onChange: (value: QuizMethod) => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

const methodIcons: Record<QuizMethod, ReactNode> = {
  [QUIZ_METHODS.HIDE_WORD]: <Type className="h-5 w-5" />,
  [QUIZ_METHODS.HIDE_LINE]: <FileText className="h-5 w-5" />,
};

export function QuizMethodSelector({
  value,
  onChange,
  disabled = false,
  className,
  title = "Quiz Method",
  description = "Choose how the quiz should hide content from the text.",
}: QuizMethodSelectorProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h2 className="text-xl font-semibold text-slate-950">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Quiz method"
        className="grid gap-4 sm:grid-cols-2"
      >
        {QUIZ_METHOD_OPTIONS.map((option) => (
          <RadioCard
            key={option.value}
            title={option.label}
            description={option.description}
            value={option.value}
            selected={value === option.value}
            disabled={disabled}
            icon={methodIcons[option.value]}
            onSelect={(selectedValue) => {
              onChange(selectedValue as QuizMethod);
            }}
          />
        ))}
      </div>
    </section>
  );
}
