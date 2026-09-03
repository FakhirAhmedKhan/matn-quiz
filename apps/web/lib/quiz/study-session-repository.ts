import {
  createPersistedStudySessionDocument,
  parsePersistedStudySessionDocument,
  PERSISTED_STUDY_SESSION_STORAGE_KEY,
  serializePersistedStudySessionDocument,
  type CreatePersistedStudySessionDocumentOptions,
  type PersistedStudySessionDocument,
  type PersistedStudySessionPayload,
} from "@/lib/quiz/study-session-persistence";

export interface PersistedStudySessionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface PersistedStudySessionRepositoryOptions {
  storage?: PersistedStudySessionStorage | null;
}

export interface SavePersistedStudySessionOptions
  extends PersistedStudySessionRepositoryOptions,
    CreatePersistedStudySessionDocumentOptions {}

export function getBrowserPersistedStudySessionStorage():
  | PersistedStudySessionStorage
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function resolvePersistedStudySessionStorage(
  options: PersistedStudySessionRepositoryOptions = {},
): PersistedStudySessionStorage | null {
  if ("storage" in options) {
    return options.storage ?? null;
  }

  return getBrowserPersistedStudySessionStorage();
}

export function isPersistedStudySessionStorageAvailable(
  storage: PersistedStudySessionStorage | null =
    getBrowserPersistedStudySessionStorage(),
): boolean {
  if (!storage) {
    return false;
  }

  const testKey = "matn-quiz:study-session-storage-test";

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);

    return true;
  } catch {
    return false;
  }
}

export function readPersistedStudySessionDocument(
  options: PersistedStudySessionRepositoryOptions = {},
): PersistedStudySessionDocument | null {
  const storage = resolvePersistedStudySessionStorage(options);

  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(PERSISTED_STUDY_SESSION_STORAGE_KEY);

    return parsePersistedStudySessionDocument(raw);
  } catch {
    return null;
  }
}

export function writePersistedStudySessionDocument(
  document: PersistedStudySessionDocument,
  options: PersistedStudySessionRepositoryOptions = {},
): boolean {
  const storage = resolvePersistedStudySessionStorage(options);

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(
      PERSISTED_STUDY_SESSION_STORAGE_KEY,
      serializePersistedStudySessionDocument(document),
    );

    return true;
  } catch {
    return false;
  }
}

export function savePersistedStudySession(
  payload: PersistedStudySessionPayload,
  options: SavePersistedStudySessionOptions = {},
): PersistedStudySessionDocument | null {
  const storage = resolvePersistedStudySessionStorage(options);

  if (!storage) {
    return null;
  }

  const document = createPersistedStudySessionDocument(payload, {
    sessionId: options.sessionId,
    now: options.now,
    random: options.random,
  });

  const saved = writePersistedStudySessionDocument(document, {
    storage,
  });

  return saved ? document : null;
}

export function loadPersistedStudySession(
  options: PersistedStudySessionRepositoryOptions = {},
): PersistedStudySessionDocument | null {
  return readPersistedStudySessionDocument(options);
}

export function hasPersistedStudySession(
  options: PersistedStudySessionRepositoryOptions = {},
): boolean {
  return readPersistedStudySessionDocument(options) !== null;
}

export function clearPersistedStudySession(
  options: PersistedStudySessionRepositoryOptions = {},
): boolean {
  const storage = resolvePersistedStudySessionStorage(options);

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(PERSISTED_STUDY_SESSION_STORAGE_KEY);

    return true;
  } catch {
    return false;
  }
}
