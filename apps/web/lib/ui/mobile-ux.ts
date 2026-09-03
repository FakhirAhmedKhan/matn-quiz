export type MobileSpacingSize = "compact" | "comfortable" | "spacious";

export type MobileSurfaceTone =
  | "default"
  | "soft"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type MobileActionLayout = "stacked" | "inline" | "responsive";

export const mobileSafeAreaClasses =
  "px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6";

export const mobileViewportClasses =
  "min-h-dvh overflow-x-hidden bg-slate-50 text-slate-950";

export const mobileReadableContainerClasses =
  "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8";

export const mobileCardBaseClasses =
  "rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60";

export const mobileTouchTargetClasses =
  "min-h-11 min-w-11 touch-manipulation";

export const mobileFocusVisibleClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2";

export const mobileMotionSafeClasses =
  "transition duration-200 ease-out motion-reduce:transition-none";

export const mobilePressableClasses =
  "active:scale-[0.98] motion-reduce:active:scale-100";

export const mobileArabicTextClasses =
  "arabic-text text-right leading-loose tracking-normal";

export const mobileNoHorizontalOverflowClasses =
  "max-w-full overflow-x-hidden break-words";

export const mobileStickyActionBarClasses =
  "sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:shadow-sm";

export const mobileSpacingClasses: Record<MobileSpacingSize, string> = {
  compact: "space-y-3 sm:space-y-4",
  comfortable: "space-y-5 sm:space-y-6",
  spacious: "space-y-6 sm:space-y-8",
};

export const mobileSectionPaddingClasses: Record<MobileSpacingSize, string> = {
  compact: "p-4 sm:p-5",
  comfortable: "p-5 sm:p-6",
  spacious: "p-6 sm:p-8",
};

export const mobileSurfaceToneClasses: Record<MobileSurfaceTone, string> = {
  default: "border-slate-200 bg-white text-slate-950",
  soft: "border-slate-200 bg-slate-50 text-slate-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

export const mobileActionLayoutClasses: Record<MobileActionLayout, string> = {
  stacked: "grid gap-2",
  inline: "flex flex-wrap items-center gap-2",
  responsive: "grid gap-2 sm:flex sm:flex-wrap sm:items-center",
};

export function getMobileSpacingClasses(
  size: MobileSpacingSize = "comfortable",
): string {
  return mobileSpacingClasses[size];
}

export function getMobileSectionPaddingClasses(
  size: MobileSpacingSize = "comfortable",
): string {
  return mobileSectionPaddingClasses[size];
}

export function getMobileCardClasses(
  size: MobileSpacingSize = "comfortable",
): string {
  return `${mobileCardBaseClasses} ${getMobileSectionPaddingClasses(size)}`;
}

export function getMobileSurfaceClasses(
  tone: MobileSurfaceTone = "default",
): string {
  return `rounded-2xl border ${mobileSurfaceToneClasses[tone]}`;
}

export function getMobileActionLayoutClasses(
  layout: MobileActionLayout = "responsive",
): string {
  return mobileActionLayoutClasses[layout];
}

export function getMobileButtonClasses(
  variant: "primary" | "secondary" | "danger" = "secondary",
): string {
  const variantClasses =
    variant === "primary"
      ? "bg-emerald-700 text-white hover:bg-emerald-800"
      : variant === "danger"
        ? "border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50"
        : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700";

  return [
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
    mobileTouchTargetClasses,
    mobileFocusVisibleClasses,
    mobileMotionSafeClasses,
    mobilePressableClasses,
    variantClasses,
  ].join(" ");
}

export function getMobileTextareaClasses(
  variant: "arabic" | "json" = "arabic",
): string {
  const variantClasses =
    variant === "arabic"
      ? "arabic-text min-h-64 text-right text-2xl leading-loose sm:min-h-72 sm:text-3xl"
      : "min-h-40 font-mono text-sm leading-6";

  return [
    "w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
    mobileNoHorizontalOverflowClasses,
    variantClasses,
  ].join(" ");
}

export function getMobileStatusPillClasses(
  tone: MobileSurfaceTone = "soft",
): string {
  return `inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${mobileSurfaceToneClasses[tone]}`;
}

export function getMobileEmptyStateClasses(
  tone: MobileSurfaceTone = "soft",
): string {
  return `rounded-2xl border p-5 text-sm leading-6 ${mobileSurfaceToneClasses[tone]}`;
}

export function getMobileProgressWidth(percentage: number): string {
  if (!Number.isFinite(percentage)) {
    return "0%";
  }

  if (percentage <= 0) {
    return "0%";
  }

  if (percentage >= 100) {
    return "100%";
  }

  return `${Math.round(percentage)}%`;
}

export function getMobileInputHintText(
  characters: number,
  maxCharacters: number,
): string {
  const remaining = Math.max(maxCharacters - characters, 0);

  if (remaining === 0) {
    return "Character limit reached";
  }

  return `${remaining} character${remaining === 1 ? "" : "s"} remaining`;
}

export function shouldUseCompactMobileLayout(width: number): boolean {
  return Number.isFinite(width) && width < 640;
}

export function getMobileScrollMarginClasses(): string {
  return "scroll-mt-24 sm:scroll-mt-28";
}
