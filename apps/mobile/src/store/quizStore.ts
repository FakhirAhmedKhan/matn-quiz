import { create } from "zustand";

import type {
  GeneratedQuiz,
  QuizMethod,
} from "../types/quiz";
import type {
  ReviewResult,
} from "../types/review";
import type {
  QuizHistorySession,
} from "../types/history";
import {
  generateDemoQuiz as buildDemoQuiz,
} from "../utils/demoQuizEngine";
import {
  buildTextPreview,
} from "../utils/history";

type QuizStore = {
  text: string;
  method: QuizMethod;
  hideCount: number;
  generatedQuiz: GeneratedQuiz | null;
  reviewResult: ReviewResult | null;
  historySessions: QuizHistorySession[];

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

  addHistorySession: (
    result: ReviewResult,
  ) => QuizHistorySession | null;

  clearReviewResult: () => void;

  clearGeneratedQuiz: () => void;

  clearHistory: () => void;

  removeHistorySession: (
    sessionId: string,
  ) => void;

  clearText: () => void;

  resetDraft: () => void;
};

const draftInitialState = {
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
      ...draftInitialState,

      historySessions: [],

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
        const state =
          get();

        const count =
          countOverride ??
          state.hideCount;

        const generatedQuiz =
          buildDemoQuiz(
            state.text,
            state.method,
            count,
          );

        if (
          !generatedQuiz
        ) {
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

      addHistorySession: (
        result,
      ) => {
        const state =
          get();

        const quiz =
          state.generatedQuiz;

        if (!quiz) {
          return null;
        }

        const historySession: QuizHistorySession = {
          id: `history-${quiz.id}-${Date.now()}`,
          quizId:
            quiz.id,
          method:
            quiz.method,
          textPreview:
            buildTextPreview(
              quiz.originalText,
            ),
          hiddenCount:
            quiz.hiddenCount,
          total:
            result.total,
          correct:
            result.correct,
          incorrect:
            result.incorrect,
          percentage:
            result.percentage,
          completedAt:
            result.completedAt,
        };

        set((current) => ({
          historySessions: [
            historySession,
            ...current.historySessions.filter(
              (session) =>
                session.quizId !==
                quiz.id,
            ),
          ].slice(0, 50),
        }));

        return historySession;
      },

      clearReviewResult: () =>
        set({
          reviewResult: null,
        }),

      clearGeneratedQuiz: () =>
        set({
          generatedQuiz: null,
          reviewResult: null,
        }),

      clearHistory: () =>
        set({
          historySessions: [],
        }),

      removeHistorySession: (
        sessionId,
      ) =>
        set((state) => ({
          historySessions:
            state.historySessions.filter(
              (session) =>
                session.id !==
                sessionId,
            ),
        })),

      clearText: () =>
        set({
          text: "",
          hideCount: 1,
          generatedQuiz: null,
          reviewResult: null,
        }),

      resetDraft: () =>
        set({
          ...draftInitialState,
        }),
    }),
  );