import { describe, expect, it } from "vitest";
import {
  createHiddenWordToken,
  generateHideWordQuiz,
  hasHiddenWords,
  HIDDEN_WORD_PLACEHOLDER,
  preserveEdgePunctuation,
} from "@/lib/quiz/hide-word-engine";
import { createTextTokens } from "@/lib/quiz/word-tokenizer";

describe("hide word engine", () => {
  const sample = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  it("defines hidden word placeholder", () => {
    expect(HIDDEN_WORD_PLACEHOLDER).toBe("____");
  });

  it("hides selected Arabic words", () => {
    const result = generateHideWordQuiz(sample, 2, () => 0);

    expect(result.method).toBe("HIDE_WORD");
    expect(result.originalText).toBe(sample);
    expect(result.requestedCount).toBe(2);
    expect(result.hiddenCount).toBe(2);
    expect(result.quizText).toContain(HIDDEN_WORD_PLACEHOLDER);
    expect(result.answers).toHaveLength(2);
  });

  it("does not modify the original text", () => {
    const original = sample;

    const result = generateHideWordQuiz(original, 2, () => 0);

    expect(original).toBe(sample);
    expect(result.originalText).toBe(sample);
    expect(result.quizText).not.toBe(sample);
  });

  it("keeps whitespace exactly while hiding words", () => {
    const text = "بِسْمِ   اللَّهِ\nالرَّحْمَٰنِ";

    const result = generateHideWordQuiz(text, 1, () => 0);

    expect(result.quizText).toContain("   ");
    expect(result.quizText).toContain("\n");
  });

  it("creates answer objects with one-based answer indexes", () => {
    const result = generateHideWordQuiz(sample, 2, () => 0);

    expect(result.answers[0]?.index).toBe(1);
    expect(result.answers[1]?.index).toBe(2);
  });

  it("stores original hidden answer text", () => {
    const result = generateHideWordQuiz("اللَّهِ اللَّهِ", 2, () => 0);

    expect(result.answers).toEqual([
      expect.objectContaining({
        index: 1,
        answer: "اللَّهِ",
      }),
      expect.objectContaining({
        index: 2,
        answer: "اللَّهِ",
      }),
    ]);
  });

  it("handles repeated words by position", () => {
    const result = generateHideWordQuiz("اللَّهِ اللَّهِ", 2, () => 0);

    expect(result.hiddenCount).toBe(2);
    expect(result.quizText).toBe("____ ____");
    expect(result.answers[0]?.wordIndex).not.toBe(
      result.answers[1]?.wordIndex,
    );
  });

  it("does not hide non-Arabic text", () => {
    const result = generateHideWordQuiz("hello world 123", 2, () => 0);

    expect(result.quizText).toBe("hello world 123");
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
    expect(hasHiddenWords(result)).toBe(false);
  });

  it("clamps hide count to available Arabic words", () => {
    const result = generateHideWordQuiz(sample, 99, () => 0);

    expect(result.requestedCount).toBe(99);
    expect(result.hiddenCount).toBe(4);
    expect(result.answers).toHaveLength(4);
  });

  it("returns no hidden words for zero hide count", () => {
    const result = generateHideWordQuiz(sample, 0, () => 0);

    expect(result.quizText).toBe(sample);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
    expect(hasHiddenWords(result)).toBe(false);
  });

  it("returns no hidden words for negative hide count", () => {
    const result = generateHideWordQuiz(sample, -2, () => 0);

    expect(result.quizText).toBe(sample);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("supports custom token hiding helper", () => {
    const tokens = createTextTokens("بِسْمِ اللَّهِ");

    const hidden = createHiddenWordToken(tokens[0]!, [0]);

    expect(hidden.value).toBe(HIDDEN_WORD_PLACEHOLDER);
  });

  it("custom token hiding helper leaves non-selected token unchanged", () => {
    const tokens = createTextTokens("بِسْمِ اللَّهِ");

    const original = tokens[0]!;
    const result = createHiddenWordToken(original, [2]);

    expect(result).toBe(original);
  });

  it("supports custom placeholder", () => {
    const tokens = createTextTokens("بِسْمِ اللَّهِ");

    const hidden = createHiddenWordToken(tokens[0]!, [0], "[hidden]");

    expect(hidden.value).toBe("[hidden]");
  });

  it("preserves edge punctuation when hiding selected token", () => {
    expect(preserveEdgePunctuation("الرَّحِيمِ.")).toBe("____.");
    expect(preserveEdgePunctuation("(اللَّهِ)")).toBe("(____)");
    expect(preserveEdgePunctuation("،اللَّهِ،")).toBe("،____،");
  });

  it("reports selected token indexes", () => {
    const result = generateHideWordQuiz(sample, 2, () => 0);

    expect(result.selectedTokenIndexes).toHaveLength(2);
    expect(
      result.selectedTokenIndexes.every((index) => Number.isInteger(index)),
    ).toBe(true);
  });

  it("returns true when result has hidden words", () => {
    const result = generateHideWordQuiz(sample, 1, () => 0);

    expect(hasHiddenWords(result)).toBe(true);
  });

  it("preserves diacritics inside answers", () => {
    const result = generateHideWordQuiz("الرَّحْمَٰنِ", 1, () => 0);

    expect(result.answers[0]?.answer).toBe("الرَّحْمَٰنِ");
  });

  it("creates stable output with deterministic random", () => {
    const first = generateHideWordQuiz(sample, 2, () => 0);
    const second = generateHideWordQuiz(sample, 2, () => 0);

    expect(first).toEqual(second);
  });
});
