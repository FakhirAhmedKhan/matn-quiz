import {
  apiClient,
} from "../api/apiClient";

import {
  apiEndpoints,
} from "../api/endpoints";

import {
  normalizeAuthSessionResponse,
  normalizeAuthUserResponse,
} from "./authResponse";

import type {
  AuthSessionPayload,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "./types";

export const authApi = {
  async login(
    input: LoginInput,
  ): Promise<AuthSessionPayload> {
    const response =
      await apiClient.post<
        unknown,
        LoginInput
      >(
        apiEndpoints.auth.login,
        input,
        {
          auth:
            false,

          retries:
            0,
        },
      );

    return normalizeAuthSessionResponse(
      response,
    );
  },

  async register(
    input: RegisterInput,
  ): Promise<AuthSessionPayload> {
    const response =
      await apiClient.post<
        unknown,
        RegisterInput
      >(
        apiEndpoints.auth.register,
        input,
        {
          auth:
            false,

          retries:
            0,
        },
      );

    return normalizeAuthSessionResponse(
      response,
    );
  },

  async refresh(
    refreshToken: string,
  ): Promise<AuthSessionPayload> {
    const response =
      await apiClient.post<
        unknown,
        {
          refreshToken:
            string;
        }
      >(
        apiEndpoints.auth.refresh,
        {
          refreshToken,
        },
        {
          auth:
            false,

          retries:
            0,
        },
      );

    return normalizeAuthSessionResponse(
      response,
      refreshToken,
    );
  },

  async me(): Promise<AuthUser> {
    const response =
      await apiClient.get<unknown>(
        apiEndpoints.auth.me,
        {
          retries:
            0,
        },
      );

    return normalizeAuthUserResponse(
      response,
    );
  },

  async logout(
    refreshToken:
      string | null,
  ): Promise<void> {
    await apiClient.post<
      unknown,
      {
        refreshToken?:
          string;
      }
    >(
      apiEndpoints.auth.logout,
      refreshToken
        ? {
            refreshToken,
          }
        : {},
      {
        retries:
          0,
      },
    );
  },
};