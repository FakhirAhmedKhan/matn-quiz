import type { GeneratedQuiz } from "@/types/quiz";
import {
  createShareableQuizDocument,
  getShareableQuizFileName,
  serializeShareableQuizDocument,
  SHAREABLE_QUIZ_MIME_TYPE,
  type ShareableQuizDocument,
} from "@/lib/quiz/shareable-quiz";

export interface CreateShareableQuizJsonOptions {
  exportedAt?: Date;
  title?: string;
}

export interface ExportShareableQuizFileOptions
  extends CreateShareableQuizJsonOptions {
  fileName?: string;
}

export interface DownloadTextFileOptions {
  fileName: string;
  content: string;
  mimeType?: string;
}

function createDocumentOptions(options: CreateShareableQuizJsonOptions = {}) {
  const documentOptions: { exportedAt?: Date; title?: string } = {};

  if (options.exportedAt) {
    documentOptions.exportedAt = options.exportedAt;
  }

  if (typeof options.title === "string") {
    documentOptions.title = options.title;
  }

  return documentOptions;
}

export function createShareableQuizJsonText(
  quiz: GeneratedQuiz,
  options: CreateShareableQuizJsonOptions = {},
): string {
  return serializeShareableQuizDocument(
    createShareableQuizDocument(quiz, createDocumentOptions(options)),
  );
}

export function createShareableQuizJsonBlob(
  document: ShareableQuizDocument,
): Blob {
  return new Blob([serializeShareableQuizDocument(document)], {
    type: SHAREABLE_QUIZ_MIME_TYPE,
  });
}

export function createShareableQuizJsonBlobFromQuiz(
  quiz: GeneratedQuiz,
  options: CreateShareableQuizJsonOptions = {},
): Blob {
  return createShareableQuizJsonBlob(
    createShareableQuizDocument(quiz, createDocumentOptions(options)),
  );
}

export function canUseBrowserDownload(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof Blob !== "undefined" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function" &&
    typeof URL.revokeObjectURL === "function"
  );
}

export function downloadTextFile({
  fileName,
  content,
  mimeType = "text/plain;charset=utf-8",
}: DownloadTextFileOptions): boolean {
  if (!canUseBrowserDownload()) {
    return false;
  }

  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    return true;
  } catch {
    return false;
  }
}

export function exportShareableQuizAsJsonFile(
  quiz: GeneratedQuiz,
  options: ExportShareableQuizFileOptions = {},
): boolean {
  const exportedAt = options.exportedAt ?? new Date();

  const content = createShareableQuizJsonText(quiz, {
    exportedAt,
    title: options.title,
  });

  const fileName =
    options.fileName ?? getShareableQuizFileName(quiz, exportedAt);

  return downloadTextFile({
    fileName,
    content,
    mimeType: SHAREABLE_QUIZ_MIME_TYPE,
  });
}

export function canUseClipboard(): boolean {
  return (
    typeof navigator !== "undefined" &&
    Boolean(navigator.clipboard) &&
    typeof navigator.clipboard.writeText === "function"
  );
}

export async function copyShareableQuizJsonToClipboard(
  quiz: GeneratedQuiz,
  options: CreateShareableQuizJsonOptions = {},
): Promise<boolean> {
  if (!canUseClipboard()) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(
      createShareableQuizJsonText(quiz, options),
    );

    return true;
  } catch {
    return false;
  }
}

export function createShareableQuizDownloadPayload(
  quiz: GeneratedQuiz,
  options: ExportShareableQuizFileOptions = {},
): DownloadTextFileOptions {
  const exportedAt = options.exportedAt ?? new Date();

  return {
    fileName: options.fileName ?? getShareableQuizFileName(quiz, exportedAt),
    content: createShareableQuizJsonText(quiz, {
      exportedAt,
      title: options.title,
    }),
    mimeType: SHAREABLE_QUIZ_MIME_TYPE,
  };
}
