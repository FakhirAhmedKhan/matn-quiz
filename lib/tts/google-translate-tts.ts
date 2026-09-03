export const GOOGLE_TRANSLATE_TTS_PROVIDER = "google-translate-demo";
export const GOOGLE_TRANSLATE_TTS_DEFAULT_LANG = "ar";
export const GOOGLE_TRANSLATE_TTS_DEFAULT_CLIENT = "tw-ob";
export const GOOGLE_TRANSLATE_TTS_DEFAULT_ENDPOINT =
  "https://translate.google.com/translate_tts";

export interface GoogleTranslateTtsConfig {
  provider: string;
  configured: boolean;
  lang: string;
  client: string;
  endpoint: string;
  maxChunkLength: number;
}

export class GoogleTranslateTtsRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseBody: string,
  ) {
    super(message);
    this.name = "GoogleTranslateTtsRequestError";
  }
}

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function getGoogleTranslateTtsConfig(
  env: Record<string, string | undefined> = process.env,
): GoogleTranslateTtsConfig {
  return {
    provider: GOOGLE_TRANSLATE_TTS_PROVIDER,
    configured: true,
    lang:
      trimEnv(env.GOOGLE_TRANSLATE_TTS_LANG) ||
      GOOGLE_TRANSLATE_TTS_DEFAULT_LANG,
    client:
      trimEnv(env.GOOGLE_TRANSLATE_TTS_CLIENT) ||
      GOOGLE_TRANSLATE_TTS_DEFAULT_CLIENT,
    endpoint:
      trimEnv(env.GOOGLE_TRANSLATE_TTS_ENDPOINT) ||
      GOOGLE_TRANSLATE_TTS_DEFAULT_ENDPOINT,
    maxChunkLength: Number(trimEnv(env.GOOGLE_TRANSLATE_TTS_MAX_CHUNK) || 180),
  };
}

export function splitTextIntoTtsChunks(
  text: string,
  maxChunkLength = 180,
): string[] {
  const normalized = text.replace(/\s+/gu, " ").trim();

  if (!normalized) {
    return [];
  }

  if (normalized.length <= maxChunkLength) {
    return [normalized];
  }

  const chunks: string[] = [];
  let current = "";

  for (const word of normalized.split(" ")) {
    if (word.length > maxChunkLength) {
      if (current) {
        chunks.push(current);
        current = "";
      }

      for (let index = 0; index < word.length; index += maxChunkLength) {
        chunks.push(word.slice(index, index + maxChunkLength));
      }

      continue;
    }

    const next = current ? `${current} ${word}` : word;

    if (next.length > maxChunkLength) {
      if (current) {
        chunks.push(current);
      }

      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

export function buildGoogleTranslateTtsUrl(
  text: string,
  config = getGoogleTranslateTtsConfig(),
): string {
  const url = new URL(config.endpoint);

  url.searchParams.set("ie", "UTF-8");
  url.searchParams.set("q", text);
  url.searchParams.set("tl", config.lang);
  url.searchParams.set("client", config.client);

  return url.toString();
}

function concatArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;

  for (const buffer of buffers) {
    merged.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  return merged.buffer;
}

export async function synthesizeGoogleTranslateSpeech(
  text: string,
  config = getGoogleTranslateTtsConfig(),
): Promise<ArrayBuffer> {
  const chunks = splitTextIntoTtsChunks(text, config.maxChunkLength);

  if (chunks.length === 0) {
    return new ArrayBuffer(0);
  }

  const audioParts: ArrayBuffer[] = [];

  for (const chunk of chunks) {
    const response = await fetch(buildGoogleTranslateTtsUrl(chunk, config), {
      method: "GET",
      headers: {
        Accept: "audio/mpeg,audio/*,*/*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome Safari",
      },
    });

    if (!response.ok) {
      const responseBody = await response.text().catch(() => "");
      throw new GoogleTranslateTtsRequestError(
        `Google Translate TTS request failed with status ${response.status}.`,
        response.status,
        responseBody,
      );
    }

    audioParts.push(await response.arrayBuffer());
  }

  return concatArrayBuffers(audioParts);
}
