import {
  HIDE_COUNT_DEFAULT,
  HIDE_COUNT_MIN,
  QUIZ_METHODS,
} from "@/lib/constants/quiz";
import {
  countArabicWords,
  countValidLines,
} from "@/lib/utils/arabic";
import type { QuizMethod } from "@/types/quiz";

export interface HideCountLimits {
  min: number;
  max: number;
  available: number;
  defaultValue: number;
  disabled: boolean;
  label: string;
  helperText: string;
}

export function getAvailableHideCount(
  text: string,
  method: QuizMethod,
): number {
  if (method === QUIZ_METHODS.HIDE_WORD) {
    return countArabicWords(text);
  }

  return countValidLines(text);
}

export function getHideCountLabel(method: QuizMethod): string {
  if (method === QUIZ_METHODS.HIDE_WORD) {
    return "Words to Hide";
  }

  return "Lines to Hide";
}

export function getHideCountHelperText(
  method: QuizMethod,
  available: number,
): string {
  if (available < HIDE_COUNT_MIN) {
    return method === QUIZ_METHODS.HIDE_WORD
      ? "Paste Arabic text to calculate how many words can be hidden."
      : "Paste Arabic text with valid lines to calculate how many lines can be hidden.";
  }

  return method === QUIZ_METHODS.HIDE_WORD
    ? `You can hide up to ${available} Arabic word${available === 1 ? "" : "s"}.`
    : `You can hide up to ${available} line${available === 1 ? "" : "s"}.`;
}

export function clampHideCount(
  value: number,
  max: number,
  min = HIDE_COUNT_MIN,
): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  if (max < min) {
    return min;
  }

  const integerValue = Math.trunc(value);

  return Math.min(max, Math.max(min, integerValue));
}

export function isValidHideCount(
  value: number,
  text: string,
  method: QuizMethod,
): boolean {
  const available = getAvailableHideCount(text, method);

  return (
    Number.isInteger(value) &&
    value >= HIDE_COUNT_MIN &&
    value <= available
  );
}

export function normalizeHideCount(
  value: number,
  text: string,
  method: QuizMethod,
): number {
  const available = getAvailableHideCount(text, method);

  return clampHideCount(value, available);
}

export function getHideCountLimits(
  text: string,
  method: QuizMethod,
): HideCountLimits {
  const available = getAvailableHideCount(text, method);
  const disabled = available < HIDE_COUNT_MIN;

  return {
    min: HIDE_COUNT_MIN,
    max: available,
    available,
    defaultValue: disabled
      ? HIDE_COUNT_DEFAULT
      : clampHideCount(HIDE_COUNT_DEFAULT, available),
    disabled,
    label: getHideCountLabel(method),
    helperText: getHideCountHelperText(method, available),
  };
}
