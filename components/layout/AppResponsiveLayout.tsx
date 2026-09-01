import type { ReactNode } from "react";
import { AccessibleSkipLink } from "@/components/ui/AccessibleSkipLink";
import {
  getMainContentId,
  getSkipLinkHref,
} from "@/lib/ui/accessibility-final-pass";
import {
  getMobileActionLayoutClasses,
  getMobileCardClasses,
  getMobileScrollMarginClasses,
  getMobileSpacingClasses,
  mobileReadableContainerClasses,
  mobileSafeAreaClasses,
  mobileStickyActionBarClasses,
  mobileViewportClasses,
  type MobileActionLayout,
  type MobileSpacingSize,
} from "@/lib/ui/mobile-ux";
import { cn } from "@/lib/utils/cn";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

interface AppContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

interface AppHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}

interface ResponsiveCardGridProps {
  children: ReactNode;
  spacing?: MobileSpacingSize;
  className?: string;
}

interface ResponsiveCardProps {
  children: ReactNode;
  spacing?: MobileSpacingSize;
  className?: string;
  ariaLabel?: string;
}

interface ResponsiveTwoColumnSectionProps {
  children: ReactNode;
  className?: string;
}

interface MobileActionZoneProps {
  children: ReactNode;
  layout?: MobileActionLayout;
  sticky?: boolean;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <main
      data-testid="app-shell"
      className={cn(
        mobileViewportClasses,
        "bg-[radial-gradient(circle_at_top,_#ecfdf5_0%,_#f8fafc_42%,_#f8fafc_100%)]",
        className,
      )}
    >
      <AccessibleSkipLink targetId={getMainContentId()} />

      <div data-testid="app-safe-area" className={mobileSafeAreaClasses}>
        {children}
      </div>
    </main>
  );
}

export function AppContainer({
  children,
  className,
  id = getMainContentId(),
}: AppContainerProps) {
  return (
    <div
      id={id}
      data-testid="app-container"
      tabIndex={-1}
      className={cn(mobileReadableContainerClasses, "focus:outline-none", className)}
    >
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
      aria-labelledby="app-hero-title"
      className={cn(
        "mx-auto max-w-3xl py-4 text-center sm:py-6",
        getMobileScrollMarginClasses(),
        className,
      )}
    >
      <p
        data-testid="app-hero-eyebrow"
        className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-800 sm:text-sm"
      >
        {eyebrow}
      </p>

      <h1
        id="app-hero-title"
        data-testid="app-hero-title"
        className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl"
      >
        {title}
      </h1>

      <p
        data-testid="app-hero-description"
        className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg"
      >
        {description}
      </p>

      <a
        data-testid="hero-main-content-anchor"
        href={getSkipLinkHref()}
        className="sr-only"
      >
        Continue to main content
      </a>
    </section>
  );
}

export function ResponsiveCardGrid({
  children,
  spacing = "spacious",
  className,
}: ResponsiveCardGridProps) {
  return (
    <div
      data-testid="responsive-card-grid"
      className={cn(
        "mx-auto mt-8 max-w-4xl sm:mt-10 lg:mt-12",
        getMobileSpacingClasses(spacing),
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ResponsiveCard({
  children,
  spacing = "comfortable",
  className,
  ariaLabel,
}: ResponsiveCardProps) {
  return (
    <section
      data-testid="responsive-card"
      aria-label={ariaLabel}
      className={cn(
        getMobileCardClasses(spacing),
        getMobileScrollMarginClasses(),
        className,
      )}
    >
      {children}
    </section>
  );
}

export function ResponsiveTwoColumnSection({
  children,
  className,
}: ResponsiveTwoColumnSectionProps) {
  return (
    <div
      data-testid="responsive-two-column-section"
      className={cn("grid gap-5 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]", className)}
    >
      {children}
    </div>
  );
}

export function MobileActionZone({
  children,
  layout = "responsive",
  sticky = false,
  className,
}: MobileActionZoneProps) {
  return (
    <div
      data-testid="mobile-action-zone"
      className={cn(
        sticky ? mobileStickyActionBarClasses : getMobileActionLayoutClasses(layout),
        sticky && getMobileActionLayoutClasses(layout),
        className,
      )}
    >
      {children}
    </div>
  );
}
