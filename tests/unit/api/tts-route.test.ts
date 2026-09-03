import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/tts/route";

const originalEnv = { ...process.env };

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
    process.env = { ...originalEnv };
    delete process.env.AZURE_SPEECH_KEY;
    delete process.env.AZURE_SPEECH_REGION;
    delete process.env.AZURE_SPEECH_ENDPOINT;
    delete process.env.AZURE_SPEECH_VOICE;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    process.env = { ...originalEnv };
  });

  it("returns provider status", async () => {
    const response = await GET();
    const payload = (await response.json()) as { provider: string };

    expect(response.status).toBe(200);
    expect(payload.provider).toBe("azure");
  });

  it("returns 503 when Azure is not configured", async () => {
    const response = await POST(makeRequest({ text: "السلام عليكم" }));
    const payload = (await response.json()) as { code: string };

    expect(response.status).toBe(503);
    expect(payload.code).toBe("AZURE_TTS_NOT_CONFIGURED");
  });

  it("blocks placeholders before provider call", async () => {
    process.env.AZURE_SPEECH_KEY = "test-key";
    process.env.AZURE_SPEECH_REGION = "eastus";

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest({ text: "السلام ____ عليكم" }));
    const payload = (await response.json()) as { code: string };

    expect(response.status).toBe(400);
    expect(payload.code).toBe("TTS_PLACEHOLDER_BLOCKED");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("calls Azure and returns audio", async () => {
    process.env.AZURE_SPEECH_KEY = "test-key";
    process.env.AZURE_SPEECH_REGION = "eastus";

    const fetchMock = vi.fn(async () =>
      new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: { "Content-Type": "audio/mpeg" },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest({ text: "السلام عليكم" }));
    const audio = await response.arrayBuffer();

    expect(response.status).toBe(200);
    expect(audio.byteLength).toBe(3);
    expect(fetchMock).toHaveBeenCalled();
  });
});
