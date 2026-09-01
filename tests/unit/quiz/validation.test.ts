import { describe, expect, it } from "vitest";
import {
  getQuranTextInputError,
  validateQuranTextInput,
} from "@/lib/quiz/validation";
import { QURAN_TEXT_MAX_LENGTH } from "@/lib/constants/quiz";

describe("Quran text validation", () => {
  it("rejects empty text", () => {
    const result = validateQuranTextInput("");

    expect(result.valid).toBe(false);
    expect(result.code).toBe("EMPTY_TEXT");
  });

  it("rejects whitespace-only text", () => {
    const result = validateQuranTextInput("     ");

    expect(result.valid).toBe(false);
    expect(result.code).toBe("EMPTY_TEXT");
  });

  it("rejects non-Arabic text", () => {
    const result = validateQuranTextInput("hello world");

    expect(result.valid).toBe(false);
    expect(result.code).toBe("NO_ARABIC_TEXT");
  });

  it("rejects text that exceeds max length", () => {
    const result = validateQuranTextInput("ا".repeat(QURAN_TEXT_MAX_LENGTH + 1));

    expect(result.valid).toBe(false);
    expect(result.code).toBe("TEXT_TOO_LONG");
  });

  it("accepts valid Arabic Quran text", () => {
    const result = validateQuranTextInput(
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    );

    expect(result.valid).toBe(true);
    expect(result.code).toBe("VALID");
  });

  it("preserves diacritics by validating without modifying input", () => {
    const input = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
    const before = input;

    validateQuranTextInput(input);

    expect(input).toBe(before);
  });

  it("returns undefined error for valid text", () => {
    expect(
      getQuranTextInputError("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"),
    ).toBeUndefined();
  });

  it("returns error for invalid text", () => {
    expect(getQuranTextInputError("hello world")).toBe(
      "Text must contain Arabic characters.",
    );
  });
});




















