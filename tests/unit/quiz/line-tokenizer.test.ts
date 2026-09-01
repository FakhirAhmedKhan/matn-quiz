import { describe, expect, it } from "vitest";
import {
  countHideableLines,
  createLineTokens,
  getHideableLineTokens,
  rebuildTextFromLineTokens,
  splitTextPreservingLineEndings,
} from "@/lib/quiz/line-tokenizer";

describe("line tokenizer", () => {
  it("splits text while preserving newline", () => {
    const text = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ";

    expect(splitTextPreservingLineEndings(text)).toEqual([
      "بِسْمِ اللَّهِ",
      "\n",
      "الرَّحْمَٰنِ الرَّحِيمِ",
    ]);
  });

  it("preserves Windows CRLF line endings", () => {
    const text = "بِسْمِ اللَّهِ\r\nالرَّحْمَٰنِ الرَّحِيمِ";

    expect(splitTextPreservingLineEndings(text)).toEqual([
      "بِسْمِ اللَّهِ",
      "\r\n",
      "الرَّحْمَٰنِ الرَّحِيمِ",
    ]);
  });

  it("preserves old Mac CR line endings", () => {
    const text = "بِسْمِ اللَّهِ\rالرَّحْمَٰنِ الرَّحِيمِ";

    expect(splitTextPreservingLineEndings(text)).toEqual([
      "بِسْمِ اللَّهِ",
      "\r",
      "الرَّحْمَٰنِ الرَّحِيمِ",
    ]);
  });

  it("preserves blank lines", () => {
    const text = "بِسْمِ اللَّهِ\n\nالرَّحْمَٰنِ الرَّحِيمِ";

    expect(splitTextPreservingLineEndings(text)).toEqual([
      "بِسْمِ اللَّهِ",
      "\n",
      "\n",
      "الرَّحْمَٰنِ الرَّحِيمِ",
    ]);
  });

  it("returns empty array for empty text", () => {
    expect(splitTextPreservingLineEndings("")).toEqual([]);
  });

  it("creates line and newline tokens", () => {
    const tokens = createLineTokens("بِسْمِ اللَّهِ\nالرَّحْمَٰنِ");

    expect(tokens).toEqual([
      {
        index: 0,
        value: "بِسْمِ اللَّهِ",
        type: "line",
        lineIndex: 0,
        isHideable: true,
      },
      {
        index: 1,
        value: "\n",
        type: "newline",
        lineIndex: 0,
        isHideable: false,
      },
      {
        index: 2,
        value: "الرَّحْمَٰنِ",
        type: "line",
        lineIndex: 1,
        isHideable: true,
      },
    ]);
  });

  it("marks whitespace-only line as not hideable", () => {
    const tokens = createLineTokens("بِسْمِ اللَّهِ\n   \nالرَّحْمَٰنِ");

    expect(tokens).toEqual([
      {
        index: 0,
        value: "بِسْمِ اللَّهِ",
        type: "line",
        lineIndex: 0,
        isHideable: true,
      },
      {
        index: 1,
        value: "\n",
        type: "newline",
        lineIndex: 0,
        isHideable: false,
      },
      {
        index: 2,
        value: "   ",
        type: "line",
        lineIndex: 1,
        isHideable: false,
      },
      {
        index: 3,
        value: "\n",
        type: "newline",
        lineIndex: 1,
        isHideable: false,
      },
      {
        index: 4,
        value: "الرَّحْمَٰنِ",
        type: "line",
        lineIndex: 2,
        isHideable: true,
      },
    ]);
  });

  it("gets hideable line tokens only", () => {
    const text = "بِسْمِ اللَّهِ\n   \nالرَّحْمَٰنِ";

    expect(getHideableLineTokens(text)).toEqual([
      {
        tokenIndex: 0,
        lineIndex: 0,
        value: "بِسْمِ اللَّهِ",
      },
      {
        tokenIndex: 4,
        lineIndex: 2,
        value: "الرَّحْمَٰنِ",
      },
    ]);
  });

  it("counts hideable lines", () => {
    const text = "بِسْمِ اللَّهِ\n\nالرَّحْمَٰنِ\n   \nالرَّحِيمِ";

    expect(countHideableLines(text)).toBe(3);
  });

  it("counts one line without newline", () => {
    expect(countHideableLines("بِسْمِ اللَّهِ")).toBe(1);
  });

  it("counts zero lines for whitespace-only text", () => {
    expect(countHideableLines("   \n\n  ")).toBe(0);
  });

  it("preserves line indexes around leading blank line", () => {
    const text = "\nبِسْمِ اللَّهِ\nالرَّحْمَٰنِ";

    expect(getHideableLineTokens(text)).toEqual([
      {
        tokenIndex: 1,
        lineIndex: 1,
        value: "بِسْمِ اللَّهِ",
      },
      {
        tokenIndex: 3,
        lineIndex: 2,
        value: "الرَّحْمَٰنِ",
      },
    ]);
  });

  it("preserves trailing newline when rebuilding", () => {
    const original = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ\n";
    const tokens = createLineTokens(original);

    expect(rebuildTextFromLineTokens(tokens)).toBe(original);
  });

  it("rebuilds original text exactly from tokens", () => {
    const original =
      "بِسْمِ اللَّهِ\r\n\r\nالرَّحْمَٰنِ الرَّحِيمِ\n   \nالْحَمْدُ لِلَّهِ";

    const tokens = createLineTokens(original);

    expect(rebuildTextFromLineTokens(tokens)).toBe(original);
  });

  it("does not remove Quran marks or diacritics", () => {
    const original = "الرَّحْمَٰنِ الرَّحِيمِ";

    const lines = getHideableLineTokens(original);

    expect(lines[0]?.value).toBe(original);
  });
});

