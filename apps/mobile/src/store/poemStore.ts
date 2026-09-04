import {
  create,
} from "zustand";

import {
  persist,
} from "zustand/middleware";

import type {
  PoemDraft,
} from "../types/poem";

import {
  STORAGE_KEYS,
  STORAGE_VERSION,
  zustandAsyncStorage,
} from "../storage/appStorage";

const DEMO_POEM_TITLE =
  "نور العلم";

const DEMO_POEM_TEXT =
  `العلم نور في الدروب يضيء
والقلب بالمعنى الجميل يفيء

نسعى إلى علم ينير عقولنا
وبه طريق الخير دوما نرتقي

فاقرأ وتأمل كل معنى صادق
فالعلم يبقى والزمان يمضي`;

type PoemStore =
  PoemDraft & {
    setTitle: (
      title: string,
    ) => void;

    setText: (
      text: string,
    ) => void;

    setDraft: (
      title: string,
      text: string,
    ) => void;

    loadDemoPoem:
      () => void;

    clearPoem:
      () => void;
  };

const initialState: PoemDraft = {
  title: "",
  text: "",
  updatedAt: null,
};

function now(): string {
  return new Date().toISOString();
}

export const usePoemStore =
  create<PoemStore>()(
    persist(
      (set) => ({
        ...initialState,

        setTitle: (
          title,
        ) =>
          set({
            title,
            updatedAt:
              now(),
          }),

        setText: (
          text,
        ) =>
          set({
            text,
            updatedAt:
              now(),
          }),

        setDraft: (
          title,
          text,
        ) =>
          set({
            title,
            text,
            updatedAt:
              now(),
          }),

        loadDemoPoem:
          () =>
            set({
              title:
                DEMO_POEM_TITLE,

              text:
                DEMO_POEM_TEXT,

              updatedAt:
                now(),
            }),

        clearPoem:
          () =>
            set({
              ...initialState,
            }),
      }),
      {
        name:
          STORAGE_KEYS.poem,

        version:
          STORAGE_VERSION,

        storage:
          zustandAsyncStorage,

        partialize: (
          state,
        ) => ({
          title:
            state.title,

          text:
            state.text,

          updatedAt:
            state.updatedAt,
        }),
      },
    ),
  );