export const BOOK_STATUSES = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
} as const;

export type BookStatus =
  (typeof BOOK_STATUSES)[keyof typeof BOOK_STATUSES];

export interface BookRecord {
  id: string;
  title: string;
  author: string;
  description: string | null;
  category: string | null;
  language: string | null;
  coverUrl: string | null;
  fileUrl: string;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  status: BookStatus;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookInput {
  title: string;
  author: string;
  description?: string | null;
  category?: string | null;
  language?: string | null;
  coverUrl?: string | null;
  fileUrl: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
}

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

export interface StoredBookFile {
  fileName: string;
  absolutePath: string;
  publicUrl: string;
  mimeType: string;
  size: number;
}

export interface BookBinaryUpload {
  name: string;
  type: string;
  size: number;
  bytes: Uint8Array;
}