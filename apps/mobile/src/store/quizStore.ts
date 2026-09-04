import { create } from "zustand";

import type {
  GeneratedQuiz,
  QuizMethod,
} from "../types/quiz";
import {
  generateDemoQuiz,
} from "../utils/demoQuizEngine";

type QuizStore = {
  text: string;
  method: QuizMethod;
  hideCount: number;
  generatedQuiz: GeneratedQuiz | null;

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
};

export const useQuizStore =
  create<QuizStore>(
    (set, get) => ({
      ...initialState,

      setText: (text) =>
        set({
          text,
          generatedQuiz: null,
        }),

      setMethod: (method) =>
        set({
          method,
          hideCount: 1,
          generatedQuiz: null,
        }),

      setHideCount: (hideCount) =>
        set({
          hideCount,
          generatedQuiz: null,
        }),

      generateDemoQuiz: (
        countOverride,
      ) => {
        const state = get();

        const count =
          countOverride ??
          state.hideCount;

        const generatedQuiz =
          generateDemoQuiz(
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
        });

        return generatedQuiz;
      },

      clearGeneratedQuiz: () =>
        set({
          generatedQuiz: null,
        }),

      clearText: () =>
        set({
          text: "",
          hideCount: 1,
          generatedQuiz: null,
        }),

      resetDraft: () =>
        set({
          ...initialState,
        }),
    }),
  );