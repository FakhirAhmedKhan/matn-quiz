import type {
  BookCategory,
  BookFileMetadata,
  ImportedBookInput,
} from "../types/book";

export const MAX_BOOK_FILE_BYTES =
  25 * 1024 * 1024;

export type BookImportValidation = {
  valid: boolean;
  message: string;
};

export function formatFileSize(
  bytes: number | null,
): string {
  if (
    bytes === null ||
    !Number.isFinite(bytes) ||
    bytes < 0
  ) {
    return "Unknown size";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

export function validateBookImportFile(
  file: BookFileMetadata | null,
): BookImportValidation {
  if (!file) {
    return {
      valid: false,
      message:
        "Choose a PDF document to continue.",
    };
  }

  const lowerName =
    file.fileName.toLowerCase();

  const pdfByName =
    lowerName.endsWith(
      ".pdf",
    );

  const pdfByMime =
    file.mimeType ===
    "application/pdf";

  if (
    !pdfByName &&
    !pdfByMime
  ) {
    return {
      valid: false,
      message:
        "Only PDF documents are supported in this demo import flow.",
    };
  }

  if (
    file.sizeBytes !== null &&
    file.sizeBytes >
      MAX_BOOK_FILE_BYTES
  ) {
    return {
      valid: false,
      message:
        "The selected PDF is larger than the 25 MB demo limit.",
    };
  }

  return {
    valid: true,
    message:
      "PDF selected and ready for import.",
  };
}

export function validateImportedBookInput(
  input: {
    title: string;
    author: string;
    description: string;
    category: BookCategory;
    totalPages: number;
    file: BookFileMetadata | null;
  },
): BookImportValidation {
  if (
    input.title.trim().length <
    2
  ) {
    return {
      valid: false,
      message:
        "Add a book title.",
    };
  }

  if (
    input.author.trim().length <
    2
  ) {
    return {
      valid: false,
      message:
        "Add the author or source name.",
    };
  }

  if (
    !Number.isInteger(
      input.totalPages,
    ) ||
    input.totalPages < 1 ||
    input.totalPages > 5000
  ) {
    return {
      valid: false,
      message:
        "Enter an estimated page count from 1 to 5000.",
    };
  }

  const fileValidation =
    validateBookImportFile(
      input.file,
    );

  if (!fileValidation.valid) {
    return fileValidation;
  }

  return {
    valid: true,
    message:
      "Book metadata and PDF are ready to import.",
  };
}

export function createImportedBookId(
  title: string,
): string {
  const slug =
    title
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9\u0600-\u06ff]+/gu,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      )
      .slice(
        0,
        40,
      );

  return `${
    slug ||
    "imported-book"
  }-${Date.now()}`;
}

export function buildImportedBookInput(
  values: {
    title: string;
    arabicTitle: string;
    author: string;
    description: string;
    category: BookCategory;
    totalPages: number;
    file: BookFileMetadata;
  },
): ImportedBookInput {
  return {
    title:
      values.title.trim(),

    arabicTitle:
      values.arabicTitle.trim() ||
      undefined,

    author:
      values.author.trim(),

    description:
      values.description.trim() ||
      "Locally imported PDF document.",

    category:
      values.category,

    totalPages:
      values.totalPages,

    file:
      values.file,
  };
}