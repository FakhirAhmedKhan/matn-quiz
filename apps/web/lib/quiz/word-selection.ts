import {
  type ArabicWordToken,
  getArabicWordTokens,
} from "@/lib/quiz/word-tokenizer";

export type RandomNumberGenerator = () => number;

export interface SelectedArabicWordToken extends ArabicWordToken {
  selectionIndex: number;
}

export interface WordSelectionResult {
  availableWords: ArabicWordToken[];
  selectedWords: SelectedArabicWordToken[];
  requestedCount: number;
  selectedCount: number;
}

/**
 * Clamp requested word count to the number of available Arabic words.
 */
export function normalizeWordSelectionCount(
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
 * Shuffle tokens without mutating the original array.
 *
 * Uses Fisher-Yates shuffle.
 * A custom random function can be injected for deterministic tests.
 */
export function shuffleArabicWordTokens(
  words: ArabicWordToken[],
  random: RandomNumberGenerator = Math.random,
): ArabicWordToken[] {
  const shuffled = [...words];

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
 * Select unique Arabic word tokens from the text.
 *
 * Important:
 * - Repeated words are selected by position, not by text value.
 * - Original text is not modified.
 * - Original token list is not mutated.
 * - Selection is sorted back by token position for stable rendering later.
 */
export function selectArabicWordsToHide(
  text: string,
  requestedCount: number,
  random: RandomNumberGenerator = Math.random,
): WordSelectionResult {
  const availableWords = getArabicWordTokens(text);
  const selectedCount = normalizeWordSelectionCount(
    requestedCount,
    availableWords.length,
  );

  if (selectedCount === 0) {
    return {
      availableWords,
      selectedWords: [],
      requestedCount,
      selectedCount,
    };
  }

  const shuffled = shuffleArabicWordTokens(availableWords, random);

  const selectedWords = shuffled
    .slice(0, selectedCount)
    .sort((first, second) => first.tokenIndex - second.tokenIndex)
    .map((word, selectionIndex) => ({
      ...word,
      selectionIndex,
    }));

  return {
    availableWords,
    selectedWords,
    requestedCount,
    selectedCount,
  };
}

export function getSelectedTokenIndexes(
  selectedWords: SelectedArabicWordToken[],
): number[] {
  return selectedWords.map((word) => word.tokenIndex);
}

export function isTokenSelected(
  tokenIndex: number,
  selectedWords: SelectedArabicWordToken[],
): boolean {
  return selectedWords.some((word) => word.tokenIndex === tokenIndex);
}
