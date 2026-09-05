export interface BookUploadFileMetadata {
  name: string;
  type: string;
  size: number;
}

export interface BookUploadInput {
  title: string;
  author: string;
  description?: string;
  category?: string;
  language?: string;
  bookFile: BookUploadFileMetadata;
  coverFile?: BookUploadFileMetadata | null;
}
export const MAX_BOOK_FILE_SIZE = 25 * 1024 * 1024;
export const MAX_BOOK_COVER_SIZE = 5 * 1024 * 1024;

export const ALLOWED_BOOK_MIME_TYPES = [
  "application/pdf",
] as const;

export const ALLOWED_COVER_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_BOOK_EXTENSIONS = [".pdf"] as const;

export const ALLOWED_COVER_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
] as const;

export interface BookValidationResult {
  valid: boolean;
  errors: string[];
}

function getExtension(fileName: string): string {
  const normalized = fileName.trim().toLowerCase();
  const lastDot = normalized.lastIndexOf(".");

  if (lastDot < 0) {
    return "";
  }

  return normalized.slice(lastDot);
}

function hasUnsafePath(fileName: string): boolean {
  return (
    fileName.includes("../") ||
    fileName.includes("..\\") ||
    fileName.includes("/") ||
    fileName.includes("\\") ||
    fileName.includes("\0")
  );
}

function validateRequiredText(
  value: string,
  fieldName: string,
  maxLength: number,
): string[] {
  const errors: string[] = [];
  const normalized = value.trim();

  if (!normalized) {
    errors.push(`${fieldName} is required.`);
    return errors;
  }

  if (normalized.length > maxLength) {
    errors.push(`${fieldName} must be ${maxLength} characters or fewer.`);
  }

  return errors;
}

export function validateBookFile(
  file: BookUploadFileMetadata | null | undefined,
): BookValidationResult {
  const errors: string[] = [];

  if (!file) {
    return {
      valid: false,
      errors: ["A PDF book file is required."],
    };
  }

  if (!file.name.trim()) {
    errors.push("Book filename is required.");
  }

  if (hasUnsafePath(file.name)) {
    errors.push("Book filename contains an unsafe path.");
  }

  if (
    !ALLOWED_BOOK_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_BOOK_MIME_TYPES)[number],
    )
  ) {
    errors.push("Book file must be a PDF.");
  }

  if (
    !ALLOWED_BOOK_EXTENSIONS.includes(
      getExtension(file.name) as (typeof ALLOWED_BOOK_EXTENSIONS)[number],
    )
  ) {
    errors.push("Book file must use the .pdf extension.");
  }

  if (!Number.isFinite(file.size) || file.size <= 0) {
    errors.push("Book file is empty.");
  }

  if (file.size > MAX_BOOK_FILE_SIZE) {
    errors.push("Book file must be 25 MB or smaller.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateBookCover(
  file: BookUploadFileMetadata | null | undefined,
): BookValidationResult {
  if (!file) {
    return {
      valid: true,
      errors: [],
    };
  }

  const errors: string[] = [];

  if (!file.name.trim()) {
    errors.push("Cover filename is required.");
  }

  if (hasUnsafePath(file.name)) {
    errors.push("Cover filename contains an unsafe path.");
  }

  if (
    !ALLOWED_COVER_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_COVER_MIME_TYPES)[number],
    )
  ) {
    errors.push("Cover must be JPG, JPEG, PNG, or WEBP.");
  }

  if (
    !ALLOWED_COVER_EXTENSIONS.includes(
      getExtension(file.name) as (typeof ALLOWED_COVER_EXTENSIONS)[number],
    )
  ) {
    errors.push("Cover must use .jpg, .jpeg, .png, or .webp.");
  }

  if (!Number.isFinite(file.size) || file.size <= 0) {
    errors.push("Cover file is empty.");
  }

  if (file.size > MAX_BOOK_COVER_SIZE) {
    errors.push("Cover image must be 5 MB or smaller.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateBookUpload(
  input: BookUploadInput,
): BookValidationResult {
  const errors: string[] = [
    ...validateRequiredText(input.title, "Book title", 200),
    ...validateRequiredText(input.author, "Author", 160),
  ];

  if ((input.description ?? "").length > 5000) {
    errors.push("Description must be 5000 characters or fewer.");
  }

  if ((input.category ?? "").length > 100) {
    errors.push("Category must be 100 characters or fewer.");
  }

  if ((input.language ?? "").length > 100) {
    errors.push("Language must be 100 characters or fewer.");
  }

  errors.push(...validateBookFile(input.bookFile).errors);
  errors.push(...validateBookCover(input.coverFile).errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}
