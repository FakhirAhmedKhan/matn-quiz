function normalizePath(
  value: string | undefined,
  fallback: string,
): string {
  const resolved =
    value?.trim() ||
    fallback;

  return resolved.startsWith("/")
    ? resolved
    : `/${resolved}`;
}

function positiveInteger(
  value: string | undefined,
  fallback: number,
): number {
  const parsed =
    Number.parseInt(
      value ?? "",
      10,
    );

  if (
    !Number.isFinite(parsed) ||
    parsed <= 0
  ) {
    return fallback;
  }

  return parsed;
}

export const TTS_CONFIG =
  Object.freeze({
    generatePath:
      normalizePath(
        process.env.EXPO_PUBLIC_TTS_GENERATE_PATH,
        "/tts",
      ),

    voicesPath:
      normalizePath(
        process.env.EXPO_PUBLIC_TTS_VOICES_PATH,
        "/tts/voices",
      ),

    maxCharacters:
      positiveInteger(
        process.env.EXPO_PUBLIC_TTS_MAX_CHARACTERS,
        5000,
      ),

    defaultLanguage:
      process.env.EXPO_PUBLIC_TTS_DEFAULT_LANGUAGE
        ?.trim() ||
      "ar",

    defaultFormat:
      process.env.EXPO_PUBLIC_TTS_DEFAULT_FORMAT
        ?.trim() ||
      "mp3",
  });