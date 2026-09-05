import type { ApiMethod } from "./types";

const RETRYABLE_STATUSES = new Set<number>([408, 425, 429, 500, 502, 503, 504]);

export function isRetryableStatus(status: number): boolean {
  return RETRYABLE_STATUSES.has(status);
}

export function isSafeRetryMethod(method: ApiMethod): boolean {
  return method === "GET" || method === "DELETE";
}

export function shouldRetryApiRequest(
  method: ApiMethod,
  status: number | undefined,
  retryUnsafeMethods: boolean,
): boolean {
  if (!retryUnsafeMethods && !isSafeRetryMethod(method)) {
    return false;
  }

  if (status === undefined) {
    return true;
  }

  return isRetryableStatus(status);
}
