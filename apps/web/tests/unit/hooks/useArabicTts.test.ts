import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  canUseArabicSpeechSynthesis,
  speakArabicText,
} from "@/hooks/useArabicTts";

describe("useArabicTts cloud provider helpers", () => {
  it("returns false for empty text", () => {
    expect(speakArabicText("   ")).toBe(false);
  });

  it("exposes browser capability as a boolean", () => {
    expect(typeof canUseArabicSpeechSynthesis()).toBe("boolean");
  });

  it("can render the hook helper without speechSynthesis mocks", () => {
    const { result } = renderHook(() => ({
      supported: canUseArabicSpeechSynthesis(),
    }));

    expect(typeof result.current.supported).toBe("boolean");
  });
});
