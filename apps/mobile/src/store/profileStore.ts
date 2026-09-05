import {
  create,
} from "zustand";

import {
  isApiError,
} from "../api/ApiError";

import {
  applyRemoteAccountPreferences,
  getLocalAccountPreferences,
} from "../profile/accountPreferences";

import {
  profileApi,
} from "../profile/profileApi";

import type {
  AccountPreferences,
  ProfileSyncStatus,
  UpdateProfileInput,
  UserProfile,
} from "../profile/types";

import {
  useAuthStore,
} from "./authStore";

type ProfileState = {
  profile:
    UserProfile | null;

  remotePreferences:
    AccountPreferences | null;

  status:
    ProfileSyncStatus;

  error:
    string | null;

  lastSyncedAt:
    string | null;

  refreshProfile:
    () =>
      Promise<boolean>;

  updateProfile:
    (
      input: UpdateProfileInput,
    ) =>
      Promise<boolean>;

  pullPreferences:
    () =>
      Promise<boolean>;

  pushPreferences:
    () =>
      Promise<boolean>;

  syncAccount:
    () =>
      Promise<boolean>;

  reset:
    () =>
      void;

  clearError:
    () =>
      void;
};

function errorMessage(
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
      404
    ) {
      return "The account endpoint was not found.";
    }

    return (
      error.message ||
      "Account synchronization failed."
    );
  }

  if (
    error instanceof
      Error
  ) {
    return error.message;
  }

  return "Account synchronization failed.";
}

function syncAuthUser(
  profile: UserProfile,
): void {
  useAuthStore.setState({
    user:
      profile,
  });
}

export const useProfileStore =
  create<ProfileState>(
    (
      set,
      get,
    ) => ({
      profile:
        null,

      remotePreferences:
        null,

      status:
        "idle",

      error:
        null,

      lastSyncedAt:
        null,

      clearError: () => {
        set({
          error:
            null,
        });
      },

      reset: () => {
        set({
          profile:
            null,

          remotePreferences:
            null,

          status:
            "idle",

          error:
            null,

          lastSyncedAt:
            null,
        });
      },

      refreshProfile:
        async () => {
          set({
            status:
              "loading",

            error:
              null,
          });

          try {
            const profile =
              await profileApi.getProfile();

            syncAuthUser(
              profile,
            );

            set({
              profile,

              status:
                "ready",

              error:
                null,

              lastSyncedAt:
                new Date().toISOString(),
            });

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                errorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      updateProfile:
        async (
          input,
        ) => {
          set({
            status:
              "saving",

            error:
              null,
          });

          try {
            const profile =
              await profileApi.updateProfile(
                input,
              );

            syncAuthUser(
              profile,
            );

            set({
              profile,

              status:
                "ready",

              error:
                null,

              lastSyncedAt:
                new Date().toISOString(),
            });

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                errorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      pullPreferences:
        async () => {
          set({
            status:
              "syncing",

            error:
              null,
          });

          try {
            const preferences =
              await profileApi.getPreferences();

            applyRemoteAccountPreferences(
              preferences,
            );

            set({
              remotePreferences:
                preferences,

              status:
                "ready",

              error:
                null,

              lastSyncedAt:
                new Date().toISOString(),
            });

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                errorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      pushPreferences:
        async () => {
          set({
            status:
              "syncing",

            error:
              null,
          });

          try {
            const local =
              getLocalAccountPreferences();

            const remote =
              await profileApi.updatePreferences(
                local,
              );

            set({
              remotePreferences:
                remote,

              status:
                "ready",

              error:
                null,

              lastSyncedAt:
                new Date().toISOString(),
            });

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                errorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      syncAccount:
        async () => {
          const profileOk =
            await get().refreshProfile();

          if (!profileOk) {
            return false;
          }

          return get().pullPreferences();
        },
    }),
  );