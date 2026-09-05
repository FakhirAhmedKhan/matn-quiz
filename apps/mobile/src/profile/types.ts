import type {
  AuthUser,
} from "../auth/types";

import type {
  AppSettings,
} from "../types/settings";

export type UserProfile =
  AuthUser & {
    id?:
      string | number;

    name?:
      string;

    email?:
      string;

    username?:
      string;

    avatarUrl?:
      string | null;

    createdAt?:
      string;

    updatedAt?:
      string;
  };

export type UpdateProfileInput = {
  name?:
    string;

  email?:
    string;
};

export type AccountPreferences =
  Partial<AppSettings>;

export type ProfileSyncStatus =
  | "idle"
  | "loading"
  | "ready"
  | "saving"
  | "syncing"
  | "error";