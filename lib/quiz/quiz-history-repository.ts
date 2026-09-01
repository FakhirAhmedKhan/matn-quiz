import type { GeneratedQuiz } from "@/types/quiz";
import {
  createEmptyQuizHistoryDocument,
  createQuizHistoryDocument,
  createSavedQuizRecord,
  parseQuizHistoryDocument,
  QUIZ_HISTORY_STORAGE_KEY,
  removeSavedQuizRecord,
  serializeQuizHistoryDocument,
  upsertSavedQuizRecord,
  type CreateSavedQuizRecordOptions,
  type QuizHistoryDocument,
  type SavedQuizRecord,
} from "@/lib/quiz/quiz-history";

export interface QuizHistoryStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface QuizHistoryRepositoryOptions {
  storage?: QuizHistoryStorage | null;
  now?: Date;
}

export interface SaveQuizToHistoryOptions extends CreateSavedQuizRecordOptions {
  storage?: QuizHistoryStorage | null;
}

export function getBrowserQuizHistoryStorage(): QuizHistoryStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function resolveQuizHistoryStorage(
  options: QuizHistoryRepositoryOptions | SaveQuizToHistoryOptions = {},
): QuizHistoryStorage | null {
  if ("storage" in options) {
    return options.storage ?? null;
  }

  return getBrowserQuizHistoryStorage();
}

export function isQuizHistoryStorageAvailable(
  storage: QuizHistoryStorage | null = getBrowserQuizHistoryStorage(),
): boolean {
  if (!storage) {
    return false;
  }

  const testKey = "matn-quiz:storage-test";

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);

    return true;
  } catch {
    return false;
  }
}

export function readQuizHistoryDocument(
  options: QuizHistoryRepositoryOptions = {},
): QuizHistoryDocument {
  const storage = resolveQuizHistoryStorage(options);
  const now = options.now ?? new Date();

  if (!storage) {
    return createEmptyQuizHistoryDocument(now);
  }

  try {
    const raw = storage.getItem(QUIZ_HISTORY_STORAGE_KEY);
    const parsed = parseQuizHistoryDocument(raw);

    return parsed ?? createEmptyQuizHistoryDocument(now);
  } catch {
    return createEmptyQuizHistoryDocument(now);
  }
}

export function writeQuizHistoryDocument(
  document: QuizHistoryDocument,
  options: QuizHistoryRepositoryOptions = {},
): boolean {
  const storage = resolveQuizHistoryStorage(options);

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(
      QUIZ_HISTORY_STORAGE_KEY,
      serializeQuizHistoryDocument(document),
    );

    return true;
  } catch {
    return false;
  }
}

export function loadSavedQuizHistory(
  options: QuizHistoryRepositoryOptions = {},
): SavedQuizRecord[] {
  return readQuizHistoryDocument(options).items;
}

export function findSavedQuizRecord(
  id: string,
  options: QuizHistoryRepositoryOptions = {},
): SavedQuizRecord | undefined {
  return loadSavedQuizHistory(options).find((item) => item.id === id);
}

export function saveQuizToHistory(
  quiz: GeneratedQuiz,
  options: SaveQuizToHistoryOptions = {},
): SavedQuizRecord | null {
  const storage = resolveQuizHistoryStorage(options);

  if (!storage) {
    return null;
  }

  const now = options.now ?? new Date();
  const currentDocument = readQuizHistoryDocument({
    storage,
    now,
  });

  const record = createSavedQuizRecord(quiz, {
    id: options.id,
    now,
    random: options.random,
    title: options.title,
  });

  const nextItems = upsertSavedQuizRecord(currentDocument.items, record);
  const nextDocument = createQuizHistoryDocument(nextItems, now);

  const saved = writeQuizHistoryDocument(nextDocument, {
    storage,
    now,
  });

  return saved ? record : null;
}

export function deleteSavedQuizFromHistory(
  id: string,
  options: QuizHistoryRepositoryOptions = {},
): boolean {
  const storage = resolveQuizHistoryStorage(options);

  if (!storage) {
    return false;
  }

  const now = options.now ?? new Date();
  const currentDocument = readQuizHistoryDocument({
    storage,
    now,
  });

  const nextItems = removeSavedQuizRecord(currentDocument.items, id);
  const nextDocument = createQuizHistoryDocument(nextItems, now);

  return writeQuizHistoryDocument(nextDocument, {
    storage,
    now,
  });
}

export function clearQuizHistoryStorage(
  options: QuizHistoryRepositoryOptions = {},
): boolean {
  const storage = resolveQuizHistoryStorage(options);

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(QUIZ_HISTORY_STORAGE_KEY);

    return true;
  } catch {
    return false;
  }
}
