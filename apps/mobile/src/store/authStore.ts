import {
  create,
} from "zustand";

import {
  ApiError,
  isApiError,
} from "../api/ApiError";

import {
  authApi,
} from "../auth/authApi";

import {
  authTokenStorage,
} from "../auth/authTokenStorage";

import type {
  AuthStatus,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "../auth/types";

type AuthState = {
  status:
    AuthStatus;

  user:
    AuthUser | null;

  isSubmitting:
    boolean;

  error:
    string | null;

  bootstrap:
    () =>
      Promise<void>;

  login:
    (
      input: LoginInput,
    ) =>
      Promise<boolean>;

  register:
    (
      input: RegisterInput,
    ) =>
      Promise<boolean>;

  logout:
    () =>
      Promise<void>;

  refreshSession:
    () =>
      Promise<boolean>;

  handleUnauthorized:
    () =>
      Promise<void>;

  clearError:
    () =>
      void;
};

let refreshPromise:
  Promise<boolean> | null =
    null;

function authErrorMessage(
  error: unknown,
): string {
  if (
    isApiError(
      error,
    )
  ) {
    if (
      error.code ===
      "NETWORK_ERROR"
    ) {
      return "Unable to connect to the server.";
    }

    if (
      error.code ===
      "TIMEOUT"
    ) {
      return "The server took too long to respond.";
    }

    if (
      error.status ===
      401
    ) {
      return "Email or password is incorrect.";
    }

    if (
      error.status ===
      409
    ) {
      return "An account with these details already exists.";
    }

    return (
      error.message ||
      "Authentication failed."
    );
  }

  if (
    error instanceof
    Error
  ) {
    return error.message;
  }

  return "Authentication failed.";
}

export const useAuthStore =
  create<AuthState>(
    (
      set,
      get,
    ) => ({
      status:
        "idle",

      user:
        null,

      isSubmitting:
        false,

      error:
        null,

      clearError: () => {
        set({
          error:
            null,
        });
      },

      bootstrap: async () => {
        const currentStatus =
          get().status;

        if (
          currentStatus ===
            "bootstrapping" ||
          currentStatus ===
            "authenticated"
        ) {
          return;
        }

        set({
          status:
            "bootstrapping",

          error:
            null,
        });

        try {
          const tokens =
            await authTokenStorage.getTokens();

          if (
            !tokens.accessToken &&
            !tokens.refreshToken
          ) {
            set({
              status:
                "anonymous",

              user:
                null,
            });

            return;
          }

          if (
            !tokens.accessToken &&
            tokens.refreshToken
          ) {
            const refreshed =
              await get().refreshSession();

            if (!refreshed) {
              set({
                status:
                  "anonymous",

                user:
                  null,
              });

              return;
            }
          }

          const user =
            await authApi.me();

          set({
            status:
              "authenticated",

            user,

            error:
              null,
          });
        } catch {
          await authTokenStorage.clear();

          set({
            status:
              "anonymous",

            user:
              null,
          });
        }
      },

      login: async (
        input,
      ) => {
        set({
          isSubmitting:
            true,

          error:
            null,
        });

        try {
          const session =
            await authApi.login(
              input,
            );

          await authTokenStorage.setTokens(
            {
              accessToken:
                session.accessToken,

              refreshToken:
                session.refreshToken,
            },
          );

          let user =
            session.user;

          if (!user) {
            user =
              await authApi.me();
          }

          set({
            status:
              "authenticated",

            user,

            isSubmitting:
              false,

            error:
              null,
          });

          return true;
        } catch (error) {
          await authTokenStorage.clear();

          set({
            status:
              "anonymous",

            user:
              null,

            isSubmitting:
              false,

            error:
              authErrorMessage(
                error,
              ),
          });

          return false;
        }
      },

      register: async (
        input,
      ) => {
        set({
          isSubmitting:
            true,

          error:
            null,
        });

        try {
          const session =
            await authApi.register(
              input,
            );

          await authTokenStorage.setTokens(
            {
              accessToken:
                session.accessToken,

              refreshToken:
                session.refreshToken,
            },
          );

          let user =
            session.user;

          if (!user) {
            user =
              await authApi.me();
          }

          set({
            status:
              "authenticated",

            user,

            isSubmitting:
              false,

            error:
              null,
          });

          return true;
        } catch (error) {
          await authTokenStorage.clear();

          set({
            status:
              "anonymous",

            user:
              null,

            isSubmitting:
              false,

            error:
              authErrorMessage(
                error,
              ),
          });

          return false;
        }
      },

      refreshSession:
        async () => {
          if (
            refreshPromise
          ) {
            return refreshPromise;
          }

          refreshPromise =
            (async () => {
              try {
                const refreshToken =
                  await authTokenStorage.getRefreshToken();

                if (
                  !refreshToken
                ) {
                  return false;
                }

                const session =
                  await authApi.refresh(
                    refreshToken,
                  );

                await authTokenStorage.setTokens(
                  {
                    accessToken:
                      session.accessToken,

                    refreshToken:
                      session.refreshToken ??
                      refreshToken,
                  },
                );

                if (
                  session.user
                ) {
                  set({
                    user:
                      session.user,
                  });
                }

                return true;
              } catch {
                await authTokenStorage.clear();

                set({
                  status:
                    "anonymous",

                  user:
                    null,
                });

                return false;
              } finally {
                refreshPromise =
                  null;
              }
            })();

          return refreshPromise;
        },

      handleUnauthorized:
        async () => {
          await authTokenStorage.clear();

          set({
            status:
              "anonymous",

            user:
              null,

            isSubmitting:
              false,
          });
        },

      logout: async () => {
        set({
          isSubmitting:
            true,

          error:
            null,
        });

        const refreshToken =
          await authTokenStorage.getRefreshToken();

        try {
          await authApi.logout(
            refreshToken,
          );
        } catch {
          // Local logout must still succeed even if
          // the backend is offline or the session expired.
        } finally {
          await authTokenStorage.clear();

          set({
            status:
              "anonymous",

            user:
              null,

            isSubmitting:
              false,

            error:
              null,
          });
        }
      },
    }),
  );