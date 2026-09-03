import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  clearQuizWorkflowDraft,
  createDefaultQuizWorkflowDraft,
  loadQuizWorkflowDraft,
  QUIZ_WORKFLOW_DRAFT_STORAGE_KEY,
  saveQuizWorkflowDraft,
} from "@/lib/quiz/quiz-workflow-draft";

describe("quiz workflow draft storage", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("returns null when no draft exists", () => {
    expect(
      loadQuizWorkflowDraft(),
    ).toBeNull();
  });

  it("persists text, method, and hide count between page instances", () => {
    expect(
      saveQuizWorkflowDraft({
        quranText:
          "Ø§Ù„Ø³Ù„Ø§Ù… Ø¹Ù„ÙŠÙƒÙ… ÙˆØ±Ø­Ù…Ø© Ø§Ù„Ù„Ù‡",
        quizMethod:
          "HIDE_LINE",
        hideCount: 1,
        generatedQuiz: null,
      }),
    ).toBe(true);

    expect(
      loadQuizWorkflowDraft(),
    ).toEqual({
      version: 1,
      quranText:
        "Ø§Ù„Ø³Ù„Ø§Ù… Ø¹Ù„ÙŠÙƒÙ… ÙˆØ±Ø­Ù…Ø© Ø§Ù„Ù„Ù‡",
      quizMethod:
        "HIDE_LINE",
      hideCount: 1,
      generatedQuiz: null,
    });
  });

  it("rejects malformed stored data", () => {
    window.sessionStorage.setItem(
      QUIZ_WORKFLOW_DRAFT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        quranText: 123,
      }),
    );

    expect(
      loadQuizWorkflowDraft(),
    ).toBeNull();
  });

  it("clears the draft", () => {
    const draft =
      createDefaultQuizWorkflowDraft();

    saveQuizWorkflowDraft({
      quranText:
        draft.quranText,
      quizMethod:
        draft.quizMethod,
      hideCount:
        draft.hideCount,
      generatedQuiz:
        draft.generatedQuiz,
    });

    expect(
      clearQuizWorkflowDraft(),
    ).toBe(true);

    expect(
      loadQuizWorkflowDraft(),
    ).toBeNull();
  });
});