import { describe, expect, it, vi } from "vitest";

import { createApiClient, type ApiTransport } from "@matn-quiz/api-client";

describe("shared api-client cancellation", () => {
  it("forwards caller signal to transport", async () => {
    const controller = new AbortController();

    const transport: ApiTransport = async (request) => {
      expect(request.signal).toBe(controller.signal);

      return {
        ok: true,

        status: 200,

        data: "ok",
      };
    };

    const client = createApiClient({
      baseUrl: "https://example.test",

      transport,

      defaultRetryCount: 0,
    });

    await expect(
      client.get("/health", {
        signal: controller.signal,
      }),
    ).resolves.toBe("ok");
  });

  it("does not start an already cancelled request", async () => {
    const controller = new AbortController();

    controller.abort();

    const transport = vi.fn(async () => ({
      ok: true,

      status: 200,

      data: "unexpected",
    }));

    const client = createApiClient({
      baseUrl: "https://example.test",

      transport: transport as ApiTransport,
    });

    await expect(
      client.get("/health", {
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({
      code: "CANCELLED",

      retryable: false,
    });

    expect(transport).not.toHaveBeenCalled();
  });
});
