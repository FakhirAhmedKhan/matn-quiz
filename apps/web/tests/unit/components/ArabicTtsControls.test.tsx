import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ArabicTtsControls } from "@/components/quiz/ArabicTtsControls";

let fetchMock: ReturnType<typeof vi.fn>;
let audioPlayMock: ReturnType<typeof vi.fn>;
let audioPauseMock: ReturnType<typeof vi.fn>;

class MockAudio {
  src: string;
  volume = 1;
  onplaying: (() => void) | null = null;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(src: string) {
    this.src = src;
  }

  play() {
    audioPlayMock();
    this.onplaying?.();
    return Promise.resolve();
  }

  pause() {
    audioPauseMock();
  }

  removeAttribute(_name: string) {
    return undefined;
  }

  load() {
    return undefined;
  }
}

function setupCloudAudioMocks(response?: Response) {
  fetchMock = vi.fn(
    async () =>
      response ??
      new Response(new Blob(["audio"], { type: "audio/mpeg" }), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
        },
      }),
  );
  audioPlayMock = vi.fn();
  audioPauseMock = vi.fn();

  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("Audio", MockAudio);

  Object.defineProperty(window, "Audio", {
    value: MockAudio,
    configurable: true,
  });

  Object.defineProperty(URL, "createObjectURL", {
    value: vi.fn(() => "blob:matn-quiz-audio"),
    configurable: true,
  });

  Object.defineProperty(URL, "revokeObjectURL", {
    value: vi.fn(),
    configurable: true,
  });
}

describe("ArabicTtsControls", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    setupCloudAudioMocks();
  });

  it("requests provider audio for visible Arabic text", async () => {
    render(
      <ArabicTtsControls
        speakableText="بسم الرحمن الرحيم"
        label="Speak visible quiz text"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /speak visible quiz text/i }),
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(audioPlayMock).toHaveBeenCalledTimes(1));

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(requestInit.body)) as { text: string };

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/tts",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(body.text).toBe("بسم الرحمن الرحيم");
  });

  it("does not call provider for empty speakable text", () => {
    render(
      <ArabicTtsControls
        speakableText=""
        label="Speak visible quiz text"
        hiddenWarning="Hidden text cannot be played."
      />,
    );

    expect(
      screen.getByRole("button", { name: /speak visible quiz text/i }),
    ).toBeDisabled();
    expect(screen.getByTestId("arabic-tts-status")).toHaveTextContent(
      "Hidden text cannot be played.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows error message when provider fails", async () => {
    setupCloudAudioMocks(
      new Response(
        JSON.stringify({
          code: "GOOGLE_TRANSLATE_TTS_REQUEST_FAILED",
          error: "Provider failed.",
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    render(<ArabicTtsControls speakableText="بسم الله" />);

    fireEvent.click(screen.getByRole("button", { name: /speak visible text/i }));

    await waitFor(() =>
      expect(screen.getByTestId("arabic-tts-status")).toHaveTextContent(
        "Unable to play Arabic audio.",
      ),
    );
  });

  it("stops Arabic audio", async () => {
    render(<ArabicTtsControls speakableText="بسم الله" />);

    fireEvent.click(screen.getByRole("button", { name: /speak visible text/i }));

    await waitFor(() => expect(audioPlayMock).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole("button", { name: /stop arabic audio/i }));

    expect(audioPauseMock).toHaveBeenCalled();
  });
});
