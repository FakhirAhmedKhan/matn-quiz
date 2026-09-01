import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  canUseBrowserDownload,
  canUseClipboard,
  copyShareableQuizJsonToClipboard,
  createShareableQuizDownloadPayload,
  createShareableQuizJsonBlob,
  createShareableQuizJsonBlobFromQuiz,
  createShareableQuizJsonText,
  downloadTextFile,
  exportShareableQuizAsJsonFile,
} from "@/lib/quiz/shareable-quiz-export";
import {
  createShareableQuizDocument,
  parseShareableQuizDocument,
  SHAREABLE_QUIZ_MIME_TYPE,
} from "@/lib/quiz/shareable-quiz";
import type { GeneratedHideWordQuiz } from "@/types/quiz";

describe("shareable quiz export utilities", () => {
  const exportedAt = new Date("2026-09-01T00:00:00.000Z");

  const wordQuiz: GeneratedHideWordQuiz = {
    originalText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    quizText: "بِسْمِ ____ ____ الرَّحِيمِ",
    method: "HIDE_WORD",
    requestedCount: 2,
    hiddenCount: 2,
    selectedTokenIndexes: [2, 4],
    answers: [
      {
        index: 1,
        kind: "word",
        wordIndex: 1,
        tokenIndex: 2,
        answer: "اللَّهِ",
      },
      {
        index: 2,
        kind: "word",
        wordIndex: 2,
        tokenIndex: 4,
        answer: "الرَّحْمَٰنِ",
      },
    ],
  };

  beforeEach(() => {
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:matn-quiz-test"),
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("creates shareable quiz JSON text", () => {
    const text = createShareableQuizJsonText(wordQuiz, {
      exportedAt,
    });

    const parsed = parseShareableQuizDocument(text);

    expect(parsed?.appId).toBe("matn-quiz");
    expect(parsed?.version).toBe(1);
    expect(parsed?.exportedAt).toBe("2026-09-01T00:00:00.000Z");
    expect(parsed?.quiz).toEqual(wordQuiz);
  });

  it("supports custom title in JSON text", () => {
    const text = createShareableQuizJsonText(wordQuiz, {
      exportedAt,
      title: "Custom JSON Export",
    });

    expect(parseShareableQuizDocument(text)?.metadata.title).toBe(
      "Custom JSON Export",
    );
  });

  it("creates shareable quiz JSON blob from document", async () => {
    const document = createShareableQuizDocument(wordQuiz, {
      exportedAt,
    });

    const blob = createShareableQuizJsonBlob(document);

    expect(blob.type).toBe(SHAREABLE_QUIZ_MIME_TYPE);
    expect(await blob.text()).toBe(JSON.stringify(document, null, 2));
  });

  it("creates shareable quiz JSON blob from quiz", async () => {
    const blob = createShareableQuizJsonBlobFromQuiz(wordQuiz, {
      exportedAt,
    });

    expect(blob.type).toBe(SHAREABLE_QUIZ_MIME_TYPE);

    const parsed = parseShareableQuizDocument(await blob.text());

    expect(parsed?.quiz).toEqual(wordQuiz);
  });

  it("detects browser download support", () => {
    expect(canUseBrowserDownload()).toBe(true);
  });

  it("downloads text file", () => {
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    expect(
      downloadTextFile({
        fileName: "test.txt",
        content: "hello",
      }),
    ).toBe(true);

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:matn-quiz-test");

    clickSpy.mockRestore();
  });

  it("exports shareable quiz as JSON file", () => {
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    expect(
      exportShareableQuizAsJsonFile(wordQuiz, {
        exportedAt,
      }),
    ).toBe(true);

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });

  it("exports shareable quiz using custom file name", () => {
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    expect(
      exportShareableQuizAsJsonFile(wordQuiz, {
        exportedAt,
        fileName: "custom-quiz.json",
      }),
    ).toBe(true);

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });

  it("creates shareable quiz download payload", () => {
    const payload = createShareableQuizDownloadPayload(wordQuiz, {
      exportedAt,
    });

    expect(payload.fileName).toBe("matn-quiz-hide-words-2026-09-01.json");
    expect(payload.mimeType).toBe(SHAREABLE_QUIZ_MIME_TYPE);
    expect(parseShareableQuizDocument(payload.content)?.quiz).toEqual(wordQuiz);
  });

  it("creates shareable quiz download payload with custom file name", () => {
    const payload = createShareableQuizDownloadPayload(wordQuiz, {
      exportedAt,
      fileName: "my-export.json",
      title: "My Export",
    });

    expect(payload.fileName).toBe("my-export.json");
    expect(parseShareableQuizDocument(payload.content)?.metadata.title).toBe(
      "My Export",
    );
  });

  it("detects clipboard support", () => {
    expect(canUseClipboard()).toBe(true);
  });

  it("copies shareable quiz JSON to clipboard", async () => {
    await expect(
      copyShareableQuizJsonToClipboard(wordQuiz, {
        exportedAt,
      }),
    ).resolves.toBe(true);

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);

    const copiedText = vi.mocked(navigator.clipboard.writeText).mock.calls[0]?.[0];

    expect(parseShareableQuizDocument(copiedText)).not.toBeNull();
  });

  it("returns false when clipboard write fails", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValue(new Error("Copy failed")),
      },
    });

    await expect(
      copyShareableQuizJsonToClipboard(wordQuiz, {
        exportedAt,
      }),
    ).resolves.toBe(false);
  });
});








