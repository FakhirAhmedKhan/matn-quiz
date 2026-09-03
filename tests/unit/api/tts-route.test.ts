import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/tts/route";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("/api/tts route", () => {
  beforeEach(() => {
    delete process.env.GOOGLE_TRANSLATE_TTS_LANG;
    delete process.env.GOOGLE_TRANSLATE_TTS_CLIENT;
    delete process.env.GOOGLE_TRANSLATE_TTS_ENDPOINT;
    delete process.env.GOOGLE_TRANSLATE_TTS_MAX_CHUNK;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns demo provider status without API key", async () => {
    const response = await GET();
    const payload = (await response.json()) as {
      provider: string;
      configured: boolean;
      lang: string;
    };

    expect(response.status).toBe(200);
    expect(payload.provider).toBe("google-translate-demo");
    expect(payload.configured).toBe(true);
    expect(payload.lang).toBe("ar");
  });

  it("blocks hidden placeholders before provider call", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest({ text: "السلام ____ عليكم" }));
    const payload = (await response.json()) as { code: string };

    expect(response.status).toBe(400);
    expect(payload.code).toBe("TTS_PLACEHOLDER_BLOCKED");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("calls Google Translate TTS and returns audio", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
        },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest({ text: "السلام عليكم" }));
    const audio = await response.arrayBuffer();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("audio/mpeg");
    expect(response.headers.get("X-TTS-Provider")).toBe(
      "google-translate-demo",
    );
    expect(audio.byteLength).toBe(3);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("translate_tts"),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });
});
