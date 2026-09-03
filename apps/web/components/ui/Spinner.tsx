import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2
        className={cn("h-4 w-4 animate-spin text-current", className)}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
