import { describe, expect, it } from "vitest";
import {
  AZURE_TTS_DEFAULT_VOICE,
  buildAzureSpeechSsml,
  escapeSsmlText,
  getAzureSpeechConfig,
  getVoiceLocale,
} from "@/lib/tts/azure-speech";

describe("azure-speech provider", () => {
  it("detects missing Azure config", () => {
    const config = getAzureSpeechConfig({});

    expect(config.configured).toBe(false);
    expect(config.voice).toBe(AZURE_TTS_DEFAULT_VOICE);
  });

  it("builds endpoint from region", () => {
    const config = getAzureSpeechConfig({
      AZURE_SPEECH_KEY: "test-key",
      AZURE_SPEECH_REGION: "eastus",
      AZURE_SPEECH_VOICE: "ar-AE-FatimaNeural",
    });

    expect(config.configured).toBe(true);
    expect(config.endpoint).toBe(
      "https://eastus.tts.speech.microsoft.com/cognitiveservices/v1",
    );
  });

  it("gets locale from voice name", () => {
    expect(getVoiceLocale("ar-AE-FatimaNeural")).toBe("ar-AE");
  });

  it("escapes SSML text", () => {
    expect(escapeSsmlText('السلام & <test> "ok"')).toBe(
      "السلام &amp; &lt;test&gt; &quot;ok&quot;",
    );
  });

  it("builds Arabic SSML", () => {
    const ssml = buildAzureSpeechSsml("السلام عليكم", "ar-AE-FatimaNeural");

    expect(ssml).toContain('xml:lang="ar-AE"');
    expect(ssml).toContain('name="ar-AE-FatimaNeural"');
    expect(ssml).toContain("السلام عليكم");
  });
});
