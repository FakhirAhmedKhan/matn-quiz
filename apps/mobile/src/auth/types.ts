export type AuthStatus =
  | "idle"
  | "bootstrapping"
  | "anonymous"
  | "authenticated";

export type AuthUser = {
  id?: string | number;

  email?: string;

  name?: string;

  username?: string;

  [key: string]:
    unknown;
};

export type LoginInput = {
  email:
    string;

  password:
    string;
};

export type RegisterInput = {
  name?:
    string;

  email:
    string;

  password:
    string;
};

export type AuthTokens = {
  accessToken:
    string;

  refreshToken:
    string | null;
};

export type AuthSessionPayload = {
  accessToken:
    string;

  refreshToken:
    string | null;

  user:
    AuthUser | null;
};