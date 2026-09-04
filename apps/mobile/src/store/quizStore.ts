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
import type {
  ActiveStudySession,
} from "../types/resume";
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

  generatedQuiz:
    GeneratedQuiz | null;

  reviewResult:
    ReviewResult | null;

  historySessions:
    QuizHistorySession[];

  activeStudySession:
    ActiveStudySession | null;

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

  startStudySession:
    () => ActiveStudySession | null;

  updateStudyProgress: (
    revealedItemIds: string[],
  ) => void;

  restartStudySession:
    () => ActiveStudySession | null;

  clearActiveStudySession:
    () => void;

  saveReviewResult: (
    result: ReviewResult,
  ) => void;

  addHistorySession: (
    result: ReviewResult,
  ) => QuizHistorySession | null;

  clearReviewResult:
    () => void;

  clearGeneratedQuiz:
    () => void;

  clearHistory:
    () => void;

  removeHistorySession: (
    sessionId: string,
  ) => void;

  clearText:
    () => void;

  resetDraft:
    () => void;
};

const draftInitialState = {
  text: "",

  method:
    "HIDE_WORD" as QuizMethod,

  hideCount: 1,

  generatedQuiz:
    null as GeneratedQuiz | null,

  reviewResult:
    null as ReviewResult | null,

  activeStudySession:
    null as ActiveStudySession | null,
};

function buildActiveSession(
  quiz: GeneratedQuiz,
): ActiveStudySession {
  const now =
    new Date().toISOString();

  return {
    quizId:
      quiz.id,

    method:
      quiz.method,

    textPreview:
      buildTextPreview(
        quiz.originalText,
        180,
      ),

    hiddenCount:
      quiz.hiddenCount,

    revealedItemIds: [],

    startedAt:
      now,

    updatedAt:
      now,
  };
}

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
          activeStudySession: null,
        }),

      setMethod: (method) =>
        set({
          method,
          hideCount: 1,
          generatedQuiz: null,
          reviewResult: null,
          activeStudySession: null,
        }),

      setHideCount: (hideCount) =>
        set({
          hideCount,
          generatedQuiz: null,
          reviewResult: null,
          activeStudySession: null,
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

        const activeStudySession =
          buildActiveSession(
            generatedQuiz,
          );

        set({
          hideCount:
            count,

          generatedQuiz,

          reviewResult:
            null,

          activeStudySession,
        });

        return generatedQuiz;
      },

      startStudySession: () => {
        const state =
          get();

        const quiz =
          state.generatedQuiz;

        if (!quiz) {
          return null;
        }

        if (
          state.activeStudySession
            ?.quizId ===
          quiz.id
        ) {
          return state.activeStudySession;
        }

        const activeStudySession =
          buildActiveSession(
            quiz,
          );

        set({
          activeStudySession,
        });

        return activeStudySession;
      },

      updateStudyProgress: (
        revealedItemIds,
      ) => {
        const state =
          get();

        const quiz =
          state.generatedQuiz;

        if (!quiz) {
          return;
        }

        const hiddenIds =
          new Set(
            quiz.items
              .filter(
                (item) =>
                  item.hidden,
              )
              .map(
                (item) =>
                  item.id,
              ),
          );

        const validIds =
          Array.from(
            new Set(
              revealedItemIds,
            ),
          ).filter(
            (id) =>
              hiddenIds.has(id),
          );

        const current =
          state.activeStudySession;

        const nextSession =
          current &&
          current.quizId === quiz.id
            ? {
                ...current,

                revealedItemIds:
                  validIds,

                updatedAt:
                  new Date().toISOString(),
              }
            : {
                ...buildActiveSession(
                  quiz,
                ),

                revealedItemIds:
                  validIds,

                updatedAt:
                  new Date().toISOString(),
              };

        set({
          activeStudySession:
            nextSession,
        });
      },

      restartStudySession:
        () => {
          const state =
            get();

          const quiz =
            state.generatedQuiz;

          if (!quiz) {
            return null;
          }

          const activeStudySession =
            buildActiveSession(
              quiz,
            );

          set({
            activeStudySession,
            reviewResult: null,
          });

          return activeStudySession;
        },

      clearActiveStudySession:
        () =>
          set({
            activeStudySession:
              null,
          }),

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
          id:
            `history-${quiz.id}-${Date.now()}`,

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

        set(
          (current) => ({
            historySessions: [
              historySession,

              ...current.historySessions.filter(
                (session) =>
                  session.quizId !==
                  quiz.id,
              ),
            ].slice(
              0,
              50,
            ),

            activeStudySession:
              null,
          }),
        );

        return historySession;
      },

      clearReviewResult:
        () =>
          set({
            reviewResult:
              null,
          }),

      clearGeneratedQuiz:
        () =>
          set({
            generatedQuiz:
              null,

            reviewResult:
              null,

            activeStudySession:
              null,
          }),

      clearHistory:
        () =>
          set({
            historySessions: [],
          }),

      removeHistorySession: (
        sessionId,
      ) =>
        set(
          (state) => ({
            historySessions:
              state.historySessions.filter(
                (session) =>
                  session.id !==
                  sessionId,
              ),
          }),
        ),

      clearText:
        () =>
          set({
            text: "",

            hideCount: 1,

            generatedQuiz:
              null,

            reviewResult:
              null,

            activeStudySession:
              null,
          }),

      resetDraft:
        () =>
          set({
            ...draftInitialState,
          }),
    }),
  );