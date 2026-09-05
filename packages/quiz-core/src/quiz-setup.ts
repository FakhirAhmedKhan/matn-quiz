import type {
  QuizMethod,
} from "@matn-quiz/shared-types/quiz";

import {
  HIDE_COUNT_MIN,
} from "./constants";

import {
  getGeneratedQuizMethodLabel,
} from "./unified-quiz";

export const MIN_HIDE_COUNT =
  HIDE_COUNT_MIN;

export function getMaximumHideCount(
  method: QuizMethod,
  words: number,
  lines: number,
): number {
  const available =
    method === "HIDE_WORD"
      ? words
      : lines;

  return Math.max(
    0,
    available,
  );
}

export function clampHideCountForSetup(
  count: number,
  maximum: number,
): number {
  if (maximum <= 0) {
    return 0;
  }

  return Math.min(
    maximum,
    Math.max(
      MIN_HIDE_COUNT,
      Math.floor(count),
    ),
  );
}

/**
 * Compatibility name used by the existing Mobile flow.
 *
 * This intentionally preserves the old Mobile behavior:
 * maximum <= 0 returns 0.
 *
 * The canonical Web/core hide-count module has a different
 * general-purpose clamp contract, so this setup-specific
 * compatibility behavior remains explicit.
 */
export const clampHideCount =
  clampHideCountForSetup;

export function getHideCountPresets(
  maximum: number,
): number[] {
  if (maximum <= 0) {
    return [];
  }

  const candidates = [
    MIN_HIDE_COUNT,
    3,
    5,
    10,
    maximum,
  ];

  return Array.from(
    new Set(
      candidates.filter(
        (value) =>
          value >= MIN_HIDE_COUNT &&
          value <= maximum,
      ),
    ),
  ).sort(
    (a, b) =>
      a - b,
  );
}

export function getMethodLabel(
  method: QuizMethod,
): string {
  return getGeneratedQuizMethodLabel(
    method,
  );
}

export function getItemLabel(
  method: QuizMethod,
  count: number,
): string {
  if (
    method ===
    "HIDE_WORD"
  ) {
    return count === 1
      ? "word"
      : "words";
  }

  return count === 1
    ? "line"
    : "lines";
}
