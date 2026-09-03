import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearQuizFlowDraft,
  createQuizFlowDraft,
  hasGeneratedQuiz,
  hasQuizFlowText,
  loadQuizFlowDraft,
  QUIZ_FLOW_STORAGE_KEY,
  saveQuizFlowDraft,
  saveQuizFlowGeneratedQuiz,
  updateQuizFlowHideCount,
  updateQuizFlowMethod,
  updateQuizFlowText,
} from "@/lib/quiz/quiz-flow-storage";

describe("quiz flow storage", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.useRealTimers();
  });

  it("creates a default draft", () => {
    const draft = createQuizFlowDraft();

    expect(draft.quranText).toBe("");
    expect(draft.method).toBe("HIDE_WORDS");
    expect(draft.hideCount).toBe(1);
    expect(draft.generatedQuiz).toBeNull();
  });

  it("saves and loads a draft from session storage", () => {
    saveQuizFlowDraft({
      quranText: "بِسْمِ اللَّهِ",
      method: "HIDE_LINES",
      hideCount: 2,
    });

    const draft = loadQuizFlowDraft();

    expect(draft.quranText).toBe("بِسْمِ اللَّهِ");
    expect(draft.method).toBe("HIDE_LINES");
    expect(draft.hideCount).toBe(2);
  });

  it("clears generated quiz when text changes", () => {
    saveQuizFlowGeneratedQuiz({ id: "quiz-1" });

    const draft = updateQuizFlowText("الْحَمْدُ لِلَّهِ");

    expect(draft.quranText).toBe("الْحَمْدُ لِلَّهِ");
    expect(draft.generatedQuiz).toBeNull();
  });

  it("clears generated quiz when method changes", () => {
    saveQuizFlowGeneratedQuiz({ id: "quiz-1" });

    const draft = updateQuizFlowMethod("HIDE_LINES");

    expect(draft.method).toBe("HIDE_LINES");
    expect(draft.generatedQuiz).toBeNull();
  });

  it("clears generated quiz when hide count changes", () => {
    saveQuizFlowGeneratedQuiz({ id: "quiz-1" });

    const draft = updateQuizFlowHideCount(3);

    expect(draft.hideCount).toBe(3);
    expect(draft.generatedQuiz).toBeNull();
  });

  it("saves generated quiz", () => {
    const draft = saveQuizFlowGeneratedQuiz({
      id: "quiz-1",
      mode: "words",
    });

    expect(draft.generatedQuiz).toEqual({
      id: "quiz-1",
      mode: "words",
    });
    expect(hasGeneratedQuiz(draft)).toBe(true);
  });

  it("detects quiz flow text", () => {
    expect(hasQuizFlowText(createQuizFlowDraft({ quranText: "" }))).toBe(false);
    expect(hasQuizFlowText(createQuizFlowDraft({ quranText: "  " }))).toBe(false);
    expect(hasQuizFlowText(createQuizFlowDraft({ quranText: "بسم الله" }))).toBe(true);
  });

  it("repairs invalid storage JSON", () => {
    window.sessionStorage.setItem(QUIZ_FLOW_STORAGE_KEY, "{bad-json");

    const draft = loadQuizFlowDraft();

    expect(draft.quranText).toBe("");
    expect(window.sessionStorage.getItem(QUIZ_FLOW_STORAGE_KEY)).toBeNull();
  });

  it("normalizes invalid values", () => {
    window.sessionStorage.setItem(
      QUIZ_FLOW_STORAGE_KEY,
      JSON.stringify({
        quranText: 123,
        method: "BAD_METHOD",
        hideCount: -5,
        generatedQuiz: "bad",
      }),
    );

    const draft = loadQuizFlowDraft();

    expect(draft.quranText).toBe("");
    expect(draft.method).toBe("HIDE_WORDS");
    expect(draft.hideCount).toBe(1);
    expect(draft.generatedQuiz).toBeNull();
  });

  it("clears the draft", () => {
    saveQuizFlowDraft({
      quranText: "بسم الله",
      method: "HIDE_LINES",
      hideCount: 2,
    });

    const draft = clearQuizFlowDraft();

    expect(draft.quranText).toBe("");
    expect(window.sessionStorage.getItem(QUIZ_FLOW_STORAGE_KEY)).toBeNull();
  });
});