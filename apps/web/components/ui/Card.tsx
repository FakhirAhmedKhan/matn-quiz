import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Card({
  title,
  description,
  children,
  footer,
  className,
}: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      {(title || description) && (
        <header className="mb-5">
          {title && (
            <h2 className="text-xl font-semibold text-slate-950">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {description}
            </p>
          )}
        </header>
      )}

      {children}

      {footer && (
        <footer className="mt-6 border-t border-slate-100 pt-5">
          {footer}
        </footer>
      )}
    </section>
  );
}
