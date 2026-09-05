import { API_ENV } from "../config/env";

import {
  ApiError as SharedApiError,
  createApiClient,
  type ApiTokenProvider,
} from "@matn-quiz/api-client";

import { ApiError } from "./ApiError";

import type {
  ApiMutationOptions,
  ApiRequestOptions,
  HttpMethod,
} from "./types";

import { buildApiUrl } from "./url";

import { mobileFetchTransport } from "./sharedFetchTransport";

type AccessTokenProvider = () => string | null | Promise<string | null>;

type RefreshHandler = () => boolean | Promise<boolean>;

type UnauthorizedHandler = () => void | Promise<void>;

type LocalApiErrorCode = NonNullable<
  ConstructorParameters<typeof ApiError>[1]
>["code"];

let accessTokenProvider: AccessTokenProvider | null = null;

let refreshHandler: RefreshHandler | null = null;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setApiAccessTokenProvider(
  provider: AccessTokenProvider | null,
): void {
  accessTokenProvider = provider;
}

export function setApiRefreshHandler(handler: RefreshHandler | null): void {
  refreshHandler = handler;
}

export function setApiUnauthorizedHandler(
  handler: UnauthorizedHandler | null,
): void {
  unauthorizedHandler = handler;
}

const sharedClient = createApiClient({
  /*
   * Mobile buildApiUrl() still builds the real absolute URL.
   */
  baseUrl: "http://matn-quiz.local",

  transport: mobileFetchTransport,

  getAccessToken: (async () =>
    accessTokenProvider
      ? await accessTokenProvider()
      : null) satisfies ApiTokenProvider,

  onUnauthorized: async () => {
    if (refreshHandler) {
      let refreshed = false;

      try {
        refreshed = await refreshHandler();
      } catch {
        refreshed = false;
      }

      if (refreshed) {
        return true;
      }
    }

    if (unauthorizedHandler) {
      await unauthorizedHandler();
    }

    return false;
  },

  defaultTimeoutMs: API_ENV.timeoutMs,

  defaultRetryCount: API_ENV.retryCount,

  retryDelayMs: 300,
});

type InternalRequestOptions<TBody> = ApiRequestOptions & {
  method: HttpMethod;

  body?: TBody;
};

function mapErrorCode(error: SharedApiError): LocalApiErrorCode {
  if (error.code === "PARSE_ERROR") {
    return "PARSE_ERROR";
  }

  if (error.code === "CANCELLED") {
    return "CANCELLED";
  }

  if (error.code === "TIMEOUT") {
    return "TIMEOUT";
  }

  if (error.status !== undefined) {
    return "HTTP_ERROR";
  }

  return "NETWORK_ERROR";
}

function toLocalApiError(
  error: SharedApiError,

  url: string,
): ApiError {
  return new ApiError(error.message, {
    code: mapErrorCode(error),

    status: error.status,

    url,

    details: error.details,

    cause: error,
  });
}

async function request<TResponse, TBody = unknown>(
  path: string,

  options: InternalRequestOptions<TBody>,
): Promise<TResponse> {
  const url = buildApiUrl(path, options.query);

  try {
    return await sharedClient.request<TResponse>(
      options.method,

      url,

      {
        headers: options.headers,

        body: options.body,

        timeoutMs: options.timeoutMs,

        retryCount: options.retries,

        /*
         * Preserve previous Mobile retry behavior.
         */
        retryUnsafeMethods: true,

        /*
         * Legacy auth:false -> shared skipAuth:true
         */
        skipAuth: options.auth === false,

        signal: options.signal,
      },
    );
  } catch (error) {
    if (error instanceof SharedApiError) {
      throw toLocalApiError(error, url);
    }

    throw error;
  }
}

export const apiClient = {
  request,

  get<TResponse>(
    path: string,

    options: ApiRequestOptions = {},
  ): Promise<TResponse> {
    return request<TResponse>(path, {
      ...options,
      method: "GET",
    });
  },

  post<TResponse, TBody = unknown>(
    path: string,

    body?: TBody,

    options: ApiRequestOptions = {},
  ): Promise<TResponse> {
    return request<TResponse, TBody>(path, {
      ...options,

      method: "POST",

      body,
    });
  },

  put<TResponse, TBody = unknown>(
    path: string,

    body?: TBody,

    options: ApiRequestOptions = {},
  ): Promise<TResponse> {
    return request<TResponse, TBody>(path, {
      ...options,

      method: "PUT",

      body,
    });
  },

  patch<TResponse, TBody = unknown>(
    path: string,

    body?: TBody,

    options: ApiRequestOptions = {},
  ): Promise<TResponse> {
    return request<TResponse, TBody>(path, {
      ...options,

      method: "PATCH",

      body,
    });
  },

  delete<TResponse>(
    path: string,

    options: ApiRequestOptions = {},
  ): Promise<TResponse> {
    return request<TResponse>(path, {
      ...options,

      method: "DELETE",
    });
  },
};

export type { ApiMutationOptions };
