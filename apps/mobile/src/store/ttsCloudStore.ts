import {
  create,
} from "zustand";

import {
  isApiError,
} from "../api/ApiError";

import {
  ttsApi,
} from "../tts-api/ttsApi";

import {
  createTtsCacheKey,
  normalizeGenerateTtsInput,
} from "../tts-api/ttsValidation";

import type {
  GenerateTtsInput,
  GeneratedTtsAudio,
  TtsCloudStatus,
  TtsVoice,
} from "../tts-api/types";

type TtsCloudState = {
  voices:
    TtsVoice[];

  currentAudio:
    GeneratedTtsAudio | null;

  cache:
    Record<
      string,
      GeneratedTtsAudio
    >;

  status:
    TtsCloudStatus;

  error:
    string | null;

  lastGeneratedAt:
    string | null;

  lastCacheHit:
    boolean;

  loadVoices:
    () =>
      Promise<boolean>;

  generate:
    (
      input: GenerateTtsInput,
      force?: boolean,
    ) =>
      Promise<boolean>;

  clearCurrentAudio:
    () =>
      void;

  clearCache:
    () =>
      void;

  clearError:
    () =>
      void;

  reset:
    () =>
      void;
};

function messageOf(
  error: unknown,
): string {
  if (
    isApiError(
      error,
    )
  ) {
    if (
      error.code ===
      "NETWORK_ERROR"
    ) {
      return "Unable to reach the TTS server.";
    }

    if (
      error.code ===
      "TIMEOUT"
    ) {
      return "The TTS request timed out.";
    }

    if (
      error.status ===
      401
    ) {
      return "Your session has expired.";
    }

    if (
      error.status ===
      404
    ) {
      return "TTS endpoint was not found.";
    }

    if (
      error.status ===
      429
    ) {
      return "TTS request limit reached. Try again shortly.";
    }

    return (
      error.message ||
      "Speech generation failed."
    );
  }

  if (
    error instanceof
      Error
  ) {
    return error.message;
  }

  return "Speech generation failed.";
}

export const useTtsCloudStore =
  create<TtsCloudState>(
    (
      set,
    ) => ({
      voices:
        [],

      currentAudio:
        null,

      cache:
        {},

      status:
        "idle",

      error:
        null,

      lastGeneratedAt:
        null,

      lastCacheHit:
        false,

      clearError: () => {
        set({
          error:
            null,
        });
      },

      clearCurrentAudio: () => {
        set({
          currentAudio:
            null,

          status:
            "idle",

          error:
            null,

          lastCacheHit:
            false,
        });
      },

      clearCache: () => {
        set({
          cache:
            {},
        });
      },

      reset: () => {
        set({
          voices:
            [],

          currentAudio:
            null,

          cache:
            {},

          status:
            "idle",

          error:
            null,

          lastGeneratedAt:
            null,

          lastCacheHit:
            false,
        });
      },

      loadVoices:
        async () => {
          set({
            status:
              "loading-voices",

            error:
              null,
          });

          try {
            const voices =
              await ttsApi.getVoices();

            set({
              voices,

              status:
                "idle",

              error:
                null,
            });

            return true;
          } catch (error) {
            set({
              status:
                "idle",

              error:
                messageOf(
                  error,
                ),
            });

            return false;
          }
        },

      generate:
        async (
          input,
          force = false,
        ) => {
          try {
            const normalized =
              normalizeGenerateTtsInput(
                input,
              );

            const cacheKey =
              createTtsCacheKey(
                normalized,
              );

            const state =
              useTtsCloudStore.getState();

            const cached =
              state.cache[
                cacheKey
              ];

            if (
              cached &&
              !force
            ) {
              set({
                currentAudio:
                  cached,

                status:
                  "ready",

                error:
                  null,

                lastGeneratedAt:
                  new Date().toISOString(),

                lastCacheHit:
                  true,
              });

              return true;
            }

            set({
              status:
                "generating",

              error:
                null,

              lastCacheHit:
                false,
            });

            const generated =
              await ttsApi.generate(
                normalized,
              );

            set(
              (
                current,
              ) => ({
                currentAudio:
                  generated,

                cache: {
                  ...current.cache,

                  [cacheKey]:
                    generated,
                },

                status:
                  "ready",

                error:
                  null,

                lastGeneratedAt:
                  new Date().toISOString(),

                lastCacheHit:
                  false,
              }),
            );

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                messageOf(
                  error,
                ),

              lastCacheHit:
                false,
            });

            return false;
          }
        },
    }),
  );