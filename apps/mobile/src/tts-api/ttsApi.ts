import {
  apiClient,
} from "../api/apiClient";

import {
  TTS_CONFIG,
} from "./ttsConfig";

import {
  normalizeGeneratedTtsAudio,
  normalizeTtsVoices,
} from "./ttsResponse";

import {
  normalizeGenerateTtsInput,
} from "./ttsValidation";

import type {
  GenerateTtsInput,
  GeneratedTtsAudio,
  TtsVoice,
} from "./types";

export const ttsApi = {
  async getVoices(): Promise<TtsVoice[]> {
    const response =
      await apiClient.get<unknown>(
        TTS_CONFIG.voicesPath,
        {
          retries:
            0,
        },
      );

    return normalizeTtsVoices(
      response,
    );
  },

  async generate(
    input: GenerateTtsInput,
  ): Promise<GeneratedTtsAudio> {
    const normalized =
      normalizeGenerateTtsInput(
        input,
      );

    const response =
      await apiClient.post<
        unknown,
        typeof normalized
      >(
        TTS_CONFIG.generatePath,
        normalized,
        {
          retries:
            0,
        },
      );

    return normalizeGeneratedTtsAudio(
      response,
      normalized,
    );
  },
};