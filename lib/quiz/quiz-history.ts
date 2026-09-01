import type { GeneratedQuiz } from "@/types/quiz";

export const QUIZ_HISTORY_VERSION = 1;

export const QUIZ_HISTORY_STORAGE_KEY = "matn-quiz:history:v1";

export const MAX_SAVED_QUIZ_HISTORY = 20;

export interface SavedQuizRecord {
  id: string;
  version: typeof QUIZ_HISTORY_VERSION;
  title: string;
  quiz: GeneratedQuiz;
  createdAt: string;
  updatedAt: string;
}

export interface QuizHistoryDocument {
  version: typeof QUIZ_HISTORY_VERSION;
  savedAt: string;
  items: SavedQuizRecord[];
}

export interface CreateSavedQuizRecordOptions {
  id?: string;
  now?: Date;
  random?: () => number;
  title?: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createSavedQuizId(
  now = new Date(),
  random: () => number = Math.random,
): string {
  const timestamp = now
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);

  const suffix = Math.floor(random() * 1_000_000)
    .toString(36)
    .padStart(4, "0");

  return `quiz_${timestamp}_${suffix}`;
}

export function createSavedQuizTitle(quiz: GeneratedQuiz): string {
  const methodLabel = quiz.method === "HIDE_WORD" ? "Hide Words" : "Hide Lines";
  const textPreview = quiz.originalText.replace(/\s+/g, " ").trim();
  const safePreview = textPreview.length > 0 ? textPreview : "Untitled Quiz";
  const preview =
    safePreview.length > 40 ? `${safePreview.slice(0, 40)}...` : safePreview;

  return `${methodLabel} · ${quiz.hiddenCount} hidden · ${preview}`;
}

export function createSavedQuizRecord(
  quiz: GeneratedQuiz,
  options: CreateSavedQuizRecordOptions = {},
): SavedQuizRecord {
  const now = options.now ?? new Date();
  const timestamp = now.toISOString();

  return {
    id: options.id ?? createSavedQuizId(now, options.random),
    version: QUIZ_HISTORY_VERSION,
    title: options.title ?? createSavedQuizTitle(quiz),
    quiz,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createEmptyQuizHistoryDocument(
  now = new Date(),
): QuizHistoryDocument {
  return {
    version: QUIZ_HISTORY_VERSION,
    savedAt: now.toISOString(),
    items: [],
  };
}

export function isGeneratedQuiz(value: unknown): value is GeneratedQuiz {
  if (!isObject(value)) {
    return false;
  }

  const method = value.method;

  return (
    (method === "HIDE_WORD" || method === "HIDE_LINE") &&
    typeof value.originalText === "string" &&
    typeof value.quizText === "string" &&
    typeof value.requestedCount === "number" &&
    typeof value.hiddenCount === "number" &&
    Array.isArray(value.answers) &&
    Array.isArray(value.selectedTokenIndexes)
  );
}

export function isSavedQuizRecord(value: unknown): value is SavedQuizRecord {
  if (!isObject(value)) {
    return false;
  }

  return (
    value.version === QUIZ_HISTORY_VERSION &&
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    isGeneratedQuiz(value.quiz)
  );
}

export function isQuizHistoryDocument(
  value: unknown,
): value is QuizHistoryDocument {
  if (!isObject(value)) {
    return false;
  }

  return (
    value.version === QUIZ_HISTORY_VERSION &&
    typeof value.savedAt === "string" &&
    Array.isArray(value.items) &&
    value.items.every(isSavedQuizRecord)
  );
}

export function serializeQuizHistoryDocument(
  document: QuizHistoryDocument,
): string {
  return JSON.stringify(document);
}

export function parseQuizHistoryDocument(
  value: string | null | undefined,
): QuizHistoryDocument | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    return isQuizHistoryDocument(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function normalizeQuizHistoryItems(
  items: SavedQuizRecord[],
  maxItems = MAX_SAVED_QUIZ_HISTORY,
): SavedQuizRecord[] {
  const seenIds = new Set<string>();
  const normalized: SavedQuizRecord[] = [];

  for (const item of items) {
    if (seenIds.has(item.id)) {
      continue;
    }

    seenIds.add(item.id);
    normalized.push(item);

    if (normalized.length >= maxItems) {
      break;
    }
  }

  return normalized;
}

export function upsertSavedQuizRecord(
  items: SavedQuizRecord[],
  record: SavedQuizRecord,
  maxItems = MAX_SAVED_QUIZ_HISTORY,
): SavedQuizRecord[] {
  const withoutDuplicate = items.filter((item) => item.id !== record.id);

  return normalizeQuizHistoryItems([record, ...withoutDuplicate], maxItems);
}

export function removeSavedQuizRecord(
  items: SavedQuizRecord[],
  id: string,
): SavedQuizRecord[] {
  return items.filter((item) => item.id !== id);
}

export function clearSavedQuizHistory(): SavedQuizRecord[] {
  return [];
}

export function createQuizHistoryDocument(
  items: SavedQuizRecord[],
  now = new Date(),
): QuizHistoryDocument {
  return {
    version: QUIZ_HISTORY_VERSION,
    savedAt: now.toISOString(),
    items: normalizeQuizHistoryItems(items),
  };
}
