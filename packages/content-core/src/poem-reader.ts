export type PoemReaderMode = "FOCUS" | "ALL";

export type PoemReaderProgress = {
  currentIndex: number;
  total: number;
  progress: number;
  percentage: number;
};

export function normalizePoemReaderMode(value: unknown): PoemReaderMode {
  return value === "FOCUS" ? "FOCUS" : "ALL";
}

export function clampPoemReaderIndex(
  currentIndex: number,
  total: number,
): number {
  const safeTotal = Math.max(0, Math.floor(Number.isFinite(total) ? total : 0));

  if (safeTotal === 0) {
    return 0;
  }

  const safeIndex = Number.isFinite(currentIndex)
    ? Math.floor(currentIndex)
    : 0;

  return Math.min(safeTotal - 1, Math.max(0, safeIndex));
}

export function getPreviousPoemReaderIndex(
  currentIndex: number,
  total: number,
): number {
  return clampPoemReaderIndex(currentIndex - 1, total);
}

export function getNextPoemReaderIndex(
  currentIndex: number,
  total: number,
): number {
  return clampPoemReaderIndex(currentIndex + 1, total);
}

export function getFirstPoemReaderIndex(): number {
  return 0;
}

export function getLastPoemReaderIndex(total: number): number {
  return Math.max(0, Math.floor(Number.isFinite(total) ? total : 0) - 1);
}

export function getPoemReaderProgress(
  currentIndex: number,
  total: number,
): number {
  const safeTotal = Math.max(0, Math.floor(Number.isFinite(total) ? total : 0));

  if (safeTotal <= 0) {
    return 0;
  }

  const safeIndex = clampPoemReaderIndex(currentIndex, safeTotal);

  return Math.min(1, Math.max(0, (safeIndex + 1) / safeTotal));
}

export function getPoemReaderPercentage(
  currentIndex: number,
  total: number,
): number {
  return Math.round(getPoemReaderProgress(currentIndex, total) * 100);
}

export function getPoemReaderState(
  currentIndex: number,
  total: number,
): PoemReaderProgress {
  const safeTotal = Math.max(0, Math.floor(Number.isFinite(total) ? total : 0));

  const safeIndex = clampPoemReaderIndex(currentIndex, safeTotal);

  const progress = getPoemReaderProgress(safeIndex, safeTotal);

  return {
    currentIndex: safeIndex,

    total: safeTotal,

    progress,

    percentage: Math.round(progress * 100),
  };
}
