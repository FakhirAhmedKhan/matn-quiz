import {
  ApiError,
} from "../api/ApiError";

import {
  API_ENV,
} from "../config/env";

import type {
  GeneratedTtsAudio,
  TtsSpeed,
  TtsVoice,
} from "./types";

type UnknownRecord =
  Record<string, unknown>;

function asRecord(
  value: unknown,
): UnknownRecord | null {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return null;
  }

  return value as UnknownRecord;
}

function asString(
  value: unknown,
): string | null {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  if (
    typeof value === "number"
  ) {
    return String(
      value,
    );
  }

  return null;
}

function asNumber(
  value: unknown,
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const parsed =
      Number(
        value,
      );

    if (
      Number.isFinite(parsed)
    ) {
      return parsed;
    }
  }

  return null;
}

function asBoolean(
  value: unknown,
): boolean {
  return (
    value === true ||
    value === "true" ||
    value === 1 ||
    value === "1"
  );
}

function normalizeSpeed(
  value: unknown,
  fallback: TtsSpeed,
): TtsSpeed {
  if (
    value === 0.75 ||
    value === 1 ||
    value === 1.25 ||
    value === 1.5
  ) {
    return value;
  }

  return fallback;
}

function unwrap(
  raw: unknown,
): UnknownRecord {
  const root =
    asRecord(
      raw,
    );

  if (!root) {
    throw new ApiError(
      "TTS API returned an invalid response.",
      {
        code:
          "PARSE_ERROR",

        details:
          raw,
      },
    );
  }

  const data =
    asRecord(
      root.data,
    );

  const audio =
    asRecord(
      root.audio,
    );

  const result =
    asRecord(
      root.result,
    );

  const dataAudio =
    asRecord(
      data?.audio,
    );

  return (
    dataAudio ??
    audio ??
    result ??
    data ??
    root
  );
}

function absoluteAudioUrl(
  value: string,
): string {
  if (
    /^https?:\/\//i.test(
      value,
    ) ||
    value.startsWith(
      "file://",
    ) ||
    value.startsWith(
      "data:",
    )
  ) {
    return value;
  }

  const base =
    API_ENV.baseUrl.replace(
      /\/+$/,
      "",
    );

  if (
    value.startsWith(
      "/",
    )
  ) {
    const match =
      base.match(
        /^(https?:\/\/[^/]+)/i,
      );

    if (
      match?.[1]
    ) {
      return `${match[1]}${value}`;
    }
  }

  return `${base}/${value.replace(/^\/+/, "")}`;
}

export function normalizeGeneratedTtsAudio(
  raw: unknown,
  fallback: {
    text:
      string;

    language:
      string;

    voiceId?:
      string;

    speed:
      TtsSpeed;

    format:
      string;
  },
): GeneratedTtsAudio {
  const value =
    unwrap(
      raw,
    );

  const audioUrl =
    asString(
      value.audioUrl ??
      value.audioURL ??
      value.url ??
      value.fileUrl ??
      value.downloadUrl ??
      value.audio,
    );

  if (!audioUrl) {
    throw new ApiError(
      "TTS response does not contain an audio URL.",
      {
        code:
          "PARSE_ERROR",

        details:
          raw,
      },
    );
  }

  return {
    id:
      asString(
        value.id ??
        value.ttsId ??
        value.audioId,
      ) ??
      `tts-${Date.now()}`,

    audioUrl:
      absoluteAudioUrl(
        audioUrl,
      ),

    text:
      asString(
        value.text,
      ) ??
      fallback.text,

    language:
      asString(
        value.language ??
        value.locale,
      ) ??
      fallback.language,

    voiceId:
      asString(
        value.voiceId ??
        value.voice,
      ) ??
      fallback.voiceId ??
      null,

    speed:
      normalizeSpeed(
        value.speed,
        fallback.speed,
      ),

    format:
      asString(
        value.format,
      ) ??
      fallback.format,

    durationSeconds:
      asNumber(
        value.durationSeconds ??
        value.duration ??
        value.lengthSeconds,
      ),

    contentType:
      asString(
        value.contentType ??
        value.mimeType,
      ),

    createdAt:
      asString(
        value.createdAt,
      ),

    expiresAt:
      asString(
        value.expiresAt,
      ),

    serverCached:
      asBoolean(
        value.cached ??
        value.cacheHit,
      ),
  };
}

function voiceFrom(
  raw: unknown,
  index: number,
): TtsVoice | null {
  const voice =
    asRecord(
      raw,
    );

  if (!voice) {
    if (
      typeof raw ===
        "string" &&
      raw.trim()
    ) {
      return {
        id:
          raw.trim(),

        name:
          raw.trim(),

        language:
          null,

        gender:
          null,

        provider:
          null,
      };
    }

    return null;
  }

  const id =
    asString(
      voice.id ??
      voice.voiceId ??
      voice.code ??
      voice.name,
    );

  if (!id) {
    return null;
  }

  return {
    id,

    name:
      asString(
        voice.name ??
        voice.displayName,
      ) ??
      id ??
      `Voice ${index + 1}`,

    language:
      asString(
        voice.language ??
        voice.locale,
      ),

    gender:
      asString(
        voice.gender,
      ),

    provider:
      asString(
        voice.provider ??
        voice.vendor,
      ),
  };
}

export function normalizeTtsVoices(
  raw: unknown,
): TtsVoice[] {
  let list:
    unknown[] = [];

  if (
    Array.isArray(
      raw,
    )
  ) {
    list =
      raw;
  }
  else {
    const root =
      asRecord(
        raw,
      );

    const data =
      root?.data;

    const dataRecord =
      asRecord(
        data,
      );

    const candidates = [
      root?.voices,
      root?.items,
      data,
      dataRecord?.voices,
      dataRecord?.items,
    ];

    for (
      const candidate of candidates
    ) {
      if (
        Array.isArray(
          candidate,
        )
      ) {
        list =
          candidate;

        break;
      }
    }
  }

  return list
    .map(
      voiceFrom,
    )
    .filter(
      (
        voice,
      ): voice is TtsVoice =>
        voice !==
        null,
    );
}