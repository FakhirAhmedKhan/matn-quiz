import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ArabicTtsControls } from "@/components/quiz/ArabicTtsControls";

class MockSpeechSynthesisUtterance {
  text: string;
  lang = "";
  rate = 1;
  pitch = 1;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

describe("ArabicTtsControls", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("SpeechSynthesisUtterance", MockSpeechSynthesisUtterance);
    vi.stubGlobal("speechSynthesis", {
      cancel: vi.fn(),
      speak: vi.fn(),
    });
  });

  it("speaks provided visible Arabic text", () => {
    render(
      <ArabicTtsControls
        speakableText="بسم الرحمن الرحيم"
        label="Speak visible quiz text"
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /speak visible quiz text/i }),
    );

    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(1);
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);

    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0];

    expect(utterance).toMatchObject({
      text: "بسم الرحمن الرحيم",
      lang: "ar-SA",
      rate: 0.8,
      pitch: 1,
    });
  });

  it("does not call speech engine for empty speakable text", () => {
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
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it("stops Arabic audio", () => {
    render(<ArabicTtsControls speakableText="بسم الله" />);

    fireEvent.click(screen.getByRole("button", { name: /stop arabic audio/i }));

    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(1);
  });
});





