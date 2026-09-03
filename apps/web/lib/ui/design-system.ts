export type AppSurfaceTone = "default" | "soft" | "elevated" | "success" | "warning" | "danger";
export type AppSize = "sm" | "md" | "lg";

export const appShellClasses =
  "min-h-screen bg-[radial-gradient(circle_at_top,_#ecfdf5_0%,_#f8fafc_42%,_#f8fafc_100%)] py-8 sm:py-12";

export const appContainerClasses =
  "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8";

export const appSectionStackClasses = "space-y-6 sm:space-y-8";

export const appCardBaseClasses =
  "rounded-3xl border border-slate-200/80 bg-white/95 shadow-sm shadow-slate-200/60 backdrop-blur";

export const appCardPaddingClasses: Record<AppSize, string> = {
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export const appSurfaceToneClasses: Record<AppSurfaceTone, string> = {
  default: "border-slate-200 bg-white text-slate-950",
  soft: "border-slate-200 bg-slate-50 text-slate-950",
  elevated: "border-slate-200 bg-white shadow-md shadow-slate-200/70 text-slate-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-red-200 bg-red-50 text-red-900",
};

export const appButtonBaseClasses =
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const appButtonSizeClasses: Record<AppSize, string> = {
  sm: "min-h-9 px-3 py-2",
  md: "min-h-10 px-4 py-2.5",
  lg: "min-h-12 px-5 py-3",
};

export const appPrimaryButtonClasses =
  "bg-emerald-700 text-white shadow-sm shadow-emerald-900/10 hover:bg-emerald-800";

export const appSecondaryButtonClasses =
  "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700";

export const appMutedTextClasses = "text-sm leading-6 text-slate-600";

export const appHeadingClasses =
  "text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl";

export const appSubheadingClasses = "text-base leading-7 text-slate-600";

export const arabicReadingPanelClasses =
  "arabic-text whitespace-pre-wrap rounded-3xl border border-slate-200 bg-slate-50 p-5 text-right text-2xl leading-loose text-slate-950 sm:p-6 sm:text-3xl";

export const arabicAnswerClasses =
  "arabic-text text-right text-xl font-semibold leading-loose text-slate-950 sm:text-2xl";

export function getAppCardClasses(size: AppSize = "md"): string {
  return `${appCardBaseClasses} ${appCardPaddingClasses[size]}`;
}

export function getAppSurfaceClasses(tone: AppSurfaceTone = "default"): string {
  return `rounded-2xl border ${appSurfaceToneClasses[tone]}`;
}

export function getAppButtonClasses(
  variant: "primary" | "secondary" = "primary",
  size: AppSize = "md",
): string {
  const variantClasses =
    variant === "primary" ? appPrimaryButtonClasses : appSecondaryButtonClasses;

  return `${appButtonBaseClasses} ${appButtonSizeClasses[size]} ${variantClasses}`;
}

export function getProgressBarWidth(percentage: number): string {
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

export function getMethodAccentClasses(method: "HIDE_WORD" | "HIDE_LINE"): string {
  if (method === "HIDE_WORD") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  return "border-indigo-200 bg-indigo-50 text-indigo-800";
}
