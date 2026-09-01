import { describe, expect, it } from "vitest";
import {
  generateHideWordQuiz,
  hasHiddenWords,
  HIDDEN_WORD_PLACEHOLDER,
  preserveEdgePunctuation,
} from "@/lib/quiz/hide-word-engine";

describe("hide word engine edge cases", () => {
  it("returns original empty text when no text exists", () => {
    const result = generateHideWordQuiz("", 3, () => 0);

    expect(result.originalText).toBe("");
    expect(result.quizText).toBe("");
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
    expect(hasHiddenWords(result)).toBe(false);
  });

  it("returns original whitespace-only text", () => {
    const text = "   \n  ";

    const result = generateHideWordQuiz(text, 2, () => 0);

    expect(result.originalText).toBe(text);
    expect(result.quizText).toBe(text);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("does not hide English words or numbers", () => {
    const text = "hello 123 world";

    const result = generateHideWordQuiz(text, 2, () => 0);

    expect(result.quizText).toBe(text);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("hides only Arabic words from mixed text", () => {
    const text = "Start بِسْمِ 123 اللَّهِ End";

    const result = generateHideWordQuiz(text, 2, () => 0);

    expect(result.hiddenCount).toBe(2);
    expect(result.quizText).toBe("Start ____ 123 ____ End");
    expect(result.answers.map((answer) => answer.answer)).toEqual([
      "بِسْمِ",
      "اللَّهِ",
    ]);
  });

  it("preserves multiple spaces exactly", () => {
    const text = "بِسْمِ     اللَّهِ";

    const result = generateHideWordQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("____     ____");
  });

  it("preserves newlines exactly", () => {
    const text = "بِسْمِ\nاللَّهِ\nالرَّحْمَٰنِ";

    const result = generateHideWordQuiz(text, 3, () => 0);

    expect(result.quizText).toBe("____\n____\n____");
  });

  it("preserves blank lines exactly", () => {
    const text = "بِسْمِ\n\nاللَّهِ";

    const result = generateHideWordQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("____\n\n____");
  });

  it("preserves Arabic comma after hidden word", () => {
    const text = "بِسْمِ،";

    const result = generateHideWordQuiz(text, 1, () => 0);

    expect(result.quizText).toBe("____،");
    expect(result.answers[0]?.answer).toBe("بِسْمِ،");
  });

  it("preserves full stop after hidden word", () => {
    const text = "الرَّحِيمِ.";

    const result = generateHideWordQuiz(text, 1, () => 0);

    expect(result.quizText).toBe("____.");
    expect(result.answers[0]?.answer).toBe("الرَّحِيمِ.");
  });

  it("preserves brackets around hidden word", () => {
    expect(preserveEdgePunctuation("(اللَّهِ)")).toBe("(____)");
  });

  it("preserves punctuation but removes diacritics from visible placeholder", () => {
    expect(preserveEdgePunctuation("الرَّحِيمِ.")).toBe("____.");
    expect(preserveEdgePunctuation("(اللَّهِ)")).toBe("(____)");
    expect(preserveEdgePunctuation("،اللَّهِ،")).toBe("،____،");
  });

  it("preserves Quran diacritics in answers", () => {
    const text = "الرَّحْمَٰنِ";

    const result = generateHideWordQuiz(text, 1, () => 0);

    expect(result.answers[0]?.answer).toBe("الرَّحْمَٰنِ");
    expect(result.quizText).toBe(HIDDEN_WORD_PLACEHOLDER);
  });

  it("keeps repeated words as separate answers", () => {
    const text = "اللَّهِ اللَّهِ اللَّهِ";

    const result = generateHideWordQuiz(text, 3, () => 0);

    expect(result.quizText).toBe("____ ____ ____");
    expect(result.answers).toHaveLength(3);
    expect(result.answers.map((answer) => answer.wordIndex)).toEqual([
      0,
      1,
      2,
    ]);
  });

  it("clamps requested count above available words", () => {
    const text = "بِسْمِ اللَّهِ";

    const result = generateHideWordQuiz(text, 50, () => 0);

    expect(result.requestedCount).toBe(50);
    expect(result.hiddenCount).toBe(2);
    expect(result.quizText).toBe("____ ____");
  });

  it("does not hide anything for zero count", () => {
    const text = "بِسْمِ اللَّهِ";

    const result = generateHideWordQuiz(text, 0, () => 0);

    expect(result.quizText).toBe(text);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("does not hide anything for negative count", () => {
    const text = "بِسْمِ اللَّهِ";

    const result = generateHideWordQuiz(text, -5, () => 0);

    expect(result.quizText).toBe(text);
    expect(result.hiddenCount).toBe(0);
    expect(result.answers).toEqual([]);
  });

  it("creates one-based answer indexes", () => {
    const text = "بِسْمِ اللَّهِ الرَّحْمَٰنِ";

    const result = generateHideWordQuiz(text, 3, () => 0);

    expect(result.answers.map((answer) => answer.index)).toEqual([
      1,
      2,
      3,
    ]);
  });

  it("returns selected token indexes", () => {
    const text = "بِسْمِ اللَّهِ";

    const result = generateHideWordQuiz(text, 2, () => 0);

    expect(result.selectedTokenIndexes).toEqual([0, 2]);
  });

  it("produces deterministic output with injected random", () => {
    const text = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

    const first = generateHideWordQuiz(text, 2, () => 0);
    const second = generateHideWordQuiz(text, 2, () => 0);

    expect(first).toEqual(second);
  });
});
