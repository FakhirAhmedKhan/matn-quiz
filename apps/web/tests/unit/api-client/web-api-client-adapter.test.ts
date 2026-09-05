import { describe, expect, it, vi } from "vitest";

import { createWebApiClient, createWebFetchTransport } from "@/lib/api-client";

describe("Web shared API transport", () => {
  it("converts a JSON fetch response into the shared transport contract", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            ok: true,
          }),
          {
            status: 200,

            headers: {
              "content-type": "application/json",
            },
          },
        ),
    );

    const transport = createWebFetchTransport({
      fetchImpl: fetchImpl as typeof fetch,
    });

    await expect(
      transport({
        method: "GET",

        url: "https://example.test/api/books",

        headers: {
          Accept: "application/json",
        },

        timeoutMs: 5000,
      }),
    ).resolves.toMatchObject({
      ok: true,

      status: 200,

      data: {
        ok: true,
      },
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("serializes ordinary objects as JSON", async () => {
    const fetchImpl = vi.fn(async (_input, init) => {
      expect(init?.method).toBe("POST");

      const headers = init?.headers as Record<string, string>;

      expect(headers["Content-Type"]).toBe("application/json");

      expect(init?.body).toBe(
        JSON.stringify({
          title: "Book",
        }),
      );

      return new Response(
        JSON.stringify({
          id: "book-1",
        }),
        {
          status: 201,

          headers: {
            "content-type": "application/json",
          },
        },
      );
    });

    const client = createWebApiClient({
      baseUrl: "https://example.test",

      fetchImpl: fetchImpl as typeof fetch,

      defaultRetryCount: 0,
    });

    await expect(
      client.post("/api/books", {
        title: "Book",
      }),
    ).resolves.toEqual({
      id: "book-1",
    });
  });

  it("passes bearer tokens from Web hooks", async () => {
    const fetchImpl = vi.fn(async (_input, init) => {
      const headers = init?.headers as Record<string, string>;

      expect(headers.Authorization).toBe("Bearer web-token");

      return new Response(
        JSON.stringify({
          success: true,
        }),
        {
          status: 200,

          headers: {
            "content-type": "application/json",
          },
        },
      );
    });

    const client = createWebApiClient({
      baseUrl: "https://example.test",

      fetchImpl: fetchImpl as typeof fetch,

      getAccessToken: () => "web-token",
    });

    await expect(client.get("/api/profile")).resolves.toEqual({
      success: true,
    });
  });

  it("preserves HTTP failures for shared ApiError normalization", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            message: "Missing",
          }),
          {
            status: 404,

            headers: {
              "content-type": "application/json",
            },
          },
        ),
    );

    const client = createWebApiClient({
      baseUrl: "https://example.test",

      fetchImpl: fetchImpl as typeof fetch,

      defaultRetryCount: 0,
    });

    await expect(client.get("/api/missing")).rejects.toMatchObject({
      status: 404,

      message: "Missing",
    });
  });

  it("does not stringify FormData", async () => {
    const formData = new FormData();

    formData.append("title", "Book");

    const fetchImpl = vi.fn(async (_input, init) => {
      expect(init?.body).toBe(formData);

      const headers = init?.headers as Record<string, string>;

      expect(headers["Content-Type"]).toBeUndefined();

      return new Response(null, {
        status: 204,
      });
    });

    const client = createWebApiClient({
      baseUrl: "https://example.test",

      fetchImpl: fetchImpl as typeof fetch,
    });

    await expect(client.post("/api/upload", formData)).resolves.toBeUndefined();
  });
});
