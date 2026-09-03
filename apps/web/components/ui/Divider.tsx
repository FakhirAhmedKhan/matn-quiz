import { cn } from "@/lib/utils/cn";

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return (
    <div
      role="separator"
      className={cn("h-px w-full bg-slate-200", className)}
    />
  );
}
