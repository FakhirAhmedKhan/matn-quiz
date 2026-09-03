export type AccessibleStatusKind =
  | "status"
  | "alert"
  | "log"
  | "progressbar";

export type AccessibleLiveMode = "off" | "polite" | "assertive";

export interface AccessibleStatusProps {
  role: AccessibleStatusKind;
  "aria-live"?: AccessibleLiveMode;
  "aria-atomic"?: boolean;
}

export interface TouchTargetAuditResult {
  width: number;
  height: number;
  minimum: number;
  passes: boolean;
}

export const MINIMUM_TOUCH_TARGET_SIZE_PX = 44;

export const skipLinkClasses =
  "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-emerald-700 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2";

export const accessibleTouchTargetClasses =
  "min-h-11 min-w-11 touch-manipulation";

export const accessibleFocusRingClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2";

export const accessibleMotionClasses =
  "transition duration-200 ease-out motion-reduce:transition-none";

export const accessiblePressedClasses =
  "aria-pressed:bg-emerald-700 aria-pressed:text-white";

export const accessibleDisabledClasses =
  "disabled:cursor-not-allowed disabled:opacity-50";

export const accessibleInteractiveClasses = [
  accessibleTouchTargetClasses,
  accessibleFocusRingClasses,
  accessibleMotionClasses,
  accessibleDisabledClasses,
].join(" ");

export function getSkipLinkHref(targetId = "main-content"): string {
  return `#${targetId}`;
}

export function getSkipLinkLabel(label = "Skip to main content"): string {
  return label;
}

export function getMainContentId(id = "main-content"): string {
  return id;
}

export function getAccessibleStatusProps(
  kind: AccessibleStatusKind = "status",
  liveMode?: AccessibleLiveMode,
): AccessibleStatusProps {
  if (kind === "alert") {
    return {
      role: "alert",
      "aria-live": liveMode ?? "assertive",
      "aria-atomic": true,
    };
  }

  if (kind === "log") {
    return {
      role: "log",
      "aria-live": liveMode ?? "polite",
      "aria-atomic": false,
    };
  }

  if (kind === "progressbar") {
    return {
      role: "progressbar",
    };
  }

  return {
    role: "status",
    "aria-live": liveMode ?? "polite",
    "aria-atomic": true,
  };
}

export function getAriaInvalid(hasError: boolean): true | undefined {
  return hasError ? true : undefined;
}

export function getAriaDescribedBy(
  ids: Array<string | undefined | null | false>,
): string | undefined {
  const validIds = ids.filter(
    (id): id is string => typeof id === "string" && id.trim().length > 0,
  );

  return validIds.length > 0 ? validIds.join(" ") : undefined;
}

export function getAccessibleButtonLabel(
  action: string,
  target?: string | number,
): string {
  const safeAction = action.trim();

  if (!target && target !== 0) {
    return safeAction;
  }

  return `${safeAction} ${target}`;
}

export function getAccessibleRegionLabel(
  title: string,
  fallback = "Content section",
): string {
  const safeTitle = title.trim();

  return safeTitle.length > 0 ? safeTitle : fallback;
}

export function auditTouchTargetSize(
  width: number,
  height: number,
  minimum = MINIMUM_TOUCH_TARGET_SIZE_PX,
): TouchTargetAuditResult {
  return {
    width,
    height,
    minimum,
    passes:
      Number.isFinite(width) &&
      Number.isFinite(height) &&
      width >= minimum &&
      height >= minimum,
  };
}

export function getTouchTargetSizeStyle(
  minimum = MINIMUM_TOUCH_TARGET_SIZE_PX,
): { minWidth: number; minHeight: number } {
  return {
    minWidth: minimum,
    minHeight: minimum,
  };
}

export function getProgressAriaValueText(
  percentage: number,
  label = "complete",
): string {
  const safePercentage = Number.isFinite(percentage)
    ? Math.min(Math.max(Math.round(percentage), 0), 100)
    : 0;

  return `${safePercentage} percent ${label}`;
}

export function getRequiredFieldLabel(label: string, required = false): string {
  return required ? `${label} required` : label;
}
