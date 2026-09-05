import {
  apiClient,
} from "../api/apiClient";

import {
  PROFILE_CONFIG,
} from "./profileConfig";

import {
  normalizePreferencesResponse,
  normalizeProfileResponse,
} from "./profileResponse";

import type {
  AccountPreferences,
  UpdateProfileInput,
  UserProfile,
} from "./types";

export const profileApi = {
  async getProfile(): Promise<UserProfile> {
    const response =
      await apiClient.get<unknown>(
        PROFILE_CONFIG.readPath,
        {
          retries:
            0,
        },
      );

    return normalizeProfileResponse(
      response,
    );
  },

  async updateProfile(
    input: UpdateProfileInput,
  ): Promise<UserProfile> {
    const response =
      await apiClient.patch<
        unknown,
        UpdateProfileInput
      >(
        PROFILE_CONFIG.updatePath,
        input,
        {
          retries:
            0,
        },
      );

    return normalizeProfileResponse(
      response,
    );
  },

  async getPreferences(): Promise<AccountPreferences> {
    const response =
      await apiClient.get<unknown>(
        PROFILE_CONFIG.preferencesPath,
        {
          retries:
            0,
        },
      );

    return normalizePreferencesResponse(
      response,
    );
  },

  async updatePreferences(
    preferences: AccountPreferences,
  ): Promise<AccountPreferences> {
    const response =
      await apiClient.patch<
        unknown,
        AccountPreferences
      >(
        PROFILE_CONFIG.preferencesPath,
        preferences,
        {
          retries:
            0,
        },
      );

    return normalizePreferencesResponse(
      response,
    );
  },
};