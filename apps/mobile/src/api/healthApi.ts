import { apiClient } from "./apiClient";

import { apiEndpoints } from "./endpoints";

export type ApiHealthResponse = Record<string, unknown>;

export function checkApiHealth(
  signal?: AbortSignal,
): Promise<ApiHealthResponse> {
  return apiClient.get<ApiHealthResponse>(apiEndpoints.health, {
    auth: false,

    retries: 0,

    signal,
  });
}
