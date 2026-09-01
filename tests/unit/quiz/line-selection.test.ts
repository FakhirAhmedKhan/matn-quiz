import { describe, expect, it } from "vitest";
import {
  getSelectedLineIndexes,
  getSelectedLineTokenIndexes,
  isLineTokenSelected,
  normalizeLineSelectionCount,
  selectLinesToHide,
  shuffleHideableLineTokens,
} from "@/lib/quiz/line-selection";
import { getHideableLineTokens } from "@/lib/quiz/line-tokenizer";

describe("line selection utilities", () => {
  const sample =
    "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ";

  it("normalizes requested count", () => {
    expect(normalizeLineSelectionCount(2, 3)).toBe(2);
    expect(normalizeLineSelectionCount(10, 3)).toBe(3);
    expect(normalizeLineSelectionCount(0, 3)).toBe(0);
    expect(normalizeLineSelectionCount(-1, 3)).toBe(0);
    expect(normalizeLineSelectionCount(2.8, 3)).toBe(2);
    expect(normalizeLineSelectionCount(Number.NaN, 3)).toBe(0);
    expect(normalizeLineSelectionCount(Number.POSITIVE_INFINITY, 3)).toBe(0);
    expect(normalizeLineSelectionCount(1, 0)).toBe(0);
  });

  it("shuffles without mutating original array", () => {
    const lines = getHideableLineTokens(sample);
    const before = [...lines];

    const shuffled = shuffleHideableLineTokens(lines, () => 0);

    expect(lines).toEqual(before);
    expect(shuffled).toHaveLength(lines.length);
  });

  it("selects requested number of lines", () => {
    const result = selectLinesToHide(sample, 2, () => 0);

    expect(result.availableLines).toHaveLength(3);
    expect(result.selectedLines).toHaveLength(2);
    expect(result.requestedCount).toBe(2);
    expect(result.selectedCount).toBe(2);
  });

  it("does not select more lines than available", () => {
    const result = selectLinesToHide(sample, 99, () => 0);

    expect(result.availableLines).toHaveLength(3);
    expect(result.selectedLines).toHaveLength(3);
    expect(result.requestedCount).toBe(99);
    expect(result.selectedCount).toBe(3);
  });

  it("returns no selection for empty text", () => {
    const result = selectLinesToHide("", 2, () => 0);

    expect(result.availableLines).toEqual([]);
    expect(result.selectedLines).toEqual([]);
    expect(result.selectedCount).toBe(0);
  });

  it("returns no selection for whitespace-only text", () => {
    const result = selectLinesToHide("   \n\n  ", 2, () => 0);

    expect(result.availableLines).toEqual([]);
    expect(result.selectedLines).toEqual([]);
    expect(result.selectedCount).toBe(0);
  });

  it("returns no selection for zero requested count", () => {
    const result = selectLinesToHide(sample, 0, () => 0);

    expect(result.availableLines).toHaveLength(3);
    expect(result.selectedLines).toEqual([]);
    expect(result.selectedCount).toBe(0);
  });

  it("returns no selection for negative requested count", () => {
    const result = selectLinesToHide(sample, -3, () => 0);

    expect(result.availableLines).toHaveLength(3);
    expect(result.selectedLines).toEqual([]);
    expect(result.selectedCount).toBe(0);
  });

  it("ignores blank and whitespace-only lines", () => {
    const text =
      "بِسْمِ اللَّهِ\n\n   \nالرَّحْمَٰنِ الرَّحِيمِ";

    const result = selectLinesToHide(text, 5, () => 0);

    expect(result.availableLines).toEqual([
      {
        tokenIndex: 0,
        lineIndex: 0,
        value: "بِسْمِ اللَّهِ",
      },
      {
        tokenIndex: 5,
        lineIndex: 3,
        value: "الرَّحْمَٰنِ الرَّحِيمِ",
      },
    ]);

    expect(result.selectedLines).toHaveLength(2);
  });

  it("selects repeated lines by position", () => {
    const text = "اللَّهِ\nاللَّهِ";

    const result = selectLinesToHide(text, 2, () => 0);

    expect(result.availableLines).toEqual([
      {
        tokenIndex: 0,
        lineIndex: 0,
        value: "اللَّهِ",
      },
      {
        tokenIndex: 2,
        lineIndex: 1,
        value: "اللَّهِ",
      },
    ]);

    expect(result.selectedLines).toHaveLength(2);
    expect(result.selectedLines[0]?.value).toBe("اللَّهِ");
    expect(result.selectedLines[1]?.value).toBe("اللَّهِ");
    expect(result.selectedLines[0]?.lineIndex).not.toBe(
      result.selectedLines[1]?.lineIndex,
    );
  });

  it("sorts selected lines by token position for stable rendering", () => {
    const result = selectLinesToHide(sample, 3, () => 0);

    expect(result.selectedLines.map((line) => line.tokenIndex)).toEqual([
      0,
      2,
      4,
    ]);
  });

  it("adds selection indexes after stable sorting", () => {
    const result = selectLinesToHide(sample, 3, () => 0);

    expect(result.selectedLines.map((line) => line.selectionIndex)).toEqual([
      0,
      1,
      2,
    ]);
  });

  it("gets selected line token indexes", () => {
    const result = selectLinesToHide(sample, 2, () => 0);

    expect(getSelectedLineTokenIndexes(result.selectedLines)).toEqual([2, 4]);
  });

  it("gets selected line indexes", () => {
    const result = selectLinesToHide(sample, 2, () => 0);

    expect(getSelectedLineIndexes(result.selectedLines)).toEqual([1, 2]);
  });

  it("checks whether a line token is selected", () => {
    const result = selectLinesToHide(sample, 2, () => 0);

    expect(isLineTokenSelected(2, result.selectedLines)).toBe(true);
    expect(isLineTokenSelected(4, result.selectedLines)).toBe(true);
    expect(isLineTokenSelected(0, result.selectedLines)).toBe(false);
  });

  it("does not modify original text", () => {
    const original =
      "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ";
    const before = original;

    selectLinesToHide(original, 2, () => 0);

    expect(original).toBe(before);
  });

  it("preserves diacritics in selected lines", () => {
    const result = selectLinesToHide("الرَّحْمَٰنِ الرَّحِيمِ", 1, () => 0);

    expect(result.selectedLines[0]?.value).toBe(
      "الرَّحْمَٰنِ الرَّحِيمِ",
    );
  });

  it("works with CRLF line endings", () => {
    const text = "بِسْمِ اللَّهِ\r\nالرَّحْمَٰنِ الرَّحِيمِ";

    const result = selectLinesToHide(text, 2, () => 0);

    expect(result.availableLines).toEqual([
      {
        tokenIndex: 0,
        lineIndex: 0,
        value: "بِسْمِ اللَّهِ",
      },
      {
        tokenIndex: 2,
        lineIndex: 1,
        value: "الرَّحْمَٰنِ الرَّحِيمِ",
      },
    ]);
  });
});








