import {
  create,
} from "zustand";

import type {
  AudioRepeatMode,
  AudioSpeed,
} from "../types/audio";

import type {
  QuizMethod,
} from "../types/quiz";

import type {
  AppSettings,
  BookReaderModePreference,
  PoemReaderModePreference,
  ReaderFontSizePreference,
} from "../types/settings";

export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultQuizMethod:
    "HIDE_WORD",

  defaultHideCount:
    1,

  readerFontSize:
    "MEDIUM",

  defaultPoemReaderMode:
    "FOCUS",

  defaultBookReaderMode:
    "READING",

  defaultAudioSpeed:
    1,

  defaultAudioRepeat:
    "ONE",
};

type SettingsStore =
  AppSettings & {
    setDefaultQuizMethod: (
      value: QuizMethod,
    ) => void;

    setDefaultHideCount: (
      value: number,
    ) => void;

    setReaderFontSize: (
      value: ReaderFontSizePreference,
    ) => void;

    setDefaultPoemReaderMode: (
      value: PoemReaderModePreference,
    ) => void;

    setDefaultBookReaderMode: (
      value: BookReaderModePreference,
    ) => void;

    setDefaultAudioSpeed: (
      value: AudioSpeed,
    ) => void;

    setDefaultAudioRepeat: (
      value: AudioRepeatMode,
    ) => void;

    resetSettings:
      () => void;
  };

export const useSettingsStore =
  create<SettingsStore>(
    (set) => ({
      ...DEFAULT_APP_SETTINGS,

      setDefaultQuizMethod: (
        defaultQuizMethod,
      ) =>
        set({
          defaultQuizMethod,
        }),

      setDefaultHideCount: (
        value,
      ) =>
        set({
          defaultHideCount:
            Math.min(
              10,
              Math.max(
                1,
                Math.floor(value),
              ),
            ),
        }),

      setReaderFontSize: (
        readerFontSize,
      ) =>
        set({
          readerFontSize,
        }),

      setDefaultPoemReaderMode: (
        defaultPoemReaderMode,
      ) =>
        set({
          defaultPoemReaderMode,
        }),

      setDefaultBookReaderMode: (
        defaultBookReaderMode,
      ) =>
        set({
          defaultBookReaderMode,
        }),

      setDefaultAudioSpeed: (
        defaultAudioSpeed,
      ) =>
        set({
          defaultAudioSpeed,
        }),

      setDefaultAudioRepeat: (
        defaultAudioRepeat,
      ) =>
        set({
          defaultAudioRepeat,
        }),

      resetSettings: () =>
        set({
          ...DEFAULT_APP_SETTINGS,
        }),
    }),
  );