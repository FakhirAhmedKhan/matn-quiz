import { describe, expect, it } from "vitest";
import {
  createHiddenLineToken,
  generateHideLineQuiz,
  hasHiddenLines,
  HIDDEN_LINE_PLACEHOLDER,
} from "@/lib/quiz/hide-line-engine";
import { createLineTokens } from "@/lib/quiz/line-tokenizer";

describe("hide line engine", () => {
  const sample =
    "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ";

  it("defines hidden line placeholder", () => {
    expect(HIDDEN_LINE_PLACEHOLDER).toBe("____");
  });

  it("hides selected lines", () => {
    const result = generateHideLineQuiz(sample, 2, () => 0);

    expect(result.method).toBe("HIDE_LINE");
    expect(result.originalText).toBe(sample);
    expect(result.requestedCount).toBe(2);
    expect(result.hiddenCount).toBe(2);
    expect(result.quizText).toContain(HIDDEN_LINE_PLACEHOLDER);
    expect(result.answers).toHaveLength(2);
  });

  it("does not modify the original text", () => {
    const original = sample;

    const result = generateHideLineQuiz(original, 2, () => 0);

    expect(original).toBe(sample);
    expect(result.originalText).toBe(sample);
    expect(result.quizText).not.toBe(sample);
  });

  it("keeps newline formatting exactly", () => {
    const text = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ\nالرَّحِيمِ";

    const result = generateHideLineQuiz(text, 3, () => 0);

    expect(result.quizText).toBe("____\n____\n____");
  });

  it("keeps CRLF formatting exactly", () => {
    const text = "بِسْمِ اللَّهِ\r\nالرَّحْمَٰنِ";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("____\r\n____");
  });

  it("preserves blank lines", () => {
    const text = "بِسْمِ اللَّهِ\n\nالرَّحْمَٰنِ";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("____\n\n____");
  });

  it("does not hide whitespace-only lines", () => {
    const text = "بِسْمِ اللَّهِ\n   \nالرَّحْمَٰنِ";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("____\n   \n____");
    expect(result.answers).toHaveLength(2);
  });

  it("creates answer objects with one-based indexes", () => {
    const result = generateHideLineQuiz(sample, 2, () => 0);

    expect(result.answers[0]?.index).toBe(1);
    expect(result.answers[1]?.index).toBe(2);
  });

  it("stores original hidden line text", () => {
    const result = generateHideLineQuiz("اللَّهِ\nاللَّهِ", 2, () => 0);

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

  it("handles repeated lines by position", () => {
    const result = generateHideLineQuiz("اللَّهِ\nاللَّهِ", 2, () => 0);

    expect(result.hiddenCount).toBe(2);
    expect(result.quizText).toBe("____\n____");
    expect(result.answers[0]?.lineIndex).not.toBe(
      result.answers[1]?.lineIndex,
    );
  });

  it("clamps hide count to available lines", () => {
    const result = generateHideLineQuiz(sample, 99, () => 0);

    expect(result.requestedCount).toBe(99);
    expect(result.hiddenCount).toBe(3);
    expect(result.answers).toHaveLength(3);
  });

  it("returns no hidden lines for zero hide count", () => {
    const result = generateHideLineQuiz(sample, 0, () => 0);

    expect(result.quizText).toBe(sample);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
    expect(hasHiddenLines(result)).toBe(false);
  });

  it("returns no hidden lines for negative hide count", () => {
    const result = generateHideLineQuiz(sample, -2, () => 0);

    expect(result.quizText).toBe(sample);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("returns original empty text", () => {
    const result = generateHideLineQuiz("", 2, () => 0);

    expect(result.originalText).toBe("");
    expect(result.quizText).toBe("");
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("returns original whitespace-only text", () => {
    const text = "   \n\n  ";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.originalText).toBe(text);
    expect(result.quizText).toBe(text);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("supports custom token hiding helper", () => {
    const tokens = createLineTokens("بِسْمِ اللَّهِ\nالرَّحْمَٰنِ");

    const hidden = createHiddenLineToken(tokens[0]!, [0]);

    expect(hidden.value).toBe(HIDDEN_LINE_PLACEHOLDER);
  });

  it("custom token hiding helper leaves non-selected token unchanged", () => {
    const tokens = createLineTokens("بِسْمِ اللَّهِ\nالرَّحْمَٰنِ");

    const original = tokens[0]!;
    const result = createHiddenLineToken(original, [2]);

    expect(result).toBe(original);
  });

  it("custom token hiding helper never hides newline token", () => {
    const tokens = createLineTokens("بِسْمِ اللَّهِ\nالرَّحْمَٰنِ");

    const newlineToken = tokens[1]!;
    const result = createHiddenLineToken(newlineToken, [1]);

    expect(result).toBe(newlineToken);
  });

  it("custom token hiding helper never hides whitespace-only line token", () => {
    const tokens = createLineTokens("بِسْمِ اللَّهِ\n   \nالرَّحْمَٰنِ");

    const whitespaceLineToken = tokens[2]!;
    const result = createHiddenLineToken(whitespaceLineToken, [2]);

    expect(result).toBe(whitespaceLineToken);
  });

  it("supports custom placeholder", () => {
    const tokens = createLineTokens("بِسْمِ اللَّهِ\nالرَّحْمَٰنِ");

    const hidden = createHiddenLineToken(tokens[0]!, [0], "[hidden line]");

    expect(hidden.value).toBe("[hidden line]");
  });

  it("reports selected token indexes and selected line indexes", () => {
    const result = generateHideLineQuiz(sample, 2, () => 0);

    expect(result.selectedTokenIndexes).toEqual([2, 4]);
    expect(result.selectedLineIndexes).toEqual([1, 2]);
  });

  it("returns true when result has hidden lines", () => {
    const result = generateHideLineQuiz(sample, 1, () => 0);

    expect(hasHiddenLines(result)).toBe(true);
  });

  it("preserves diacritics inside answers", () => {
    const result = generateHideLineQuiz("الرَّحْمَٰنِ الرَّحِيمِ", 1, () => 0);

    expect(result.answers[0]?.answer).toBe("الرَّحْمَٰنِ الرَّحِيمِ");
  });

  it("creates stable output with deterministic random", () => {
    const first = generateHideLineQuiz(sample, 2, () => 0);
    const second = generateHideLineQuiz(sample, 2, () => 0);

    expect(first).toEqual(second);
  });
});
















