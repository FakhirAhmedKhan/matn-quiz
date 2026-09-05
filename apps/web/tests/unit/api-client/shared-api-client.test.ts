import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ApiError,
  buildApiUrl,
  createApiClient,
  isApiError,
  serializeApiQuery,
  type ApiTransport,
} from "@matn-quiz/api-client";

describe(
  "shared api-client",
  () => {
    it(
      "builds normalized API URLs",
      () => {
        expect(
          buildApiUrl(
            "https://api.example.com/",
            "/api/v1/books",
          ),
        ).toBe(
          "https://api.example.com/api/v1/books",
        );
      },
    );

    it(
      "serializes query values and arrays",
      () => {
        expect(
          serializeApiQuery({
            q:
              "arabic book",

            page:
              2,

            active:
              true,

            tag: [
              "one",
              "two",
            ],

            ignored:
              undefined,
          }),
        ).toBe(
          "q=arabic%20book&page=2&active=true&tag=one&tag=two",
        );
      },
    );

    it(
      "passes GET request through injected transport",
      async () => {
        const transport:
          ApiTransport =
          async (
            request,
          ) => {
            expect(
              request.method,
            ).toBe(
              "GET",
            );

            expect(
              request.url,
            ).toBe(
              "https://api.example.com/books?page=2",
            );

            return {
              ok:
                true,

              status:
                200,

              data: {
                id:
                  1,
              },
            };
          };

        const client =
          createApiClient({
            baseUrl:
              "https://api.example.com",

            transport,
          });

        await expect(
          client.get(
            "/books",
            {
              query: {
                page:
                  2,
              },
            },
          ),
        ).resolves.toEqual({
          id:
            1,
        });
      },
    );

    it(
      "injects bearer token through a platform hook",
      async () => {
        const transport:
          ApiTransport =
          async (
            request,
          ) => {
            expect(
              request.headers.Authorization,
            ).toBe(
              "Bearer secret-token",
            );

            return {
              ok:
                true,

              status:
                200,

              data:
                "ok",
            };
          };

        const client =
          createApiClient({
            baseUrl:
              "https://api.example.com",

            transport,

            getAccessToken:
              () =>
                "secret-token",
          });

        await expect(
          client.get(
            "/profile",
          ),
        ).resolves.toBe(
          "ok",
        );
      },
    );

    it(
      "supports explicit unauthenticated requests",
      async () => {
        const transport:
          ApiTransport =
          async (
            request,
          ) => {
            expect(
              request.headers.Authorization,
            ).toBeUndefined();

            return {
              ok:
                true,

              status:
                200,

              data:
                true,
            };
          };

        const client =
          createApiClient({
            baseUrl:
              "https://api.example.com",

            transport,

            getAccessToken:
              () =>
                "should-not-be-used",
          });

        await expect(
          client.get(
            "/health",
            {
              skipAuth:
                true,
            },
          ),
        ).resolves.toBe(
          true,
        );
      },
    );

    it(
      "normalizes non-2xx responses to ApiError",
      async () => {
        const transport:
          ApiTransport =
          async () => ({
            ok:
              false,

            status:
              404,

            data: {
              message:
                "Book not found",
            },
          });

        const client =
          createApiClient({
            baseUrl:
              "https://api.example.com",

            transport,

            defaultRetryCount:
              0,
          });

        try {
          await client.get(
            "/books/missing",
          );

          throw new Error(
            "Expected request to fail.",
          );
        }
        catch (error) {
          expect(
            isApiError(
              error,
            ),
          ).toBe(true);

          expect(
            error,
          ).toBeInstanceOf(
            ApiError,
          );

          const apiError =
            error as ApiError;

          expect(
            apiError.status,
          ).toBe(404);

          expect(
            apiError.message,
          ).toBe(
            "Book not found",
          );
        }
      },
    );

    it(
      "retries transient GET responses",
      async () => {
        let calls =
          0;

        const transport:
          ApiTransport =
          async () => {
            calls +=
              1;

            if (
              calls ===
              1
            ) {
              return {
                ok:
                  false,

                status:
                  503,

                data: {
                  message:
                    "Unavailable",
                },
              };
            }

            return {
              ok:
                true,

              status:
                200,

              data:
                "recovered",
            };
          };

        const client =
          createApiClient({
            baseUrl:
              "https://api.example.com",

            transport,

            defaultRetryCount:
              1,

            sleep:
              async () => {},
          });

        await expect(
          client.get(
            "/books",
          ),
        ).resolves.toBe(
          "recovered",
        );

        expect(
          calls,
        ).toBe(2);
      },
    );

    it(
      "does not automatically retry unsafe POST requests",
      async () => {
        let calls =
          0;

        const transport:
          ApiTransport =
          async () => {
            calls +=
              1;

            return {
              ok:
                false,

              status:
                503,

              data: {
                message:
                  "Unavailable",
              },
            };
          };

        const client =
          createApiClient({
            baseUrl:
              "https://api.example.com",

            transport,

            defaultRetryCount:
              2,

            sleep:
              async () => {},
          });

        await expect(
          client.post(
            "/books",
            {
              title:
                "Book",
            },
          ),
        ).rejects.toBeInstanceOf(
          ApiError,
        );

        expect(
          calls,
        ).toBe(1);
      },
    );

    it(
      "can retry unsafe requests when explicitly enabled",
      async () => {
        let calls =
          0;

        const transport:
          ApiTransport =
          async () => {
            calls +=
              1;

            if (
              calls ===
              1
            ) {
              return {
                ok:
                  false,

                status:
                  503,

                data:
                  "retry",
              };
            }

            return {
              ok:
                true,

              status:
                200,

              data:
                "ok",
            };
          };

        const client =
          createApiClient({
            baseUrl:
              "https://api.example.com",

            transport,

            defaultRetryCount:
              1,

            sleep:
              async () => {},
          });

        await expect(
          client.post(
            "/jobs",
            {
              value:
                1,
            },
            {
              retryUnsafeMethods:
                true,
            },
          ),
        ).resolves.toBe(
          "ok",
        );

        expect(
          calls,
        ).toBe(2);
      },
    );

    it(
      "supports one 401 refresh and retry",
      async () => {
        let token =
          "expired";

        let calls =
          0;

        const transport:
          ApiTransport =
          async (
            request,
          ) => {
            calls +=
              1;

            if (
              calls ===
              1
            ) {
              expect(
                request.headers.Authorization,
              ).toBe(
                "Bearer expired",
              );

              return {
                ok:
                  false,

                status:
                  401,

                data: {
                  message:
                    "Expired",
                },
              };
            }

            expect(
              request.headers.Authorization,
            ).toBe(
              "Bearer refreshed",
            );

            return {
              ok:
                true,

              status:
                200,

              data:
                "authenticated",
            };
          };

        const client =
          createApiClient({
            baseUrl:
              "https://api.example.com",

            transport,

            getAccessToken:
              () =>
                token,

            onUnauthorized:
              async () => {
                token =
                  "refreshed";

                return true;
              },
          });

        await expect(
          client.get(
            "/me",
          ),
        ).resolves.toBe(
          "authenticated",
        );

        expect(
          calls,
        ).toBe(2);
      },
    );

    it(
      "does not loop indefinitely on repeated 401",
      async () => {
        let calls =
          0;

        const transport:
          ApiTransport =
          async () => {
            calls +=
              1;

            return {
              ok:
                false,

              status:
                401,

              data: {
                message:
                  "Unauthorized",
              },
            };
          };

        const client =
          createApiClient({
            baseUrl:
              "https://api.example.com",

            transport,

            defaultRetryCount:
              0,

            onUnauthorized:
              async () =>
                true,
          });

        await expect(
          client.get(
            "/me",
          ),
        ).rejects.toMatchObject({
          status:
            401,
        });

        expect(
          calls,
        ).toBe(2);
      },
    );

    it(
      "enforces request timeout",
      async () => {
        const transport:
          ApiTransport =
          async () =>
            new Promise(
              () => {},
            );

        const client =
          createApiClient({
            baseUrl:
              "https://api.example.com",

            transport,

            defaultRetryCount:
              0,

            defaultTimeoutMs:
              10,
          });

        await expect(
          client.get(
            "/slow",
          ),
        ).rejects.toMatchObject({
          code:
            "TIMEOUT",

          retryable:
            true,
        });
      },
    );
  },
);
