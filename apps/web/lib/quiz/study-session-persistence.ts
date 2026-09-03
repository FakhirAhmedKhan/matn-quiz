import { isGeneratedQuiz } from "@/lib/quiz/quiz-history";
import {
  getQuizReviewProgress,
  type QuizReviewState,
  type ReviewAnswerState,
  type ReviewAnswerStatus,
} from "@/lib/quiz/review-session";
import {
  getStudyProgress,
  type AnswerRevealMode,
  type QuizStudyState,
  type StudyAnswerState,
} from "@/lib/quiz/study-session";

export const PERSISTED_STUDY_SESSION_APP_ID = "matn-quiz";

export const PERSISTED_STUDY_SESSION_VERSION = 1;

export const PERSISTED_STUDY_SESSION_STORAGE_KEY =
  "matn-quiz:study-session:v1";

export interface PersistedStudySessionDocument {
  appId: typeof PERSISTED_STUDY_SESSION_APP_ID;
  version: typeof PERSISTED_STUDY_SESSION_VERSION;
  sessionId: string;
  savedAt: string;
  studyState: QuizStudyState;
  reviewState: QuizReviewState;
}

export interface PersistedStudySessionPayload {
  studyState: QuizStudyState;
  reviewState: QuizReviewState;
}

export interface CreatePersistedStudySessionDocumentOptions {
  sessionId?: string;
  now?: Date;
  random?: () => number;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isAnswerRevealMode(value: unknown): value is AnswerRevealMode {
  return value === "hidden" || value === "revealed";
}

function isReviewAnswerStatus(value: unknown): value is ReviewAnswerStatus {
  return (
    value === "unanswered" || value === "correct" || value === "incorrect"
  );
}

export function createPersistedStudySessionId(
  now = new Date(),
  random: () => number = Math.random,
): string {
  const timestamp = now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const suffix = Math.floor(random() * 1_000_000)
    .toString(36)
    .padStart(4, "0");

  return `study_${timestamp}_${suffix}`;
}

export function isStudyAnswerState(value: unknown): value is StudyAnswerState {
  if (!isObject(value)) {
    return false;
  }

  return (
    isFiniteNumber(value.answerIndex) &&
    value.answerIndex >= 1 &&
    isFiniteNumber(value.tokenIndex) &&
    value.tokenIndex >= 0 &&
    (value.kind === "word" || value.kind === "line") &&
    isAnswerRevealMode(value.mode)
  );
}

export function isQuizStudyState(value: unknown): value is QuizStudyState {
  if (!isObject(value)) {
    return false;
  }

  return (
    isGeneratedQuiz(value.quiz) &&
    Array.isArray(value.answers) &&
    value.answers.every(isStudyAnswerState)
  );
}

export function isReviewAnswerState(
  value: unknown,
): value is ReviewAnswerState {
  if (!isObject(value)) {
    return false;
  }

  return (
    isFiniteNumber(value.answerIndex) &&
    value.answerIndex >= 1 &&
    isFiniteNumber(value.tokenIndex) &&
    value.tokenIndex >= 0 &&
    (value.kind === "word" || value.kind === "line") &&
    typeof value.answer === "string" &&
    value.answer.trim().length > 0 &&
    isReviewAnswerStatus(value.status) &&
    (value.reviewedAt === undefined || typeof value.reviewedAt === "string")
  );
}

export function isQuizReviewState(value: unknown): value is QuizReviewState {
  if (!isObject(value)) {
    return false;
  }

  return (
    isGeneratedQuiz(value.quiz) &&
    Array.isArray(value.answers) &&
    value.answers.every(isReviewAnswerState) &&
    typeof value.startedAt === "string" &&
    value.startedAt.trim().length > 0 &&
    typeof value.updatedAt === "string" &&
    value.updatedAt.trim().length > 0
  );
}

export function createPersistedStudySessionDocument(
  payload: PersistedStudySessionPayload,
  options: CreatePersistedStudySessionDocumentOptions = {},
): PersistedStudySessionDocument {
  const now = options.now ?? new Date();

  return {
    appId: PERSISTED_STUDY_SESSION_APP_ID,
    version: PERSISTED_STUDY_SESSION_VERSION,
    sessionId:
      options.sessionId ??
      createPersistedStudySessionId(now, options.random),
    savedAt: now.toISOString(),
    studyState: payload.studyState,
    reviewState: payload.reviewState,
  };
}

export function serializePersistedStudySessionDocument(
  document: PersistedStudySessionDocument,
): string {
  return JSON.stringify(document, null, 2);
}

export function isPersistedStudySessionDocument(
  value: unknown,
): value is PersistedStudySessionDocument {
  if (!isObject(value)) {
    return false;
  }

  return (
    value.appId === PERSISTED_STUDY_SESSION_APP_ID &&
    value.version === PERSISTED_STUDY_SESSION_VERSION &&
    typeof value.sessionId === "string" &&
    value.sessionId.trim().length > 0 &&
    typeof value.savedAt === "string" &&
    value.savedAt.trim().length > 0 &&
    isQuizStudyState(value.studyState) &&
    isQuizReviewState(value.reviewState)
  );
}

export function parsePersistedStudySessionDocument(
  value: string | null | undefined,
): PersistedStudySessionDocument | null {
  if (!value || value.trim().length === 0) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    return isPersistedStudySessionDocument(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function extractPersistedStudySessionPayload(
  document: PersistedStudySessionDocument,
): PersistedStudySessionPayload {
  return {
    studyState: document.studyState,
    reviewState: document.reviewState,
  };
}

export function getPersistedStudySessionProgressSummary(
  document: PersistedStudySessionDocument,
): string {
  const studyProgress = getStudyProgress(document.studyState);
  const reviewProgress = getQuizReviewProgress(document.reviewState);

  return `${studyProgress.revealed} revealed · ${reviewProgress.reviewed} reviewed · ${reviewProgress.accuracyPercentage}% accuracy`;
}

export function hasPersistedStudySessionProgress(
  document: PersistedStudySessionDocument,
): boolean {
  const studyProgress = getStudyProgress(document.studyState);
  const reviewProgress = getQuizReviewProgress(document.reviewState);

  return studyProgress.revealed > 0 || reviewProgress.reviewed > 0;
}

export function getPersistedStudySessionSavedAtLabel(
  document: PersistedStudySessionDocument,
): string {
  if (!document.savedAt || Number.isNaN(Date.parse(document.savedAt))) {
    return "Unknown save time";
  }

  return document.savedAt.slice(0, 16).replace("T", " ");
}
