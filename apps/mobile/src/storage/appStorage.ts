import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createJSONStorage,
} from "zustand/middleware";

export const STORAGE_VERSION = 1;

export const STORAGE_KEYS = {
  settings:
    "matn-quiz:settings:v1",

  quiz:
    "matn-quiz:quiz:v1",

  poem:
    "matn-quiz:poem:v1",

  books:
    "matn-quiz:books:v1",

  audio:
    "matn-quiz:audio:v1",
} as const;

export const zustandAsyncStorage =
  createJSONStorage(
    () => AsyncStorage,
  );

export async function clearMatnQuizStorage(): Promise<void> {
  await AsyncStorage.multiRemove(
    Object.values(
      STORAGE_KEYS,
    ),
  );
}

export async function getMatnQuizStorageKeys(): Promise<string[]> {
  const allKeys =
    await AsyncStorage.getAllKeys();

  const appKeys =
    new Set<string>(
      Object.values(
        STORAGE_KEYS,
      ),
    );

  return allKeys.filter(
    (key) =>
      appKeys.has(key),
  );
}