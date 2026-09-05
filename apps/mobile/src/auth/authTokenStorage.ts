import {
  Platform,
} from "react-native";

import * as SecureStore
  from "expo-secure-store";

import type {
  AuthTokens,
} from "./types";

const ACCESS_TOKEN_KEY =
  "matn-quiz.auth.access-token.v1";

const REFRESH_TOKEN_KEY =
  "matn-quiz.auth.refresh-token.v1";

/**
 * Web is intentionally memory-only.
 *
 * We do not persist bearer/refresh tokens
 * to localStorage or AsyncStorage.
 */
const webMemory = {
  accessToken:
    null as string | null,

  refreshToken:
    null as string | null,
};

async function getSecureValue(
  key: string,
): Promise<string | null> {
  if (
    Platform.OS ===
    "web"
  ) {
    if (
      key ===
      ACCESS_TOKEN_KEY
    ) {
      return webMemory.accessToken;
    }

    return webMemory.refreshToken;
  }

  return SecureStore.getItemAsync(
    key,
  );
}

async function setSecureValue(
  key: string,
  value: string | null,
): Promise<void> {
  if (
    Platform.OS ===
    "web"
  ) {
    if (
      key ===
      ACCESS_TOKEN_KEY
    ) {
      webMemory.accessToken =
        value;
    } else {
      webMemory.refreshToken =
        value;
    }

    return;
  }

  if (
    value === null
  ) {
    await SecureStore.deleteItemAsync(
      key,
    );

    return;
  }

  await SecureStore.setItemAsync(
    key,
    value,
  );
}

export const authTokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return getSecureValue(
      ACCESS_TOKEN_KEY,
    );
  },

  async getRefreshToken(): Promise<string | null> {
    return getSecureValue(
      REFRESH_TOKEN_KEY,
    );
  },

  async getTokens(): Promise<{
    accessToken:
      string | null;

    refreshToken:
      string | null;
  }> {
    const [
      accessToken,
      refreshToken,
    ] =
      await Promise.all([
        getSecureValue(
          ACCESS_TOKEN_KEY,
        ),

        getSecureValue(
          REFRESH_TOKEN_KEY,
        ),
      ]);

    return {
      accessToken,
      refreshToken,
    };
  },

  async setTokens(
    tokens: AuthTokens,
  ): Promise<void> {
    await Promise.all([
      setSecureValue(
        ACCESS_TOKEN_KEY,
        tokens.accessToken,
      ),

      setSecureValue(
        REFRESH_TOKEN_KEY,
        tokens.refreshToken,
      ),
    ]);
  },

  async clear(): Promise<void> {
    await Promise.all([
      setSecureValue(
        ACCESS_TOKEN_KEY,
        null,
      ),

      setSecureValue(
        REFRESH_TOKEN_KEY,
        null,
      ),
    ]);
  },
};