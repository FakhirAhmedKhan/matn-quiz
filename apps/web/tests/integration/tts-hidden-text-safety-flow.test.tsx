import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";

let fetchMock: ReturnType<typeof vi.fn>;

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
    this.onplaying?.();
    return Promise.resolve();
  }

  pause() {
    return undefined;
  }

  removeAttribute(_name: string) {
    return undefined;
  }

  load() {
    return undefined;
  }
}

function setupCloudAudioMocks() {
  fetchMock = vi.fn(
    async () =>
      new Response(new Blob(["audio"], { type: "audio/mpeg" }), {
        status: 200,
      }),
  );

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

describe("TTS hidden text safety flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    setupCloudAudioMocks();
  });

  it("renders TTS controls after quiz generation and never sends placeholders", async () => {
    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: "بسم الله الرحمن الرحيم" },
    });

    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    const ttsPanel = await screen.findByTestId("arabic-tts-panel");

    expect(ttsPanel).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /speak visible quiz text/i }),
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(requestInit.body)) as { text: string };

    expect(body.text).not.toContain("____");
  });
});
