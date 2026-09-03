import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "neutral";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  success: "bg-green-50 text-green-700 ring-green-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  error: "bg-red-50 text-red-700 ring-red-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
