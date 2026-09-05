import { ApiError, isApiError } from "./ApiError";

import { isRetryableStatus, shouldRetryApiRequest } from "./retry";

import type {
  ApiClient,
  ApiClientOptions,
  ApiHeaders,
  ApiMethod,
  ApiRequestOptions,
  ApiTransportResponse,
} from "./types";

import { buildApiUrl } from "./url";

const DEFAULT_TIMEOUT_MS = 15_000;

const DEFAULT_RETRY_COUNT = 1;

const DEFAULT_RETRY_DELAY_MS = 250;

type TimerHost = {
  setTimeout(handler: () => void, milliseconds: number): unknown;

  clearTimeout(handle: unknown): void;
};

const timerHost = globalThis as unknown as TimerHost;

function defaultSleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    timerHost.setTimeout(resolve, milliseconds);
  });
}

function readErrorMessage(data: unknown, status: number): string {
  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === "object") {
    const candidate = data as {
      message?: unknown;
      error?: unknown;
    };

    if (Array.isArray(candidate.message)) {
      const value = candidate.message.map(String).join(", ").trim();

      if (value) {
        return value;
      }
    }

    if (typeof candidate.message === "string" && candidate.message.trim()) {
      return candidate.message.trim();
    }

    if (typeof candidate.error === "string" && candidate.error.trim()) {
      return candidate.error.trim();
    }
  }

  return `API request failed with status ${status}.`;
}

function createHttpError(response: ApiTransportResponse<unknown>): ApiError {
  return new ApiError(readErrorMessage(response.data, response.status), {
    status: response.status,

    code: `HTTP_${response.status}`,

    details: response.data,

    retryable: isRetryableStatus(response.status),
  });
}

function createCancelledError(cause?: unknown): ApiError {
  return new ApiError("Request cancelled.", {
    code: "CANCELLED",

    retryable: false,

    cause,
  });
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return promise;
  }

  let handle: unknown;

  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    handle = timerHost.setTimeout(() => {
      reject(
        new ApiError(`API request timed out after ${timeoutMs} ms.`, {
          code: "TIMEOUT",

          retryable: true,
        }),
      );
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (handle !== undefined) {
      timerHost.clearTimeout(handle);
    }
  }
}

function mergeHeaders(
  first: ApiHeaders | undefined,

  second: ApiHeaders | undefined,
): ApiHeaders {
  return {
    ...(first ?? {}),
    ...(second ?? {}),
  };
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  if (!options.baseUrl.trim()) {
    throw new Error("createApiClient requires a non-empty baseUrl.");
  }

  const defaultTimeoutMs = options.defaultTimeoutMs ?? DEFAULT_TIMEOUT_MS;

  const defaultRetryCount = Math.max(
    0,
    Math.floor(options.defaultRetryCount ?? DEFAULT_RETRY_COUNT),
  );

  const retryDelayMs = Math.max(
    0,
    options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS,
  );

  const sleep = options.sleep ?? defaultSleep;

  async function request<T>(
    method: ApiMethod,

    path: string,

    requestOptions: ApiRequestOptions = {},
  ): Promise<T> {
    const url = buildApiUrl(options.baseUrl, path, requestOptions.query);

    const timeoutMs = requestOptions.timeoutMs ?? defaultTimeoutMs;

    const retryCount = Math.max(
      0,
      Math.floor(requestOptions.retryCount ?? defaultRetryCount),
    );

    let attempt = 0;

    let unauthorizedRetried = false;

    while (true) {
      if (requestOptions.signal?.aborted) {
        throw createCancelledError();
      }

      const token = requestOptions.skipAuth
        ? null
        : await options.getAccessToken?.();

      const headers = mergeHeaders(
        {
          Accept: "application/json",
        },
        requestOptions.headers,
      );

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      try {
        const response = await withTimeout(
          options.transport<T>({
            method,
            url,
            headers,

            body: requestOptions.body,

            timeoutMs,

            signal: requestOptions.signal,
          }),
          timeoutMs,
        );

        if (response.ok) {
          return response.data;
        }

        if (
          !requestOptions.skipAuth &&
          response.status === 401 &&
          !unauthorizedRetried &&
          options.onUnauthorized
        ) {
          unauthorizedRetried = true;

          const refreshed = await options.onUnauthorized({
            method,
            url,
            status: 401,
          });

          if (refreshed) {
            continue;
          }
        }

        const error = createHttpError(response);

        if (
          attempt < retryCount &&
          shouldRetryApiRequest(
            method,
            response.status,
            requestOptions.retryUnsafeMethods ?? false,
          )
        ) {
          attempt += 1;

          if (retryDelayMs > 0) {
            await sleep(retryDelayMs * attempt);
          }

          continue;
        }

        throw error;
      } catch (error) {
        if (requestOptions.signal?.aborted) {
          throw createCancelledError(error);
        }

        if (isApiError(error)) {
          if (error.status !== undefined) {
            throw error;
          }

          if (error.code === "CANCELLED") {
            throw error;
          }

          if (
            attempt < retryCount &&
            shouldRetryApiRequest(
              method,
              undefined,
              requestOptions.retryUnsafeMethods ?? false,
            )
          ) {
            attempt += 1;

            if (retryDelayMs > 0) {
              await sleep(retryDelayMs * attempt);
            }

            continue;
          }

          throw error;
        }

        if (
          attempt < retryCount &&
          shouldRetryApiRequest(
            method,
            undefined,
            requestOptions.retryUnsafeMethods ?? false,
          )
        ) {
          attempt += 1;

          if (retryDelayMs > 0) {
            await sleep(retryDelayMs * attempt);
          }

          continue;
        }

        throw new ApiError(
          error instanceof Error ? error.message : "API transport failed.",
          {
            code: "TRANSPORT_ERROR",

            retryable: true,

            cause: error,
          },
        );
      }
    }
  }

  return {
    request,

    get<T>(path: string, requestOptions: ApiRequestOptions = {}) {
      return request<T>("GET", path, requestOptions);
    },

    post<T>(
      path: string,
      body?: unknown,
      requestOptions: ApiRequestOptions = {},
    ) {
      return request<T>("POST", path, {
        ...requestOptions,
        body,
      });
    },

    put<T>(
      path: string,
      body?: unknown,
      requestOptions: ApiRequestOptions = {},
    ) {
      return request<T>("PUT", path, {
        ...requestOptions,
        body,
      });
    },

    patch<T>(
      path: string,
      body?: unknown,
      requestOptions: ApiRequestOptions = {},
    ) {
      return request<T>("PATCH", path, {
        ...requestOptions,
        body,
      });
    },

    delete<T>(path: string, requestOptions: ApiRequestOptions = {}) {
      return request<T>("DELETE", path, requestOptions);
    },
  };
}
