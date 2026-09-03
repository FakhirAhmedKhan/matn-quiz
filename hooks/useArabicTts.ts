"use client";

import { useCallback, useState } from "react";

export type ArabicTtsStatus =
  | "idle"
  | "loading"
  | "speaking"
  | "stopped"
  | "unsupported"
  | "provider-missing"
  | "empty"
  | "error";

export interface ArabicTtsSpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (status: ArabicTtsStatus, message: string) => void;
}

export interface UseArabicTtsResult {
  status: ArabicTtsStatus;
  isSupported: boolean;
  speak: (text: string, options?: ArabicTtsSpeakOptions) => boolean;
  stop: () => boolean;
}

interface ProviderErrorPayload {
  error?: string;
  code?: string;
}

class ArabicTtsPlaybackError extends Error {
  constructor(
    message: string,
    readonly status: ArabicTtsStatus = "error",
  ) {
    super(message);
    this.name = "ArabicTtsPlaybackError";
  }
}

let activeAudio: HTMLAudioElement | null = null;
let activeObjectUrl: string | null = null;

function getAudioConstructor(): typeof Audio | null {
  if (typeof window !== "undefined" && typeof window.Audio !== "undefined") {
    return window.Audio;
  }

  return null;
}

function canUseObjectUrl(): boolean {
  return (
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function" &&
    typeof URL.revokeObjectURL === "function"
  );
}

export function canUseArabicSpeechSynthesis(): boolean {
  return (
    typeof fetch === "function" &&
    getAudioConstructor() !== null &&
    canUseObjectUrl()
  );
}

function cleanupActiveAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.removeAttribute("src");
    activeAudio.load();
    activeAudio = null;
  }

  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
}

async function parseProviderError(
  response: Response,
): Promise<ArabicTtsPlaybackError> {
  let payload: ProviderErrorPayload = {};

  try {
    payload = (await response.json()) as ProviderErrorPayload;
  } catch {
    payload = {};
  }

  const message =
    payload.error || `Arabic audio request failed with status ${response.status}.`;

  if (response.status === 503 || payload.code === "AZURE_TTS_NOT_CONFIGURED") {
    return new ArabicTtsPlaybackError(message, "provider-missing");
  }

  return new ArabicTtsPlaybackError(message, "error");
}

async function playCloudArabicText(
  text: string,
  options: ArabicTtsSpeakOptions = {},
) {
  if (!canUseArabicSpeechSynthesis()) {
    throw new ArabicTtsPlaybackError(
      "Audio playback is not supported in this browser.",
      "unsupported",
    );
  }

  const response = await fetch("/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw await parseProviderError(response);
  }

  const audioBlob = await response.blob();

  if (audioBlob.size === 0) {
    throw new ArabicTtsPlaybackError("Audio provider returned an empty file.");
  }

  cleanupActiveAudio();

  const AudioConstructor = getAudioConstructor();

  if (!AudioConstructor || !canUseObjectUrl()) {
    throw new ArabicTtsPlaybackError(
      "Audio playback is not supported in this browser.",
      "unsupported",
    );
  }

  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new AudioConstructor(audioUrl);

  activeObjectUrl = audioUrl;
  activeAudio = audio;
  audio.volume = 1;

  audio.onplaying = () => {
    options.onStart?.();
  };

  audio.onended = () => {
    cleanupActiveAudio();
    options.onEnd?.();
  };

  audio.onerror = () => {
    cleanupActiveAudio();
    options.onError?.("error", "Unable to play Arabic audio.");
  };

  await audio.play();
}

export function speakArabicText(
  text: string,
  options: ArabicTtsSpeakOptions = {},
): boolean {
  const speakableText = text.trim();

  if (!speakableText) {
    return false;
  }

  void playCloudArabicText(speakableText, options).catch((error: unknown) => {
    if (error instanceof ArabicTtsPlaybackError) {
      options.onError?.(error.status, error.message);
      return;
    }

    options.onError?.("error", "Unable to play Arabic audio.");
  });

  return true;
}

export function stopArabicSpeech(): boolean {
  cleanupActiveAudio();

  return true;
}

export function useArabicTts(): UseArabicTtsResult {
  const [status, setStatus] = useState<ArabicTtsStatus>("idle");
  const [isSupported, setIsSupported] = useState(true);

  const speak = useCallback(
    (text: string, options: ArabicTtsSpeakOptions = {}) => {
      if (text.trim().length === 0) {
        setStatus("empty");
        return false;
      }

      if (!canUseArabicSpeechSynthesis()) {
        setIsSupported(false);
        setStatus("unsupported");
        return false;
      }

      setIsSupported(true);
      setStatus("loading");

      const didStart = speakArabicText(text, {
        ...options,
        onStart: () => {
          setStatus("speaking");
          options.onStart?.();
        },
        onEnd: () => {
          setStatus("idle");
          options.onEnd?.();
        },
        onError: (nextStatus, message) => {
          setStatus(nextStatus);
          options.onError?.(nextStatus, message);
        },
      });

      if (!didStart) {
        setStatus("error");
      }

      return didStart;
    },
    [],
  );

  const stop = useCallback(() => {
    const didStop = stopArabicSpeech();

    if (didStop) {
      setStatus("stopped");
    }

    return didStop;
  }, []);

  return {
    status,
    isSupported,
    speak,
    stop,
  };
}
