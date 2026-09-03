import { describe, expect, it } from "vitest";
import {
  GOOGLE_TRANSLATE_TTS_PROVIDER,
  buildGoogleTranslateTtsUrl,
  getGoogleTranslateTtsConfig,
  splitTextIntoTtsChunks,
} from "@/lib/tts/google-translate-tts";

describe("google-translate-tts demo provider", () => {
  it("is configured without any paid API key", () => {
    const config = getGoogleTranslateTtsConfig({});

    expect(config.configured).toBe(true);
    expect(config.provider).toBe(GOOGLE_TRANSLATE_TTS_PROVIDER);
    expect(config.lang).toBe("ar");
  });

  it("builds a Google Translate TTS URL", () => {
    const url = buildGoogleTranslateTtsUrl("السلام عليكم");

    expect(url).toContain("translate_tts");
    expect(url).toContain("tl=ar");
    expect(url).toContain("client=tw-ob");
  });

  it("splits longer Arabic text into safe chunks", () => {
    const chunks = splitTextIntoTtsChunks(
      "بسم الله الرحمن الرحيم الحمد لله رب العالمين الرحمن الرحيم مالك يوم الدين",
      25,
    );

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length <= 25)).toBe(true);
  });
});
