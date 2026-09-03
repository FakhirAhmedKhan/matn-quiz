import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";

class MockSpeechSynthesisUtterance {
  text: string;
  lang = "";
  rate = 1;
  pitch = 1;

  constructor(text: string) {
    this.text = text;
  }
}

describe("TTS hidden text safety flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.stubGlobal("SpeechSynthesisUtterance", MockSpeechSynthesisUtterance);
    vi.stubGlobal("speechSynthesis", {
      cancel: vi.fn(),
      speak: vi.fn(),
    });
  });

  it("renders TTS controls after quiz generation and never speaks placeholders", async () => {
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

    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0];

    expect(JSON.stringify(utterance)).not.toContain("____");
  });
});

