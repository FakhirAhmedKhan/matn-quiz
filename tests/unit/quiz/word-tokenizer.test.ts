import { describe, expect, it } from "vitest";
import {
  countHideableArabicWords,
  createTextTokens,
  getArabicWordTokens,
  rebuildTextFromTokens,
  splitTextPreservingWhitespace,
} from "@/lib/quiz/word-tokenizer";

describe("word tokenizer", () => {
  it("splits text while preserving spaces", () => {
    const text = "بِسْمِ اللَّهِ";

    expect(splitTextPreservingWhitespace(text)).toEqual([
      "بِسْمِ",
      " ",
      "اللَّهِ",
    ]);
  });

  it("preserves multiple spaces", () => {
    const text = "بِسْمِ   اللَّهِ";

    expect(splitTextPreservingWhitespace(text)).toEqual([
      "بِسْمِ",
      "   ",
      "اللَّهِ",
    ]);
  });

  it("preserves newlines", () => {
    const text = "بِسْمِ اللَّهِ\nالْحَمْدُ لِلَّهِ";

    expect(splitTextPreservingWhitespace(text)).toEqual([
      "بِسْمِ",
      " ",
      "اللَّهِ",
      "\n",
      "الْحَمْدُ",
      " ",
      "لِلَّهِ",
    ]);
  });

  it("returns empty array for empty text", () => {
    expect(splitTextPreservingWhitespace("")).toEqual([]);
  });

  it("creates typed tokens", () => {
    const tokens = createTextTokens("بِسْمِ 123 اللَّهِ");

    expect(tokens).toEqual([
      {
        index: 0,
        value: "بِسْمِ",
        type: "arabic-word",
      },
      {
        index: 1,
        value: " ",
        type: "whitespace",
      },
      {
        index: 2,
        value: "123",
        type: "text",
      },
      {
        index: 3,
        value: " ",
        type: "whitespace",
      },
      {
        index: 4,
        value: "اللَّهِ",
        type: "arabic-word",
      },
    ]);
  });

  it("gets Arabic word tokens with token index and word index", () => {
    const words = getArabicWordTokens("بِسْمِ 123 اللَّهِ");

    expect(words).toEqual([
      {
        tokenIndex: 0,
        wordIndex: 0,
        value: "بِسْمِ",
      },
      {
        tokenIndex: 4,
        wordIndex: 1,
        value: "اللَّهِ",
      },
    ]);
  });

  it("counts hideable Arabic words", () => {
    expect(
      countHideableArabicWords("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"),
    ).toBe(4);
  });

  it("keeps repeated words as separate positions", () => {
    const words = getArabicWordTokens("اللَّهِ اللَّهِ");

    expect(words).toEqual([
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
  });

  it("preserves punctuation attached to Arabic words", () => {
    const words = getArabicWordTokens("الرَّحِيمِ.");

    expect(words).toEqual([
      {
        tokenIndex: 0,
        wordIndex: 0,
        value: "الرَّحِيمِ.",
      },
    ]);
  });

  it("ignores non-Arabic text as hideable words", () => {
    expect(countHideableArabicWords("hello world 123")).toBe(0);
  });

  it("rebuilds original text exactly from tokens", () => {
    const original =
      "بِسْمِ   اللَّهِ\n\nالرَّحْمَٰنِ الرَّحِيمِ";

    const tokens = createTextTokens(original);

    expect(rebuildTextFromTokens(tokens)).toBe(original);
  });

  it("does not remove Quran marks or diacritics", () => {
    const original = "الرَّحْمَٰنِ";

    const words = getArabicWordTokens(original);

    expect(words[0]?.value).toBe(original);
  });
});
















