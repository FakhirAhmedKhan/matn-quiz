import { create } from "zustand";

import type {
  QuizMethod,
} from "../types/quiz";

type QuizStore = {
  text: string;
  method: QuizMethod;
  hideCount: number;

  setText: (
    text: string,
  ) => void;

  setMethod: (
    method: QuizMethod,
  ) => void;

  setHideCount: (
    count: number,
  ) => void;

  clearText: () => void;

  resetDraft: () => void;
};

const initialState = {
  text: "",
  method: "HIDE_WORD" as QuizMethod,
  hideCount: 1,
};

export const useQuizStore =
  create<QuizStore>((set) => ({
    ...initialState,

    setText: (text) =>
      set({
        text,
      }),

    setMethod: (method) =>
      set({
        method,
      }),

    setHideCount: (hideCount) =>
      set({
        hideCount,
      }),

    clearText: () =>
      set({
        text: "",
        hideCount: 1,
      }),

    resetDraft: () =>
      set({
        ...initialState,
      }),
  }));