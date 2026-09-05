import type {
  BookUploadFileMetadata,
  BookUploadInput,
} from "./book-types";

import {
  ALLOWED_BOOK_EXTENSIONS as SHARED_ALLOWED_BOOK_EXTENSIONS,
  ALLOWED_BOOK_MIME_TYPES as SHARED_ALLOWED_BOOK_MIME_TYPES,
  ALLOWED_COVER_EXTENSIONS as SHARED_ALLOWED_COVER_EXTENSIONS,
  ALLOWED_COVER_MIME_TYPES as SHARED_ALLOWED_COVER_MIME_TYPES,
  MAX_BOOK_COVER_SIZE as SHARED_MAX_BOOK_COVER_SIZE,
  MAX_BOOK_FILE_SIZE as SHARED_MAX_BOOK_FILE_SIZE,
  validateBookCover as validateSharedBookCover,
  validateBookFile as validateSharedBookFile,
  validateBookUpload as validateSharedBookUpload,
} from "@matn-quiz/content-core/book-file-validation";

export const MAX_BOOK_FILE_SIZE =
  SHARED_MAX_BOOK_FILE_SIZE;

export const MAX_BOOK_COVER_SIZE =
  SHARED_MAX_BOOK_COVER_SIZE;

export const ALLOWED_BOOK_MIME_TYPES =
  SHARED_ALLOWED_BOOK_MIME_TYPES;

export const ALLOWED_COVER_MIME_TYPES =
  SHARED_ALLOWED_COVER_MIME_TYPES;

export const ALLOWED_BOOK_EXTENSIONS =
  SHARED_ALLOWED_BOOK_EXTENSIONS;

export const ALLOWED_COVER_EXTENSIONS =
  SHARED_ALLOWED_COVER_EXTENSIONS;

export interface BookValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Web compatibility wrapper.
 *
 * Canonical validation logic lives in:
 * @matn-quiz/content-core/book-file-validation
 *
 * Web-owned BookUploadFileMetadata is intentionally preserved
 * so API routes and FormData parsing remain unchanged.
 */
export function validateBookFile(
  file:
    BookUploadFileMetadata |
    null |
    undefined,
): BookValidationResult {
  return validateSharedBookFile(
    file,
  );
}

/**
 * Web compatibility wrapper for optional cover validation.
 */
export function validateBookCover(
  file:
    BookUploadFileMetadata |
    null |
    undefined,
): BookValidationResult {
  return validateSharedBookCover(
    file,
  );
}

/**
 * Web compatibility wrapper.
 *
 * The Web BookUploadInput contract stays inside apps/web.
 * Only pure validation is delegated to content-core.
 */
export function validateBookUpload(
  input: BookUploadInput,
): BookValidationResult {
  return validateSharedBookUpload(
    input,
  );
}
