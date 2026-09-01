import { describe, expect, it } from "vitest";
import {
  getSelectedTokenIndexes,
  isTokenSelected,
  normalizeWordSelectionCount,
  selectArabicWordsToHide,
  shuffleArabicWordTokens,
} from "@/lib/quiz/word-selection";
import { getArabicWordTokens } from "@/lib/quiz/word-tokenizer";

describe("word selection utilities", () => {
  const sample = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  it("normalizes requested count", () => {
    expect(normalizeWordSelectionCount(2, 4)).toBe(2);
    expect(normalizeWordSelectionCount(10, 4)).toBe(4);
    expect(normalizeWordSelectionCount(0, 4)).toBe(0);
    expect(normalizeWordSelectionCount(-1, 4)).toBe(0);
    expect(normalizeWordSelectionCount(2.8, 4)).toBe(2);
    expect(normalizeWordSelectionCount(Number.NaN, 4)).toBe(0);
    expect(normalizeWordSelectionCount(Number.POSITIVE_INFINITY, 4)).toBe(0);
    expect(normalizeWordSelectionCount(1, 0)).toBe(0);
  });

  it("shuffles without mutating original array", () => {
    const words = getArabicWordTokens(sample);
    const before = [...words];

    const shuffled = shuffleArabicWordTokens(words, () => 0);

    expect(words).toEqual(before);
    expect(shuffled).toHaveLength(words.length);
  });

  it("selects requested number of Arabic words", () => {
    const result = selectArabicWordsToHide(sample, 2, () => 0);

    expect(result.availableWords).toHaveLength(4);
    expect(result.selectedWords).toHaveLength(2);
    expect(result.requestedCount).toBe(2);
    expect(result.selectedCount).toBe(2);
  });

  it("does not select more words than available", () => {
    const result = selectArabicWordsToHide(sample, 99, () => 0);

    expect(result.availableWords).toHaveLength(4);
    expect(result.selectedWords).toHaveLength(4);
    expect(result.requestedCount).toBe(99);
    expect(result.selectedCount).toBe(4);
  });

  it("returns no selection for empty text", () => {
    const result = selectArabicWordsToHide("", 2, () => 0);

    expect(result.availableWords).toEqual([]);
    expect(result.selectedWords).toEqual([]);
    expect(result.selectedCount).toBe(0);
  });

  it("returns no selection for zero requested count", () => {
    const result = selectArabicWordsToHide(sample, 0, () => 0);

    expect(result.availableWords).toHaveLength(4);
    expect(result.selectedWords).toEqual([]);
    expect(result.selectedCount).toBe(0);
  });

  it("returns no selection for negative requested count", () => {
    const result = selectArabicWordsToHide(sample, -3, () => 0);

    expect(result.availableWords).toHaveLength(4);
    expect(result.selectedWords).toEqual([]);
    expect(result.selectedCount).toBe(0);
  });

  it("selects repeated words by position", () => {
    const result = selectArabicWordsToHide("اللَّهِ اللَّهِ", 2, () => 0);

    expect(result.availableWords).toEqual([
      {
        tokenIndex: 0,
        wordIndex: 0,
        value: "اللَّهِ",
      },
      {
        tokenIndex: 2,
        wordIndex: 1,
        value: "اللَّهِ",
      },
    ]);

    expect(result.selectedWords).toHaveLength(2);
    expect(result.selectedWords[0]?.value).toBe("اللَّهِ");
    expect(result.selectedWords[1]?.value).toBe("اللَّهِ");
    expect(result.selectedWords[0]?.wordIndex).not.toBe(
      result.selectedWords[1]?.wordIndex,
    );
  });

  it("sorts selected words by token position for stable rendering", () => {
    const result = selectArabicWordsToHide(sample, 4, () => 0);

    expect(result.selectedWords.map((word) => word.tokenIndex)).toEqual([
      0,
      2,
      4,
      6,
    ]);
  });

  it("adds selection indexes after stable sorting", () => {
    const result = selectArabicWordsToHide(sample, 3, () => 0);

    expect(result.selectedWords.map((word) => word.selectionIndex)).toEqual([
      0,
      1,
      2,
    ]);
  });

  it("gets selected token indexes", () => {
    const result = selectArabicWordsToHide(sample, 2, () => 0);

    expect(getSelectedTokenIndexes(result.selectedWords)).toEqual([2, 4]);
  });

  it("checks whether a token is selected", () => {
    const result = selectArabicWordsToHide(sample, 2, () => 0);

    expect(isTokenSelected(2, result.selectedWords)).toBe(true);
    expect(isTokenSelected(4, result.selectedWords)).toBe(true);
    expect(isTokenSelected(0, result.selectedWords)).toBe(false);
    expect(isTokenSelected(6, result.selectedWords)).toBe(false);
  });

  it("does not modify original text", () => {
    const original = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
    const before = original;

    selectArabicWordsToHide(original, 2, () => 0);

    expect(original).toBe(before);
  });

  it("preserves diacritics in selected words", () => {
    const result = selectArabicWordsToHide("الرَّحْمَٰنِ", 1, () => 0);

    expect(result.selectedWords[0]?.value).toBe("الرَّحْمَٰنِ");
  });
});
















