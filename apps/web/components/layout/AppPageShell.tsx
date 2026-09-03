import type { ReactNode } from "react";

import { AppBottomNav } from "./AppBottomNav";
import { AppTopNav } from "./AppTopNav";

interface AppPageShellProps {
  children: ReactNode;
  className?: string;
}

export function AppPageShell({ children, className = "" }: AppPageShellProps) {
  return (
    <div
      data-testid="app-page-shell"
      className="min-h-dvh bg-slate-50 pb-24 text-slate-950 md:pb-0"
    >
      <AppTopNav />

      <main
        data-testid="app-page-content"
        className={[
          "mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8",
          className,
        ].join(" ")}
      >
        {children}
      </main>

      <AppBottomNav />
    </div>
  );
}