import { describe, expect, it } from "vitest";
import {
  createQuizStudyState,
  createStudyAnswerState,
  getAnswerDisplayValue,
  getStudyAnswerState,
  getStudyProgress,
  getVisibleAnswers,
  hideAllAnswers,
  hideAnswer,
  HIDDEN_ANSWER_PLACEHOLDER,
  isAnswerRevealed,
  resetStudyState,
  revealAllAnswers,
  revealAnswer,
  toggleAnswer,
} from "@/lib/quiz/study-session";
import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
} from "@/types/quiz";

describe("study session utilities", () => {
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

  const lineQuiz: GeneratedHideLineQuiz = {
    originalText: "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ",
    quizText: "____\nالرَّحْمَٰنِ الرَّحِيمِ",
    method: "HIDE_LINE",
    requestedCount: 1,
    hiddenCount: 1,
    selectedTokenIndexes: [0],
    selectedLineIndexes: [0],
    answers: [
      {
        index: 1,
        kind: "line",
        lineIndex: 0,
        tokenIndex: 0,
        answer: "بِسْمِ اللَّهِ",
      },
    ],
  };

  it("defines hidden answer placeholder", () => {
    expect(HIDDEN_ANSWER_PLACEHOLDER).toBe("••••");
  });

  it("creates study answer state from generated answer", () => {
    expect(createStudyAnswerState(wordQuiz.answers[0]!)).toEqual({
      answerIndex: 1,
      tokenIndex: 2,
      kind: "word",
      mode: "hidden",
    });
  });

  it("creates quiz study state with all answers hidden", () => {
    const state = createQuizStudyState(wordQuiz);

    expect(state.quiz).toBe(wordQuiz);
    expect(state.answers).toEqual([
      {
        answerIndex: 1,
        tokenIndex: 2,
        kind: "word",
        mode: "hidden",
      },
      {
        answerIndex: 2,
        tokenIndex: 4,
        kind: "word",
        mode: "hidden",
      },
    ]);
  });

  it("supports line quiz study state", () => {
    const state = createQuizStudyState(lineQuiz);

    expect(state.quiz.method).toBe("HIDE_LINE");
    expect(state.answers).toEqual([
      {
        answerIndex: 1,
        tokenIndex: 0,
        kind: "line",
        mode: "hidden",
      },
    ]);
  });

  it("gets answer state by answer index", () => {
    const state = createQuizStudyState(wordQuiz);

    expect(getStudyAnswerState(state, 1)).toEqual({
      answerIndex: 1,
      tokenIndex: 2,
      kind: "word",
      mode: "hidden",
    });
  });

  it("returns undefined for missing answer state", () => {
    const state = createQuizStudyState(wordQuiz);

    expect(getStudyAnswerState(state, 99)).toBeUndefined();
  });

  it("checks whether an answer is revealed", () => {
    const state = createQuizStudyState(wordQuiz);

    expect(isAnswerRevealed(state, 1)).toBe(false);

    const revealedState = revealAnswer(state, 1);

    expect(isAnswerRevealed(revealedState, 1)).toBe(true);
  });

  it("reveals one answer", () => {
    const state = createQuizStudyState(wordQuiz);
    const nextState = revealAnswer(state, 1);

    expect(nextState.answers[0]?.mode).toBe("revealed");
    expect(nextState.answers[1]?.mode).toBe("hidden");
  });

  it("hides one answer", () => {
    const state = revealAllAnswers(createQuizStudyState(wordQuiz));
    const nextState = hideAnswer(state, 1);

    expect(nextState.answers[0]?.mode).toBe("hidden");
    expect(nextState.answers[1]?.mode).toBe("revealed");
  });

  it("toggles hidden answer to revealed", () => {
    const state = createQuizStudyState(wordQuiz);
    const nextState = toggleAnswer(state, 1);

    expect(nextState.answers[0]?.mode).toBe("revealed");
  });

  it("toggles revealed answer to hidden", () => {
    const state = revealAnswer(createQuizStudyState(wordQuiz), 1);
    const nextState = toggleAnswer(state, 1);

    expect(nextState.answers[0]?.mode).toBe("hidden");
  });

  it("reveals all answers", () => {
    const state = createQuizStudyState(wordQuiz);
    const nextState = revealAllAnswers(state);

    expect(nextState.answers.every((answer) => answer.mode === "revealed")).toBe(
      true,
    );
  });

  it("hides all answers", () => {
    const state = revealAllAnswers(createQuizStudyState(wordQuiz));
    const nextState = hideAllAnswers(state);

    expect(nextState.answers.every((answer) => answer.mode === "hidden")).toBe(
      true,
    );
  });

  it("calculates progress when all answers are hidden", () => {
    const state = createQuizStudyState(wordQuiz);

    expect(getStudyProgress(state)).toEqual({
      total: 2,
      revealed: 0,
      hidden: 2,
      complete: false,
      percentage: 0,
    });
  });

  it("calculates progress when one answer is revealed", () => {
    const state = revealAnswer(createQuizStudyState(wordQuiz), 1);

    expect(getStudyProgress(state)).toEqual({
      total: 2,
      revealed: 1,
      hidden: 1,
      complete: false,
      percentage: 50,
    });
  });

  it("calculates progress when all answers are revealed", () => {
    const state = revealAllAnswers(createQuizStudyState(wordQuiz));

    expect(getStudyProgress(state)).toEqual({
      total: 2,
      revealed: 2,
      hidden: 0,
      complete: true,
      percentage: 100,
    });
  });

  it("handles empty quiz progress", () => {
    const emptyQuiz: GeneratedHideWordQuiz = {
      ...wordQuiz,
      quizText: wordQuiz.originalText,
      hiddenCount: 0,
      selectedTokenIndexes: [],
      answers: [],
    };

    const state = createQuizStudyState(emptyQuiz);

    expect(getStudyProgress(state)).toEqual({
      total: 0,
      revealed: 0,
      hidden: 0,
      complete: false,
      percentage: 0,
    });
  });

  it("returns placeholder for hidden answer display", () => {
    const state = createQuizStudyState(wordQuiz);

    expect(getAnswerDisplayValue(wordQuiz.answers[0]!, state)).toBe(
      HIDDEN_ANSWER_PLACEHOLDER,
    );
  });

  it("returns real answer for revealed answer display", () => {
    const state = revealAnswer(createQuizStudyState(wordQuiz), 1);

    expect(getAnswerDisplayValue(wordQuiz.answers[0]!, state)).toBe("اللَّهِ");
  });

  it("supports custom hidden placeholder", () => {
    const state = createQuizStudyState(wordQuiz);

    expect(getAnswerDisplayValue(wordQuiz.answers[0]!, state, "[hidden]")).toBe(
      "[hidden]",
    );
  });

  it("gets visible answers list", () => {
    const state = revealAnswer(createQuizStudyState(wordQuiz), 1);

    expect(getVisibleAnswers(state)).toEqual([
      "اللَّهِ",
      HIDDEN_ANSWER_PLACEHOLDER,
    ]);
  });

  it("resets study state", () => {
    const state = revealAllAnswers(createQuizStudyState(wordQuiz));
    const reset = resetStudyState(state);

    expect(reset.answers.every((answer) => answer.mode === "hidden")).toBe(
      true,
    );
  });

  it("does not mutate original state when revealing", () => {
    const state = createQuizStudyState(wordQuiz);
    const nextState = revealAnswer(state, 1);

    expect(state.answers[0]?.mode).toBe("hidden");
    expect(nextState.answers[0]?.mode).toBe("revealed");
  });

  it("does not mutate original state when hiding", () => {
    const state = revealAllAnswers(createQuizStudyState(wordQuiz));
    const nextState = hideAnswer(state, 1);

    expect(state.answers[0]?.mode).toBe("revealed");
    expect(nextState.answers[0]?.mode).toBe("hidden");
  });
});
