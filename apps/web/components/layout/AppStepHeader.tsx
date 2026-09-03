import type { ReactNode } from "react";

interface AppStepHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function AppStepHeader({
  eyebrow,
  title,
  description,
  action,
}: AppStepHeaderProps) {
  return (
    <div
      data-testid="app-step-header"
      className="mb-5 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p
            data-testid="app-step-eyebrow"
            className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700"
          >
            {eyebrow}
          </p>
        ) : null}

        <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          {action}
        </div>
      ) : null}
    </div>
  );
}