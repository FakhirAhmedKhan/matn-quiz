import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
} from "@/types/quiz";
import { QuizTtsPanel } from "@/components/quiz/QuizTtsPanel";

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

const wordQuiz: GeneratedHideWordQuiz = {
  originalText: "بسم الله الرحمن الرحيم",
  quizText: "بسم ____ الرحمن الرحيم",
  method: "HIDE_WORD",
  requestedCount: 1,
  hiddenCount: 1,
  selectedTokenIndexes: [2],
  answers: [
    {
      index: 1,
      tokenIndex: 2,
      wordIndex: 1,
      answer: "الله",
      kind: "word",
    },
  ],
};

const lineQuiz: GeneratedHideLineQuiz = {
  originalText: "بسم الله\nالرحمن الرحيم\nالحمد لله",
  quizText: "بسم الله\n____\nالحمد لله",
  method: "HIDE_LINE",
  requestedCount: 1,
  hiddenCount: 1,
  selectedTokenIndexes: [2],
  selectedLineIndexes: [2],
  answers: [
    {
      index: 1,
      tokenIndex: 2,
      lineIndex: 1,
      answer: "الرحمن الرحيم",
      kind: "line",
    },
  ],
};

describe("QuizTtsPanel", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    setupCloudAudioMocks();
  });

  it("sends visible word quiz text to provider without hidden words", async () => {
    render(<QuizTtsPanel quiz={wordQuiz} />);

    fireEvent.click(
      screen.getByRole("button", { name: /speak visible quiz text/i }),
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(requestInit.body)) as { text: string };

    expect(body.text).toBe("بسم الرحمن الرحيم");
    expect(body.text).not.toContain("الله");
    expect(body.text).not.toContain("____");
  });

  it("sends only requested visible line to provider", async () => {
    render(<QuizTtsPanel quiz={lineQuiz} />);

    expect(screen.getAllByTestId("tts-line-option")).toHaveLength(3);
    expect(
      screen.getByRole("button", {
        name: /hidden line 2 cannot be played/i,
      }),
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", { name: /speak visible line 1/i }),
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(requestInit.body)) as { text: string };

    expect(body.text).toBe("بسم الله");
    expect(body.text).not.toContain("الرحمن الرحيم");
    expect(body.text).not.toContain("____");
  });

  it("keeps visible Arabic line text RTL", () => {
    render(<QuizTtsPanel quiz={lineQuiz} />);

    const visibleLines = screen.getAllByTestId("tts-visible-line-text");

    expect(visibleLines[0]).toHaveAttribute("dir", "rtl");
    expect(visibleLines[0]).toHaveAttribute("lang", "ar");
    expect(visibleLines[1]).toHaveAttribute("dir", "rtl");
    expect(visibleLines[1]).toHaveAttribute("lang", "ar");
  });
});
