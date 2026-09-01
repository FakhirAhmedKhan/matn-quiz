import { isGeneratedQuiz } from "@/lib/quiz/quiz-history";
import { getGeneratedQuizMethodLabel } from "@/lib/quiz/unified-quiz";
import type { GeneratedQuiz } from "@/types/quiz";

export const SHAREABLE_QUIZ_APP_ID = "matn-quiz";

export const SHAREABLE_QUIZ_VERSION = 1;

export const SHAREABLE_QUIZ_FILE_EXTENSION = ".json";

export const SHAREABLE_QUIZ_MIME_TYPE = "application/json;charset=utf-8";

export interface ShareableQuizMetadata {
  title: string;
  methodLabel: string;
  hiddenCount: number;
  answerCount: number;
}

export interface ShareableQuizDocument {
  appId: typeof SHAREABLE_QUIZ_APP_ID;
  version: typeof SHAREABLE_QUIZ_VERSION;
  exportedAt: string;
  metadata: ShareableQuizMetadata;
  quiz: GeneratedQuiz;
}

export interface CreateShareableQuizDocumentOptions {
  exportedAt?: Date;
  title?: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createShareableQuizTitle(quiz: GeneratedQuiz): string {
  const methodLabel = getGeneratedQuizMethodLabel(quiz.method);
  const previewText = quiz.originalText.replace(/\s+/g, " ").trim();
  const safePreview = previewText.length > 0 ? previewText : "Untitled Quiz";
  const preview =
    safePreview.length > 42 ? `${safePreview.slice(0, 42)}...` : safePreview;

  return `${methodLabel} · ${quiz.hiddenCount} hidden · ${preview}`;
}

export function createShareableQuizMetadata(
  quiz: GeneratedQuiz,
  title = createShareableQuizTitle(quiz),
): ShareableQuizMetadata {
  return {
    title,
    methodLabel: getGeneratedQuizMethodLabel(quiz.method),
    hiddenCount: quiz.hiddenCount,
    answerCount: quiz.answers.length,
  };
}

export function createShareableQuizDocument(
  quiz: GeneratedQuiz,
  options: CreateShareableQuizDocumentOptions = {},
): ShareableQuizDocument {
  const exportedAt = options.exportedAt ?? new Date();

  return {
    appId: SHAREABLE_QUIZ_APP_ID,
    version: SHAREABLE_QUIZ_VERSION,
    exportedAt: exportedAt.toISOString(),
    metadata: createShareableQuizMetadata(quiz, options.title),
    quiz,
  };
}

export function serializeShareableQuizDocument(
  document: ShareableQuizDocument,
): string {
  return JSON.stringify(document, null, 2);
}

export function isShareableQuizMetadata(
  value: unknown,
): value is ShareableQuizMetadata {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.methodLabel === "string" &&
    value.methodLabel.trim().length > 0 &&
    typeof value.hiddenCount === "number" &&
    Number.isFinite(value.hiddenCount) &&
    typeof value.answerCount === "number" &&
    Number.isFinite(value.answerCount)
  );
}

export function isShareableQuizDocument(
  value: unknown,
): value is ShareableQuizDocument {
  if (!isObject(value)) {
    return false;
  }

  return (
    value.appId === SHAREABLE_QUIZ_APP_ID &&
    value.version === SHAREABLE_QUIZ_VERSION &&
    typeof value.exportedAt === "string" &&
    value.exportedAt.trim().length > 0 &&
    isShareableQuizMetadata(value.metadata) &&
    isGeneratedQuiz(value.quiz)
  );
}

export function parseShareableQuizDocument(
  value: string | null | undefined,
): ShareableQuizDocument | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    return isShareableQuizDocument(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function extractQuizFromShareableDocument(
  document: ShareableQuizDocument,
): GeneratedQuiz {
  return document.quiz;
}

export function getShareableQuizFileName(
  quiz: GeneratedQuiz,
  now = new Date(),
): string {
  const method = quiz.method === "HIDE_WORD" ? "hide-words" : "hide-lines";
  const date = now.toISOString().slice(0, 10);

  return `matn-quiz-${method}-${date}${SHAREABLE_QUIZ_FILE_EXTENSION}`;
}

export function getShareableQuizDocumentSummary(
  document: ShareableQuizDocument,
): string {
  const answerLabel =
    document.metadata.answerCount === 1 ? "answer" : "answers";

  return `${document.metadata.methodLabel}: ${document.metadata.hiddenCount} hidden, ${document.metadata.answerCount} ${answerLabel}`;
}
