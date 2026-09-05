import {
  normalizeAuthUserResponse,
} from "../auth/authResponse";

import type {
  AppSettings,
} from "../types/settings";

import type {
  AccountPreferences,
  UserProfile,
} from "./types";

function asRecord(
  value: unknown,
): Record<string, unknown> | null {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return null;
  }

  return value as Record<
    string,
    unknown
  >;
}

export function normalizeProfileResponse(
  raw: unknown,
): UserProfile {
  return normalizeAuthUserResponse(
    raw,
  ) as UserProfile;
}

function getPreferencesContainer(
  raw: unknown,
): Record<string, unknown> {
  const root =
    asRecord(
      raw,
    ) ?? {};

  const data =
    asRecord(
      root.data,
    );

  const preferences =
    asRecord(
      root.preferences,
    ) ??
    asRecord(
      data?.preferences,
    ) ??
    data ??
    root;

  return preferences;
}

export function normalizePreferencesResponse(
  raw: unknown,
): AccountPreferences {
  const source =
    getPreferencesContainer(
      raw,
    );

  const output:
    AccountPreferences = {};

  if (
    source.defaultQuizMethod ===
      "HIDE_WORD" ||
    source.defaultQuizMethod ===
      "HIDE_LINE"
  ) {
    output.defaultQuizMethod =
      source.defaultQuizMethod;
  }

  if (
    typeof source.defaultHideCount ===
      "number" &&
    Number.isFinite(
      source.defaultHideCount,
    ) &&
    source.defaultHideCount >= 1
  ) {
    output.defaultHideCount =
      Math.floor(
        source.defaultHideCount,
      );
  }

  if (
    source.readerFontSize ===
      "SMALL" ||
    source.readerFontSize ===
      "MEDIUM" ||
    source.readerFontSize ===
      "LARGE"
  ) {
    output.readerFontSize =
      source.readerFontSize;
  }

  if (
    source.defaultPoemReaderMode ===
      "FOCUS" ||
    source.defaultPoemReaderMode ===
      "ALL"
  ) {
    output.defaultPoemReaderMode =
      source.defaultPoemReaderMode;
  }

  if (
    source.defaultBookReaderMode ===
      "READING" ||
    source.defaultBookReaderMode ===
      "FOCUS"
  ) {
    output.defaultBookReaderMode =
      source.defaultBookReaderMode;
  }

  if (
    source.defaultAudioSpeed === 0.75 ||
    source.defaultAudioSpeed === 1 ||
    source.defaultAudioSpeed === 1.25 ||
    source.defaultAudioSpeed === 1.5
  ) {
    output.defaultAudioSpeed =
      source.defaultAudioSpeed;
  }

  if (
    source.defaultAudioRepeat ===
      "ONE" ||
    source.defaultAudioRepeat ===
      "TWO" ||
    source.defaultAudioRepeat ===
      "THREE" ||
    source.defaultAudioRepeat ===
      "INFINITE"
  ) {
    output.defaultAudioRepeat =
      source.defaultAudioRepeat;
  }

  return output;
}

export function serializeSettings(
  settings: AppSettings,
): AccountPreferences {
  return {
    defaultQuizMethod:
      settings.defaultQuizMethod,

    defaultHideCount:
      settings.defaultHideCount,

    readerFontSize:
      settings.readerFontSize,

    defaultPoemReaderMode:
      settings.defaultPoemReaderMode,

    defaultBookReaderMode:
      settings.defaultBookReaderMode,

    defaultAudioSpeed:
      settings.defaultAudioSpeed,

    defaultAudioRepeat:
      settings.defaultAudioRepeat,
  };
}