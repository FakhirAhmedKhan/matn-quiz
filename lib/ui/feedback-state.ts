export type FeedbackStateKind =
  | "empty"
  | "loading"
  | "success"
  | "warning"
  | "error"
  | "info";

export type FeedbackStateTone =
  | "soft"
  | "success"
  | "warning"
  | "danger"
  | "info";

export const feedbackStateToneClasses: Record<FeedbackStateTone, string> = {
  soft: "border-slate-200 bg-slate-50 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  danger: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

export const feedbackStateIconClasses: Record<FeedbackStateTone, string> = {
  soft: "bg-white text-slate-500 ring-slate-200",
  success: "bg-white text-emerald-700 ring-emerald-200",
  warning: "bg-white text-amber-700 ring-amber-200",
  danger: "bg-white text-red-700 ring-red-200",
  info: "bg-white text-blue-700 ring-blue-200",
};

export function getFeedbackStateTone(kind: FeedbackStateKind): FeedbackStateTone {
  if (kind === "success") {
    return "success";
  }

  if (kind === "warning") {
    return "warning";
  }

  if (kind === "error") {
    return "danger";
  }

  if (kind === "info" || kind === "loading") {
    return "info";
  }

  return "soft";
}

export function getFeedbackStateToneClasses(
  tone: FeedbackStateTone = "soft",
): string {
  return feedbackStateToneClasses[tone];
}

export function getFeedbackStateIconClasses(
  tone: FeedbackStateTone = "soft",
): string {
  return feedbackStateIconClasses[tone];
}

export function getFeedbackStateRole(kind: FeedbackStateKind): "status" | "alert" {
  return kind === "error" || kind === "warning" ? "alert" : "status";
}

export function getFeedbackStateAriaLive(
  kind: FeedbackStateKind,
): "polite" | "assertive" {
  return kind === "error" || kind === "warning" ? "assertive" : "polite";
}

export function getFeedbackStateDefaultTitle(kind: FeedbackStateKind): string {
  if (kind === "empty") {
    return "Nothing here yet";
  }

  if (kind === "loading") {
    return "Loading";
  }

  if (kind === "success") {
    return "Success";
  }

  if (kind === "warning") {
    return "Needs attention";
  }

  if (kind === "error") {
    return "Something went wrong";
  }

  return "Information";
}

export function getFeedbackStateIconLabel(kind: FeedbackStateKind): string {
  if (kind === "empty") {
    return "Empty state";
  }

  if (kind === "loading") {
    return "Loading state";
  }

  if (kind === "success") {
    return "Success state";
  }

  if (kind === "warning") {
    return "Warning state";
  }

  if (kind === "error") {
    return "Error state";
  }

  return "Information state";
}

export function getFeedbackStateDescription(
  kind: FeedbackStateKind,
  description?: string,
): string {
  if (description && description.trim().length > 0) {
    return description;
  }

  if (kind === "empty") {
    return "There is no content to show right now.";
  }

  if (kind === "loading") {
    return "Please wait while this content is prepared.";
  }

  if (kind === "success") {
    return "The action completed successfully.";
  }

  if (kind === "warning") {
    return "Please review this before continuing.";
  }

  if (kind === "error") {
    return "Please try again or review the input.";
  }

  return "Helpful information is available here.";
}
