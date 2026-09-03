export interface BookFeatureConfig {
  demoMode: boolean;
}

export function parseBooleanEnv(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (value === undefined || value.trim() === "") {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();

  if (
    normalized === "true" ||
    normalized === "1" ||
    normalized === "yes" ||
    normalized === "on"
  ) {
    return true;
  }

  if (
    normalized === "false" ||
    normalized === "0" ||
    normalized === "no" ||
    normalized === "off"
  ) {
    return false;
  }

  return defaultValue;
}

export function getBookFeatureConfig(
  env: NodeJS.ProcessEnv = process.env,
): BookFeatureConfig {
  return {
    demoMode: parseBooleanEnv(
      env.BOOKS_DEMO_MODE,
      true,
    ),
  };
}