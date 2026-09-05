function normalizePath(
  value: string | undefined,
  fallback: string,
): string {
  const resolved =
    value?.trim() ||
    fallback;

  return resolved.startsWith("/")
    ? resolved
    : `/${resolved}`;
}

export const PROFILE_CONFIG =
  Object.freeze({
    readPath:
      normalizePath(
        process.env.EXPO_PUBLIC_PROFILE_READ_PATH,
        "/auth/me",
      ),

    updatePath:
      normalizePath(
        process.env.EXPO_PUBLIC_PROFILE_UPDATE_PATH,
        "/users/me",
      ),

    preferencesPath:
      normalizePath(
        process.env.EXPO_PUBLIC_ACCOUNT_PREFERENCES_PATH,
        "/users/me/preferences",
      ),
  });