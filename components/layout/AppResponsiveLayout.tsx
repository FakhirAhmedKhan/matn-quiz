import type { ReactNode } from "react";
import {
  appContainerClasses,
  appSectionStackClasses,
  appShellClasses,
  getAppCardClasses,
} from "@/lib/ui/design-system";
import { cn } from "@/lib/utils/cn";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

interface AppContainerProps {
  children: ReactNode;
  className?: string;
}

interface AppHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}

interface ResponsiveCardGridProps {
  children: ReactNode;
  className?: string;
}

interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <main data-testid="app-shell" className={cn(appShellClasses, className)}>
      {children}
    </main>
  );
}

export function AppContainer({ children, className }: AppContainerProps) {
  return (
    <div data-testid="app-container" className={cn(appContainerClasses, className)}>
      {children}
    </div>
  );
}

export function AppHero({
  eyebrow = "Matn Quiz",
  title,
  description,
  className,
}: AppHeroProps) {
  return (
    <section
      data-testid="app-hero"
      className={cn("mx-auto max-w-3xl text-center", className)}
    >
      <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800">
        {eyebrow}
      </p>

      <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
        {title}
      </h1>

      <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
        {description}
      </p>
    </section>
  );
}

export function ResponsiveCardGrid({
  children,
  className,
}: ResponsiveCardGridProps) {
  return (
    <div
      data-testid="responsive-card-grid"
      className={cn(appSectionStackClasses, "mx-auto mt-10 max-w-4xl sm:mt-12", className)}
    >
      {children}
    </div>
  );
}

export function ResponsiveCard({ children, className }: ResponsiveCardProps) {
  return (
    <section data-testid="responsive-card" className={cn(getAppCardClasses("md"), className)}>
      {children}
    </section>
  );
}
