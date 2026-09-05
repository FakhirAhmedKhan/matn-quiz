import type { ApiPrimitive, ApiQuery } from "./types";

export function normalizeApiBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/u, "");
}

export function normalizeApiPath(path: string): string {
  const trimmed = path.trim();

  if (/^https?:\/\//iu.test(trimmed)) {
    return trimmed;
  }

  return `/${trimmed.replace(/^\/+/u, "")}`;
}

function encodeQueryValue(value: ApiPrimitive): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  return encodeURIComponent(String(value));
}

export function serializeApiQuery(query: ApiQuery | undefined): string {
  if (!query) {
    return "";
  }

  const parts: string[] = [];

  for (const [key, rawValue] of Object.entries(query)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    for (const value of values) {
      const encoded = encodeQueryValue(value);

      if (encoded === null) {
        continue;
      }

      parts.push(`${encodeURIComponent(key)}=${encoded}`);
    }
  }

  return parts.join("&");
}

export function buildApiUrl(
  baseUrl: string,
  path: string,
  query?: ApiQuery,
): string {
  const normalizedPath = normalizeApiPath(path);

  const url = /^https?:\/\//iu.test(normalizedPath)
    ? normalizedPath
    : `${normalizeApiBaseUrl(baseUrl)}${normalizedPath}`;

  const serializedQuery = serializeApiQuery(query);

  if (!serializedQuery) {
    return url;
  }

  return `${url}${url.includes("?") ? "&" : "?"}${serializedQuery}`;
}
