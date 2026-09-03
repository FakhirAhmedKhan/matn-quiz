import { describe, expect, it } from "vitest";
import { countHideableLines } from "@/lib/quiz/line-tokenizer";
import { selectLinesToHide } from "@/lib/quiz/line-selection";
import {
  generateHideLineQuiz,
  hasHiddenLines,
} from "@/lib/quiz/hide-line-engine";

describe("Phase 6 complete verification", () => {
  const sample =
    "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ";

  it("counts hideable lines", () => {
    expect(countHideableLines(sample)).toBe(3);
  });

  it("selects lines to hide", () => {
    const result = selectLinesToHide(sample, 2, () => 0);

    expect(result.availableLines).toHaveLength(3);
    expect(result.selectedLines).toHaveLength(2);
    expect(result.selectedCount).toBe(2);
  });

  it("generates Hide Line quiz result", () => {
    const result = generateHideLineQuiz(sample, 2, () => 0);

    expect(result.method).toBe("HIDE_LINE");
    expect(result.originalText).toBe(sample);
    expect(result.quizText).toBe(
      "بِسْمِ اللَّهِ\n____\n____",
    );
    expect(result.hiddenCount).toBe(2);
    expect(result.answers).toHaveLength(2);
    expect(hasHiddenLines(result)).toBe(true);
  });

  it("preserves original hidden answers", () => {
    const result = generateHideLineQuiz(sample, 2, () => 0);

    expect(result.answers.map((answer) => answer.answer)).toEqual([
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ",
    ]);
  });

  it("preserves blank lines and line endings", () => {
    const text = "بِسْمِ اللَّهِ\r\n\r\nالرَّحْمَٰنِ";

    const result = generateHideLineQuiz(text, 2, () => 0);

    expect(result.quizText).toBe("____\r\n\r\n____");
    expect(result.hiddenCount).toBe(2);
  });
});





















