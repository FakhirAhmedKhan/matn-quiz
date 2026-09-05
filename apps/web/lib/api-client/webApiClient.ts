import {
  createApiClient,
  type ApiClient,
  type ApiTokenProvider,
  type ApiUnauthorizedHandler,
} from "@matn-quiz/api-client";

import { createWebFetchTransport, type WebFetch } from "./fetchTransport";

export type CreateWebApiClientOptions = {
  baseUrl: string;

  fetchImpl?: WebFetch;

  getAccessToken?: ApiTokenProvider;

  onUnauthorized?: ApiUnauthorizedHandler;

  defaultTimeoutMs?: number;

  defaultRetryCount?: number;
};

export function createWebApiClient(
  options: CreateWebApiClientOptions,
): ApiClient {
  return createApiClient({
    baseUrl: options.baseUrl,

    transport: createWebFetchTransport({
      fetchImpl: options.fetchImpl,
    }),

    getAccessToken: options.getAccessToken,

    onUnauthorized: options.onUnauthorized,

    defaultTimeoutMs: options.defaultTimeoutMs,

    defaultRetryCount: options.defaultRetryCount,
  });
}

/**
 * Browser helper.
 *
 * Uses NEXT_PUBLIC_API_BASE_URL when configured.
 * Otherwise uses the current origin.
 *
 * This function is intentionally lazy so importing the module
 * during SSR does not access window.
 */
export function createDefaultBrowserApiClient(): ApiClient {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  const browserOrigin =
    typeof window !== "undefined" ? window.location.origin : undefined;

  const baseUrl = configuredBaseUrl || browserOrigin;

  if (!baseUrl) {
    throw new Error(
      "No Web API base URL is available. Configure NEXT_PUBLIC_API_BASE_URL or create the client in the browser.",
    );
  }

  return createWebApiClient({
    baseUrl,
  });
}
