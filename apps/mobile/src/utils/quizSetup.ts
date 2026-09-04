import type {
  QuizMethod,
} from "../types/quiz";

export const MIN_HIDE_COUNT = 1;

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

export function clampHideCount(
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

export function getHideCountPresets(
  maximum: number,
): number[] {
  if (maximum <= 0) {
    return [];
  }

  const candidates = [
    1,
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
    (a, b) => a - b,
  );
}

export function getMethodLabel(
  method: QuizMethod,
): string {
  return method === "HIDE_WORD"
    ? "Hide Words"
    : "Hide Lines";
}

export function getItemLabel(
  method: QuizMethod,
  count: number,
): string {
  if (method === "HIDE_WORD") {
    return count === 1
      ? "word"
      : "words";
  }

  return count === 1
    ? "line"
    : "lines";
}