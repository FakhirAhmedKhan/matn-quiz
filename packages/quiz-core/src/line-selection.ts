import {
  getHideableLineTokens,
  type HideableLineToken,
} from "./line-tokenizer";

export type RandomNumberGenerator = () => number;

export interface SelectedLineToken extends HideableLineToken {
  selectionIndex: number;
}

export interface LineSelectionResult {
  availableLines: HideableLineToken[];
  selectedLines: SelectedLineToken[];
  requestedCount: number;
  selectedCount: number;
}

/**
 * Clamp requested line count to the number of available hideable lines.
 */
export function normalizeLineSelectionCount(
  requestedCount: number,
  availableCount: number,
): number {
  if (!Number.isFinite(requestedCount)) {
    return 0;
  }

  if (availableCount <= 0) {
    return 0;
  }

  const integerCount = Math.trunc(requestedCount);

  if (integerCount <= 0) {
    return 0;
  }

  return Math.min(integerCount, availableCount);
}

/**
 * Shuffle line tokens without mutating the original array.
 *
 * Uses Fisher-Yates shuffle.
 * A custom random function can be injected for deterministic tests.
 */
export function shuffleHideableLineTokens(
  lines: HideableLineToken[],
  random: RandomNumberGenerator = Math.random,
): HideableLineToken[] {
  const shuffled = [...lines];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

/**
 * Select unique hideable line tokens from text.
 *
 * Important:
 * - Blank lines are not selected.
 * - Whitespace-only lines are not selected.
 * - Repeated lines are selected by position, not by text value.
 * - Original text is not modified.
 * - Selection is sorted back by token position for stable rendering later.
 */
export function selectLinesToHide(
  text: string,
  requestedCount: number,
  random: RandomNumberGenerator = Math.random,
): LineSelectionResult {
  const availableLines = getHideableLineTokens(text);
  const selectedCount = normalizeLineSelectionCount(
    requestedCount,
    availableLines.length,
  );

  if (selectedCount === 0) {
    return {
      availableLines,
      selectedLines: [],
      requestedCount,
      selectedCount,
    };
  }

  const shuffled = shuffleHideableLineTokens(availableLines, random);

  const selectedLines = shuffled
    .slice(0, selectedCount)
    .sort((first, second) => first.tokenIndex - second.tokenIndex)
    .map((line, selectionIndex) => ({
      ...line,
      selectionIndex,
    }));

  return {
    availableLines,
    selectedLines,
    requestedCount,
    selectedCount,
  };
}

export function getSelectedLineTokenIndexes(
  selectedLines: SelectedLineToken[],
): number[] {
  return selectedLines.map((line) => line.tokenIndex);
}

export function getSelectedLineIndexes(
  selectedLines: SelectedLineToken[],
): number[] {
  return selectedLines.map((line) => line.lineIndex);
}

export function isLineTokenSelected(
  tokenIndex: number,
  selectedLines: SelectedLineToken[],
): boolean {
  return selectedLines.some((line) => line.tokenIndex === tokenIndex);
}
