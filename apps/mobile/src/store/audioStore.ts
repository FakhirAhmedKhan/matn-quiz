import {
  create,
} from "zustand";

import {
  persist,
} from "zustand/middleware";

import type {
  AudioRepeatMode,
  AudioSegmentMode,
  AudioSourceKind,
  AudioSpeed,
} from "../types/audio";

import {
  STORAGE_KEYS,
  STORAGE_VERSION,
  zustandAsyncStorage,
} from "../storage/appStorage";

import {
  useSettingsStore,
} from "./settingsStore";

type AudioStore = {
  sourceKind:
    AudioSourceKind;

  segmentMode:
    AudioSegmentMode;

  selectedSegmentIndex:
    number;

  speed:
    AudioSpeed;

  repeatMode:
    AudioRepeatMode;

  setSourceKind: (
    sourceKind: AudioSourceKind,
  ) => void;

  setSegmentMode: (
    segmentMode: AudioSegmentMode,
  ) => void;

  setSelectedSegmentIndex: (
    index: number,
  ) => void;

  setSpeed: (
    speed: AudioSpeed,
  ) => void;

  setRepeatMode: (
    repeatMode: AudioRepeatMode,
  ) => void;

  resetAudioSettings:
    () => void;
};

function getAudioDefaults() {
  const settings =
    useSettingsStore.getState();

  return {
    sourceKind:
      "DEMO" as AudioSourceKind,

    segmentMode:
      "SENTENCE" as AudioSegmentMode,

    selectedSegmentIndex:
      0,

    speed:
      settings.defaultAudioSpeed,

    repeatMode:
      settings.defaultAudioRepeat,
  };
}

export const useAudioStore =
  create<AudioStore>()(
    persist(
      (set) => ({
        ...getAudioDefaults(),

        setSourceKind: (
          sourceKind,
        ) =>
          set({
            sourceKind,
            selectedSegmentIndex:
              0,
          }),

        setSegmentMode: (
          segmentMode,
        ) =>
          set({
            segmentMode,
            selectedSegmentIndex:
              0,
          }),

        setSelectedSegmentIndex: (
          selectedSegmentIndex,
        ) =>
          set({
            selectedSegmentIndex,
          }),

        setSpeed: (
          speed,
        ) =>
          set({
            speed,
          }),

        setRepeatMode: (
          repeatMode,
        ) =>
          set({
            repeatMode,
          }),

        resetAudioSettings:
          () =>
            set({
              ...getAudioDefaults(),
            }),
      }),
      {
        name:
          STORAGE_KEYS.audio,

        version:
          STORAGE_VERSION,

        storage:
          zustandAsyncStorage,

        partialize: (
          state,
        ) => ({
          sourceKind:
            state.sourceKind,

          segmentMode:
            state.segmentMode,

          selectedSegmentIndex:
            state.selectedSegmentIndex,

          speed:
            state.speed,

          repeatMode:
            state.repeatMode,
        }),
      },
    ),
  );