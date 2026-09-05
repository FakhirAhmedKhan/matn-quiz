import {
  useSettingsStore,
} from "../store/settingsStore";

import type {
  AppSettings,
} from "../types/settings";

import {
  serializeSettings,
} from "./profileResponse";

import type {
  AccountPreferences,
} from "./types";

export function getLocalAccountPreferences(): AccountPreferences {
  const state =
    useSettingsStore.getState();

  const settings:
    AppSettings = {
      defaultQuizMethod:
        state.defaultQuizMethod,

      defaultHideCount:
        state.defaultHideCount,

      readerFontSize:
        state.readerFontSize,

      defaultPoemReaderMode:
        state.defaultPoemReaderMode,

      defaultBookReaderMode:
        state.defaultBookReaderMode,

      defaultAudioSpeed:
        state.defaultAudioSpeed,

      defaultAudioRepeat:
        state.defaultAudioRepeat,
    };

  return serializeSettings(
    settings,
  );
}

export function applyRemoteAccountPreferences(
  preferences: AccountPreferences,
): void {
  useSettingsStore.setState(
    preferences,
  );
}