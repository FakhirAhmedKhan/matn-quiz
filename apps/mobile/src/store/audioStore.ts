import {
  create,
} from "zustand";

import type {
  AudioRepeatMode,
  AudioSegmentMode,
  AudioSourceKind,
  AudioSpeed,
} from "../types/audio";

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
  create<AudioStore>(
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
  );