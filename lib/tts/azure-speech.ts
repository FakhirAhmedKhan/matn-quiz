export const AZURE_TTS_DEFAULT_VOICE = "ar-AE-FatimaNeural";
export const AZURE_TTS_OUTPUT_FORMAT = "audio-24khz-96kbitrate-mono-mp3";

export interface AzureSpeechConfig {
  configured: boolean;
  key: string;
  region: string;
  endpoint: string;
  voice: string;
  outputFormat: string;
}

export class AzureSpeechConfigError extends Error {
  code = "AZURE_TTS_NOT_CONFIGURED" as const;

  constructor() {
    super("Azure Speech is not configured. Add AZURE_SPEECH_KEY and AZURE_SPEECH_REGION to .env.local.");
    this.name = "AzureSpeechConfigError";
  }
}

export class AzureSpeechRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseBody: string,
  ) {
    super(message);
    this.name = "AzureSpeechRequestError";
  }
}

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

function normalizeEndpoint(value: string): string {
  return value.replace(/\/+$/u, "");
}

export function getAzureSpeechConfig(
  env: Record<string, string | undefined> = process.env,
): AzureSpeechConfig {
  const key = trimEnv(env.AZURE_SPEECH_KEY);
  const region = trimEnv(env.AZURE_SPEECH_REGION);
  const endpointFromEnv = normalizeEndpoint(trimEnv(env.AZURE_SPEECH_ENDPOINT));
  const voice = trimEnv(env.AZURE_SPEECH_VOICE) || AZURE_TTS_DEFAULT_VOICE;

  const endpoint =
    endpointFromEnv ||
    (region
      ? `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`
      : "");

  return {
    configured: key.length > 0 && endpoint.length > 0,
    key,
    region,
    endpoint,
    voice,
    outputFormat: AZURE_TTS_OUTPUT_FORMAT,
  };
}

export function getVoiceLocale(voice: string): string {
  const match = /^([a-z]{2}-[A-Z]{2})-/u.exec(voice);
  return match?.[1] ?? "ar-AE";
}

export function escapeSsmlText(value: string): string {
  return value
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&apos;");
}

export function buildAzureSpeechSsml(
  text: string,
  voice = AZURE_TTS_DEFAULT_VOICE,
): string {
  const locale = getVoiceLocale(voice);
  const safeText = escapeSsmlText(text.trim());

  return `<speak version="1.0" xml:lang="${locale}"><voice xml:lang="${locale}" name="${voice}">${safeText}</voice></speak>`;
}

export async function synthesizeAzureSpeech(
  text: string,
  config = getAzureSpeechConfig(),
): Promise<ArrayBuffer> {
  if (!config.configured) {
    throw new AzureSpeechConfigError();
  }

  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/ssml+xml",
      "Ocp-Apim-Subscription-Key": config.key,
      "X-Microsoft-OutputFormat": config.outputFormat,
      "User-Agent": "matn-quiz",
    },
    body: buildAzureSpeechSsml(text, config.voice),
  });

  if (!response.ok) {
    const responseBody = await response.text().catch(() => "");
    throw new AzureSpeechRequestError(
      `Azure Speech request failed with status ${response.status}.`,
      response.status,
      responseBody,
    );
  }

  return response.arrayBuffer();
}
