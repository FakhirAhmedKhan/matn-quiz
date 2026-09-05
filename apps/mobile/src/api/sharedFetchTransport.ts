import {
  ApiError,
  type ApiHeaders,
  type ApiTransport,
  type ApiTransportRequest,
} from "@matn-quiz/api-client";

function hasHeader(
  headers: ApiHeaders,

  name: string,
): boolean {
  const normalized = name.toLowerCase();

  return Object.keys(headers).some((key) => key.toLowerCase() === normalized);
}

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function prepareBody(
  request: ApiTransportRequest,

  headers: ApiHeaders,
): BodyInit | undefined {
  const body = request.body;

  if (body === undefined || body === null) {
    return undefined;
  }

  if (isFormDataBody(body)) {
    return body;
  }

  if (typeof body === "string") {
    if (!hasHeader(headers, "Content-Type")) {
      headers["Content-Type"] = "text/plain";
    }

    return body;
  }

  if (!hasHeader(headers, "Content-Type")) {
    headers["Content-Type"] = "application/json";
  }

  return JSON.stringify(body);
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return undefined;
  }

  const text = await response.text();

  if (!text) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (
    contentType.includes("application/json") ||
    contentType.includes("+json")
  ) {
    try {
      return JSON.parse(text) as unknown;
    } catch (error) {
      throw new ApiError("The API returned invalid JSON.", {
        code: "PARSE_ERROR",

        status: response.status,

        retryable: false,

        cause: error,
      });
    }
  }

  return text;
}

export const mobileFetchTransport: ApiTransport = async <T>(
  request: ApiTransportRequest,
) => {
  const controller = new AbortController();

  const externalSignal = request.signal as AbortSignal | undefined;

  let timedOut = false;

  const abortFromExternal = () => {
    controller.abort();
  };

  if (externalSignal?.aborted) {
    controller.abort();
  } else {
    externalSignal?.addEventListener("abort", abortFromExternal, {
      once: true,
    });
  }

  const timeoutHandle =
    request.timeoutMs > 0
      ? setTimeout(() => {
          timedOut = true;

          controller.abort();
        }, request.timeoutMs)
      : undefined;

  const headers: ApiHeaders = {
    ...request.headers,
  };

  try {
    const response = await fetch(request.url, {
      method: request.method,

      headers,

      body: prepareBody(request, headers),

      signal: controller.signal,
    });

    return {
      ok: response.ok,

      status: response.status,

      data: (await parseResponseBody(response)) as T,
    };
  } catch (error) {
    if (externalSignal?.aborted) {
      throw new ApiError("Request cancelled.", {
        code: "CANCELLED",

        retryable: false,

        cause: error,
      });
    }

    if (timedOut) {
      throw new ApiError(
        `API request timed out after ${request.timeoutMs} ms.`,
        {
          code: "TIMEOUT",

          retryable: true,

          cause: error,
        },
      );
    }

    throw error;
  } finally {
    if (timeoutHandle !== undefined) {
      clearTimeout(timeoutHandle);
    }

    externalSignal?.removeEventListener("abort", abortFromExternal);
  }
};
