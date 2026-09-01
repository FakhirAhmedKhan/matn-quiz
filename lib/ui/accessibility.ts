import type { StudyProgress } from "@/lib/quiz/study-session";

export const focusRingClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2";

export const interactiveTransitionClasses =
  "transition duration-200 ease-out motion-reduce:transition-none";

export const pressableClasses =
  "active:scale-[0.98] motion-reduce:active:scale-100";

export const accessibleCardFocusClasses =
  "focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2";

export function getAnswerToggleAriaLabel(
  answerIndex: number,
  revealed: boolean,
): string {
  return revealed
    ? `Hide answer ${answerIndex}`
    : `Reveal answer ${answerIndex}`;
}

export function getStudyProgressAnnouncement(progress: StudyProgress): string {
  if (progress.total === 0) {
    return "No answers available.";
  }

  if (progress.complete) {
    return `All ${progress.total} answers are revealed.`;
  }

  return `${progress.revealed} of ${progress.total} answers revealed.`;
}

export function getActionStatusAnnouncement(value: string): string {
  return value.trim().length > 0 ? value : "No action status.";
}

export function getAccessiblePercentageLabel(percentage: number): string {
  if (!Number.isFinite(percentage)) {
    return "0 percent";
  }

  if (percentage <= 0) {
    return "0 percent";
  }

  if (percentage >= 100) {
    return "100 percent";
  }

  return `${Math.round(percentage)} percent`;
}

export function getReadingPanelAriaLabel(title: string): string {
  return `${title} Arabic reading area`;
}
