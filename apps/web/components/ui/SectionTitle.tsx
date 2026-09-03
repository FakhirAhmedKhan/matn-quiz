import { cn } from "@/lib/utils/cn";

interface SectionTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionTitle({
  title,
  description,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>

      {description && (
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}
