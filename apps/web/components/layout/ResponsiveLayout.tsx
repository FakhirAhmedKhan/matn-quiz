import type { ReactNode } from "react";

import { AppBottomNav } from "./AppBottomNav";
import { AppTopNav } from "./AppTopNav";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

interface AppContainerProps {
  children: ReactNode;
  className?: string;
}

interface AppHeroProps {
  title: string;
  description?: string;
  className?: string;
}

interface ResponsiveCardGridProps {
  children: ReactNode;
  className?: string;
}

interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

interface ResponsiveTwoColumnSectionProps {
  children: ReactNode;
  className?: string;
}

interface MobileActionZoneProps {
  children: ReactNode;
  sticky?: boolean;
  className?: string;
}

export function AppShell({ children, className = "" }: AppShellProps) {
  return (
    <main
      data-testid="app-shell"
      className={[
        "min-h-dvh overflow-x-hidden bg-slate-50 text-slate-950",
        "bg-[radial-gradient(circle_at_top,#ecfdf5_0%,#f8fafc_42%,#f8fafc_100%)]",
        className,
      ].join(" ")}
    >
      <a
        data-testid="skip-to-content-link"
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-emerald-700 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <div
        data-testid="app-safe-area"
        className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6"
      >
        {children}
      </div>
    </main>
  );
}

export function AppContainer({ children, className = "" }: AppContainerProps) {
  return (
    <div
      id="main-content"
      tabIndex={-1}
      data-testid="app-container"
      className={[
        "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 focus:outline-none",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function AppHero({ title, description, className = "" }: AppHeroProps) {
  return (
    <section
      data-testid="app-hero"
      aria-labelledby="app-hero-title"
      className={[
        "mx-auto max-w-3xl py-4 text-center sm:py-6 scroll-mt-24 sm:scroll-mt-28",
        className,
      ].join(" ")}
    >
      <h1
        id="app-hero-title"
        data-testid="app-hero-title"
        className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl"
      >
        {title}
      </h1>

      {description ? (
        <p
          data-testid="app-hero-description"
          className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg"
        >
          {description}
        </p>
      ) : null}

      <a
        data-testid="hero-main-content-anchor"
        href="#main-content"
        className="sr-only"
      >
        Continue to main content
      </a>
    </section>
  );
}

export function ResponsiveCardGrid({
  children,
  className = "",
}: ResponsiveCardGridProps) {
  return (
    <div
      data-testid="responsive-card-grid"
      className={[
        "mx-auto mt-8 max-w-4xl sm:mt-10 lg:mt-12 space-y-3 space-y-6 sm:space-y-4",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function ResponsiveCard({
  children,
  className = "",
  ariaLabel,
}: ResponsiveCardProps) {
  return (
    <section
      data-testid="responsive-card"
      aria-label={ariaLabel}
      className={[
        "rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60",
        "p-6 scroll-mt-24 sm:scroll-mt-28",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

export function ResponsiveTwoColumnSection({
  children,
  className = "",
}: ResponsiveTwoColumnSectionProps) {
  return (
    <div
      data-testid="responsive-two-column-section"
      className={[
        "grid gap-6 lg:grid-cols-[1.2fr_0.8fr]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function MobileActionZone({
  children,
  sticky = false,
  className = "",
}: MobileActionZoneProps) {
  return (
    <div
      data-testid="mobile-action-zone"
      className={[
        sticky
          ? "sticky bottom-0 z-30 -mx-5 mt-6 grid gap-3 border-t border-slate-200 bg-white/90 p-4 backdrop-blur sm:-mx-6"
          : "mt-6 grid gap-3 sm:flex sm:flex-row sm:items-center sm:justify-end",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}