import {
  TTS_CONFIG,
} from "./ttsConfig";

import type {
  GenerateTtsInput,
  TtsSpeed,
} from "./types";

const VALID_SPEEDS:
  readonly TtsSpeed[] = [
    0.75,
    1,
    1.25,
    1.5,
  ];

export function normalizeGenerateTtsInput(
  input: GenerateTtsInput,
): Required<
  Pick<
    GenerateTtsInput,
    | "text"
    | "language"
    | "speed"
    | "format"
  >
> & {
  voiceId?:
    string;
} {
  const text =
    input.text
      .trim();

  if (!text) {
    throw new Error(
      "Enter text before generating speech.",
    );
  }

  if (
    text.length >
    TTS_CONFIG.maxCharacters
  ) {
    throw new Error(
      `Text is too long. Maximum ${TTS_CONFIG.maxCharacters} characters are allowed.`,
    );
  }

  const speed =
    VALID_SPEEDS.includes(
      input.speed ??
      1,
    )
      ? (
          input.speed ??
          1
        )
      : 1;

  const language =
    input.language
      ?.trim() ||
    TTS_CONFIG.defaultLanguage;

  const format =
    input.format
      ?.trim() ||
    TTS_CONFIG.defaultFormat;

  const voiceId =
    input.voiceId
      ?.trim() ||
    undefined;

  return {
    text,
    language,
    speed,
    format,

    ...(voiceId
      ? {
          voiceId,
        }
      : {}),
  };
}

export function createTtsCacheKey(
  input: GenerateTtsInput,
): string {
  const normalized =
    normalizeGenerateTtsInput(
      input,
    );

  return JSON.stringify({
    text:
      normalized.text,

    language:
      normalized.language,

    voiceId:
      normalized.voiceId ??
      null,

    speed:
      normalized.speed,

    format:
      normalized.format,
  });
}