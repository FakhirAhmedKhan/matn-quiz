import {
  AccessibilityInfo,
} from "react-native";

export const ACCESSIBILITY = {
  minimumTouchTarget:
    44,

  maximumFontScale:
    2,

  arabicMaximumFontScale:
    2.2,
} as const;

export type AccessibilityAnnouncement =
  | "QUIZ_READY"
  | "ANSWER_REVEALED"
  | "IMPORT_COMPLETE"
  | "BOOK_COMPLETED"
  | "SETTINGS_RESET";

const ANNOUNCEMENTS: Record<
  AccessibilityAnnouncement,
  string
> = {
  QUIZ_READY:
    "Quiz is ready to study.",

  ANSWER_REVEALED:
    "Answer revealed.",

  IMPORT_COMPLETE:
    "Import completed successfully.",

  BOOK_COMPLETED:
    "Book completed.",

  SETTINGS_RESET:
    "Settings restored to defaults.",
};

export function announceAccessibility(
  message:
    | string
    | AccessibilityAnnouncement,
): void {
  const resolved =
    message in ANNOUNCEMENTS
      ? ANNOUNCEMENTS[
          message as AccessibilityAnnouncement
        ]
      : message;

  AccessibilityInfo.announceForAccessibility(
    resolved,
  );
}

export function buildProgressAccessibilityValue(
  value: number,
): {
  min: number;
  max: number;
  now: number;
  text: string;
} {
  const normalized =
    Math.min(
      1,
      Math.max(
        0,
        Number.isFinite(value)
          ? value
          : 0,
      ),
    );

  const percentage =
    Math.round(
      normalized * 100,
    );

  return {
    min: 0,
    max: 100,
    now:
      percentage,
    text:
      `${percentage} percent`,
  };
}

export function getAccessibilityHint(
  action: string,
): string {
  return `Double tap to ${action}.`;
}