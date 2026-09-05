function parseInteger(
  value: string | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  const parsed =
    Number.parseInt(
      value ?? "",
      10,
    );

  if (
    !Number.isFinite(parsed) ||
    parsed < minimum ||
    parsed > maximum
  ) {
    return fallback;
  }

  return parsed;
}

function normalizeBaseUrl(
  value: string | undefined,
): string {
  return (
    value
      ?.trim()
      .replace(/\/+$/, "") ??
    ""
  );
}

function normalizePath(
  value: string | undefined,
  fallback: string,
): string {
  const resolved =
    value?.trim() || fallback;

  return resolved.startsWith("/")
    ? resolved
    : `/${resolved}`;
}

export const API_ENV = Object.freeze({
  appEnvironment:
    process.env.EXPO_PUBLIC_APP_ENV?.trim() ||
    "development",

  baseUrl:
    normalizeBaseUrl(
      process.env.EXPO_PUBLIC_API_BASE_URL,
    ),

  healthPath:
    normalizePath(
      process.env.EXPO_PUBLIC_API_HEALTH_PATH,
      "/health",
    ),

  timeoutMs:
    parseInteger(
      process.env.EXPO_PUBLIC_API_TIMEOUT_MS,
      15_000,
      1_000,
      120_000,
    ),

  retryCount:
    parseInteger(
      process.env.EXPO_PUBLIC_API_RETRY_COUNT,
      1,
      0,
      5,
    ),
});

export function isApiConfigured(): boolean {
  return API_ENV.baseUrl.length > 0;
}

export function assertApiConfigured(): void {
  if (!isApiConfigured()) {
    throw new Error(
      "EXPO_PUBLIC_API_BASE_URL is missing. Configure apps/mobile/.env.local before making API requests.",
    );
  }
}

export function getApiConfigurationSummary() {
  return {
    environment:
      API_ENV.appEnvironment,

    baseUrl:
      API_ENV.baseUrl ||
      "NOT_CONFIGURED",

    healthPath:
      API_ENV.healthPath,

    timeoutMs:
      API_ENV.timeoutMs,

    retryCount:
      API_ENV.retryCount,
  } as const;
}