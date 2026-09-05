import type {
  ApiHeaders,
  ApiTransport,
  ApiTransportRequest,
} from "@matn-quiz/api-client";

export type WebFetch = typeof fetch;

export type CreateWebFetchTransportOptions = {
  fetchImpl?: WebFetch;
};

function headersToRecord(headers: Headers): ApiHeaders {
  const result: ApiHeaders = {};

  headers.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }

  const text = await response.text();

  return text || undefined;
}

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function isBlobBody(body: unknown): body is Blob {
  return typeof Blob !== "undefined" && body instanceof Blob;
}

function prepareRequestBody(
  request: ApiTransportRequest,
  headers: ApiHeaders,
): BodyInit | undefined {
  const body = request.body;

  if (body === undefined) {
    return undefined;
  }

  if (isFormDataBody(body)) {
    return body;
  }

  if (isBlobBody(body)) {
    return body;
  }

  if (typeof body === "string") {
    return body;
  }

  if (body instanceof URLSearchParams) {
    return body;
  }

  const hasContentType = Object.keys(headers).some(
    (key) => key.toLowerCase() === "content-type",
  );

  if (!hasContentType) {
    headers["Content-Type"] = "application/json";
  }

  return JSON.stringify(body);
}

export function createWebFetchTransport(
  options: CreateWebFetchTransportOptions = {},
): ApiTransport {
  const fetchImpl = options.fetchImpl ?? fetch;

  return async <T>(request: ApiTransportRequest) => {
    const controller = new AbortController();

    const timeoutHandle =
      request.timeoutMs > 0
        ? globalThis.setTimeout(() => {
            controller.abort();
          }, request.timeoutMs)
        : undefined;

    const headers: ApiHeaders = {
      ...request.headers,
    };

    try {
      const response = await fetchImpl(request.url, {
        method: request.method,

        headers,

        body: prepareRequestBody(request, headers),

        signal: controller.signal,
      });

      return {
        ok: response.ok,

        status: response.status,

        data: (await parseResponseBody(response)) as T,

        headers: headersToRecord(response.headers),
      };
    } finally {
      if (timeoutHandle !== undefined) {
        globalThis.clearTimeout(timeoutHandle);
      }
    }
  };
}
