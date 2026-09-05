import {
  ApiError,
} from "../api/ApiError";

import type {
  AuthSessionPayload,
  AuthUser,
} from "./types";

type UnknownRecord =
  Record<
    string,
    unknown
  >;

function asRecord(
  value: unknown,
): UnknownRecord | null {
  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(value)
  ) {
    return null;
  }

  return value as UnknownRecord;
}

function firstString(
  record: UnknownRecord | null,
  keys: readonly string[],
): string | null {
  if (!record) {
    return null;
  }

  for (
    const key of keys
  ) {
    const value =
      record[key];

    if (
      typeof value ===
        "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return null;
}

function extractUser(
  root: UnknownRecord,
  data: UnknownRecord | null,
): AuthUser | null {
  const directUser =
    asRecord(
      root.user,
    );

  if (directUser) {
    return directUser as AuthUser;
  }

  const dataUser =
    asRecord(
      data?.user,
    );

  if (dataUser) {
    return dataUser as AuthUser;
  }

  const account =
    asRecord(
      root.account ??
        data?.account,
    );

  if (account) {
    return account as AuthUser;
  }

  return null;
}

export function normalizeAuthSessionResponse(
  raw: unknown,
  fallbackRefreshToken:
    string | null = null,
): AuthSessionPayload {
  const root =
    asRecord(
      raw,
    );

  if (!root) {
    throw new ApiError(
      "Authentication response has an invalid format.",
      {
        code:
          "PARSE_ERROR",
      },
    );
  }

  const data =
    asRecord(
      root.data,
    );

  const tokenContainer =
    asRecord(
      root.tokens,
    ) ??
    asRecord(
      data?.tokens,
    );

  const accessToken =
    firstString(
      root,
      [
        "accessToken",
        "access_token",
        "token",
      ],
    ) ??
    firstString(
      data,
      [
        "accessToken",
        "access_token",
        "token",
      ],
    ) ??
    firstString(
      tokenContainer,
      [
        "accessToken",
        "access_token",
        "access",
      ],
    );

  const refreshToken =
    firstString(
      root,
      [
        "refreshToken",
        "refresh_token",
      ],
    ) ??
    firstString(
      data,
      [
        "refreshToken",
        "refresh_token",
      ],
    ) ??
    firstString(
      tokenContainer,
      [
        "refreshToken",
        "refresh_token",
        "refresh",
      ],
    ) ??
    fallbackRefreshToken;

  if (!accessToken) {
    throw new ApiError(
      "The authentication API did not return an access token.",
      {
        code:
          "PARSE_ERROR",
      },
    );
  }

  return {
    accessToken,

    refreshToken,

    user:
      extractUser(
        root,
        data,
      ),
  };
}

export function normalizeAuthUserResponse(
  raw: unknown,
): AuthUser {
  const root =
    asRecord(
      raw,
    );

  if (!root) {
    throw new ApiError(
      "User response has an invalid format.",
      {
        code:
          "PARSE_ERROR",
      },
    );
  }

  const data =
    asRecord(
      root.data,
    );

  const user =
    asRecord(
      root.user,
    ) ??
    asRecord(
      data?.user,
    ) ??
    data ??
    root;

  return user as AuthUser;
}