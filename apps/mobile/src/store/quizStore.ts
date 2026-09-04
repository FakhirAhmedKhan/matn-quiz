import { create } from "zustand";

import type {
  GeneratedQuiz,
  QuizMethod,
} from "../types/quiz";
import type {
  ReviewResult,
} from "../types/review";
import {
  generateDemoQuiz as buildDemoQuiz,
} from "../utils/demoQuizEngine";

type QuizStore = {
  text: string;
  method: QuizMethod;
  hideCount: number;
  generatedQuiz: GeneratedQuiz | null;
  reviewResult: ReviewResult | null;

  setText: (
    text: string,
  ) => void;

  setMethod: (
    method: QuizMethod,
  ) => void;

  setHideCount: (
    count: number,
  ) => void;

  generateDemoQuiz: (
    countOverride?: number,
  ) => GeneratedQuiz | null;

  saveReviewResult: (
    result: ReviewResult,
  ) => void;

  clearReviewResult: () => void;

  clearGeneratedQuiz: () => void;

  clearText: () => void;

  resetDraft: () => void;
};

const initialState = {
  text: "",
  method: "HIDE_WORD" as QuizMethod,
  hideCount: 1,
  generatedQuiz:
    null as GeneratedQuiz | null,
  reviewResult:
    null as ReviewResult | null,
};

export const useQuizStore =
  create<QuizStore>(
    (set, get) => ({
      ...initialState,

      setText: (text) =>
        set({
          text,
          generatedQuiz: null,
          reviewResult: null,
        }),

      setMethod: (method) =>
        set({
          method,
          hideCount: 1,
          generatedQuiz: null,
          reviewResult: null,
        }),

      setHideCount: (hideCount) =>
        set({
          hideCount,
          generatedQuiz: null,
          reviewResult: null,
        }),

      generateDemoQuiz: (
        countOverride,
      ) => {
        const state = get();

        const count =
          countOverride ??
          state.hideCount;

        const generatedQuiz =
          buildDemoQuiz(
            state.text,
            state.method,
            count,
          );

        if (!generatedQuiz) {
          return null;
        }

        set({
          hideCount: count,
          generatedQuiz,
          reviewResult: null,
        });

        return generatedQuiz;
      },

      saveReviewResult: (
        reviewResult,
      ) =>
        set({
          reviewResult,
        }),

      clearReviewResult: () =>
        set({
          reviewResult: null,
        }),

      clearGeneratedQuiz: () =>
        set({
          generatedQuiz: null,
          reviewResult: null,
        }),

      clearText: () =>
        set({
          text: "",
          hideCount: 1,
          generatedQuiz: null,
          reviewResult: null,
        }),

      resetDraft: () =>
        set({
          ...initialState,
        }),
    }),
  );