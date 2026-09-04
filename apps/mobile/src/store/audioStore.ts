import {
  create,
} from "zustand";

import type {
  AudioRepeatMode,
  AudioSegmentMode,
  AudioSourceKind,
  AudioSpeed,
} from "../types/audio";

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

const initialState = {
  sourceKind:
    "DEMO" as AudioSourceKind,

  segmentMode:
    "SENTENCE" as AudioSegmentMode,

  selectedSegmentIndex:
    0,

  speed:
    1 as AudioSpeed,

  repeatMode:
    "ONE" as AudioRepeatMode,
};

export const useAudioStore =
  create<AudioStore>(
    (set) => ({
      ...initialState,

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
            ...initialState,
          }),
    }),
  );