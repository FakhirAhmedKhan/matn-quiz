import {
  API_ENV,
  assertApiConfigured,
} from "../config/env";

import type {
  ApiQuery,
  ApiQueryPrimitive,
} from "./types";

function appendQueryValue(
  params: URLSearchParams,
  key: string,
  value: ApiQueryPrimitive,
): void {
  if (
    value === undefined ||
    value === null
  ) {
    return;
  }

  params.append(
    key,
    String(value),
  );
}

export function buildApiUrl(
  path: string,
  query?: ApiQuery,
): string {
  assertApiConfigured();

  const normalizedPath =
    path.startsWith("/")
      ? path
      : `/${path}`;

  const url =
    `${API_ENV.baseUrl}${normalizedPath}`;

  if (!query) {
    return url;
  }

  const params =
    new URLSearchParams();

  Object.entries(
    query,
  ).forEach(
    ([
      key,
      value,
    ]) => {
      if (
        Array.isArray(value)
      ) {
        value.forEach(
          (item) =>
            appendQueryValue(
              params,
              key,
              item,
            ),
        );

        return;
      }

      appendQueryValue(
        params,
        key,
        value as ApiQueryPrimitive,
      );
    },
  );

  const queryString =
    params.toString();

  return queryString
    ? `${url}?${queryString}`
    : url;
}