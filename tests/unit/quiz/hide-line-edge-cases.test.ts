import { describe, expect, it } from "vitest";
import {
  generateHideLineQuiz,
  hasHiddenLines,
  HIDDEN_LINE_PLACEHOLDER,
} from "@/lib/quiz/hide-line-engine";

describe("hide line engine edge cases", () => {
  it("returns original empty text when no text exists", () => {
    const result = generateHideLineQuiz("", 3, () => 0);

    expect(result.originalText).toBe("");
    expect(result.quizText).toBe("");
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
    expect(hasHiddenLines(result)).toBe(false);
  });

  it("returns original whitespace-only text", () => {
    const text = "   \n  \n\t";

    const result = generateHideLineQuiz(text, 3, () => 0);

    expect(result.originalText).toBe(text);
    expect(result.quizText).toBe(text);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("hides one single line", () => {
    const text = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

    const result = generateHideLineQuiz(text, 1, () => 0);

    expect(result.quizText).toBe(HIDDEN_LINE_PLACEHOLDER);
    expect(result.hiddenCount).toBe(1);
    expect(result.answers[0]?.answer).toBe(text);
  });

  it("hides all available lines when count equals available lines", () => {
    const text = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ\nالرَّحِيمِ";

    const result = generateHideLineQuiz(text, 3, () => 0);

    expect(result.quizText).toBe("____\n____\n____");
    expect(result.hiddenCount).toBe(3);
    expect(result.answers).toHaveLength(3);
  });

  it("clamps requested count above available lines", () => {
    const text = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ";

    const result = generateHideLineQuiz(text, 99, () => 0);

    expect(result.requestedCount).toBe(99);
    expect(result.hiddenCount).toBe(2);
    expect(result.quizText).toBe("____\n____");
  });

  it("does not hide anything for zero count", () => {
    const text = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ";

    const result = generateHideLineQuiz(text, 0, () => 0);

    expect(result.quizText).toBe(text);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("does not hide anything for negative count", () => {
    const text = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ";

    const result = generateHideLineQuiz(text, -5, () => 0);

    expect(result.quizText).toBe(text);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("preserves blank lines exactly", () => {
    const text = "بِسْمِ اللَّهِ\n\nالرَّحْمَٰنِ";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("____\n\n____");
    expect(result.hiddenCount).toBe(2);
  });

  it("preserves whitespace-only lines exactly", () => {
    const text = "بِسْمِ اللَّهِ\n   \nالرَّحْمَٰنِ";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("____\n   \n____");
    expect(result.hiddenCount).toBe(2);
    expect(result.answers.map((answer) => answer.answer)).toEqual([
      "بِسْمِ اللَّهِ",
      "الرَّحْمَٰنِ",
    ]);
  });

  it("preserves leading newline", () => {
    const text = "\nبِسْمِ اللَّهِ\nالرَّحْمَٰنِ";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("\n____\n____");
    expect(result.hiddenCount).toBe(2);
  });

  it("preserves trailing newline", () => {
    const text = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ\n";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("____\n____\n");
    expect(result.hiddenCount).toBe(2);
  });

  it("preserves multiple trailing newlines", () => {
    const text = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ\n\n";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("____\n____\n\n");
    expect(result.hiddenCount).toBe(2);
  });

  it("preserves CRLF line endings", () => {
    const text = "بِسْمِ اللَّهِ\r\nالرَّحْمَٰنِ\r\nالرَّحِيمِ";

    const result = generateHideLineQuiz(text, 3, () => 0);

    expect(result.quizText).toBe("____\r\n____\r\n____");
    expect(result.hiddenCount).toBe(3);
  });

  it("preserves old Mac CR line endings", () => {
    const text = "بِسْمِ اللَّهِ\rالرَّحْمَٰنِ\rالرَّحِيمِ";

    const result = generateHideLineQuiz(text, 3, () => 0);

    expect(result.quizText).toBe("____\r____\r____");
    expect(result.hiddenCount).toBe(3);
  });

  it("handles mixed Arabic and English lines", () => {
    const text = "English line\nبِسْمِ اللَّهِ\n12345\nالرَّحْمَٰنِ";

    const result = generateHideLineQuiz(text, 4, () => 0);

    expect(result.quizText).toBe("____\n____\n____\n____");
    expect(result.hiddenCount).toBe(4);
    expect(result.answers.map((answer) => answer.answer)).toEqual([
      "English line",
      "بِسْمِ اللَّهِ",
      "12345",
      "الرَّحْمَٰنِ",
    ]);
  });

  it("keeps repeated lines as separate answers", () => {
    const text = "اللَّهِ\nاللَّهِ\nاللَّهِ";

    const result = generateHideLineQuiz(text, 3, () => 0);

    expect(result.quizText).toBe("____\n____\n____");
    expect(result.answers).toHaveLength(3);
    expect(result.answers.map((answer) => answer.lineIndex)).toEqual([
      0,
      1,
      2,
    ]);
  });

  it("preserves punctuation inside answers", () => {
    const text = "بِسْمِ اللَّهِ،\nالرَّحْمَٰنِ.";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("____\n____");
    expect(result.answers.map((answer) => answer.answer)).toEqual([
      "بِسْمِ اللَّهِ،",
      "الرَّحْمَٰنِ.",
    ]);
  });

  it("preserves diacritics inside answers", () => {
    const text = "الرَّحْمَٰنِ الرَّحِيمِ";

    const result = generateHideLineQuiz(text, 1, () => 0);

    expect(result.quizText).toBe("____");
    expect(result.answers[0]?.answer).toBe(
      "الرَّحْمَٰنِ الرَّحِيمِ",
    );
  });

  it("creates one-based answer indexes", () => {
    const text = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ\nالرَّحِيمِ";

    const result = generateHideLineQuiz(text, 3, () => 0);

    expect(result.answers.map((answer) => answer.index)).toEqual([
      1,
      2,
      3,
    ]);
  });

  it("returns selected token indexes and line indexes", () => {
    const text = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ\nالرَّحِيمِ";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.selectedTokenIndexes).toEqual([2, 4]);
    expect(result.selectedLineIndexes).toEqual([1, 2]);
  });

  it("does not mutate original text", () => {
    const original = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ";
    const before = original;

    generateHideLineQuiz(original, 2, () => 0);

    expect(original).toBe(before);
  });

  it("produces deterministic output with injected random", () => {
    const text = "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ\nالرَّحِيمِ";

    const first = generateHideLineQuiz(text, 2, () => 0);
    const second = generateHideLineQuiz(text, 2, () => 0);

    expect(first).toEqual(second);
  });
});

















