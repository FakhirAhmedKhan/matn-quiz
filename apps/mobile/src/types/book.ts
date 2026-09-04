export type BookCategory =
  | "QURAN"
  | "HADITH"
  | "FIQH"
  | "AQEEDAH"
  | "ARABIC"
  | "POETRY";

export type BookCategoryFilter =
  | "ALL"
  | BookCategory;

export type BookSourceType =
  | "DEMO"
  | "IMPORTED";

export type BookFileMetadata = {
  fileName: string;
  fileUri: string;
  mimeType: string | null;
  sizeBytes: number | null;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  arabicTitle?: string;
  description: string;
  category: BookCategory;
  totalPages: number;
  currentPage: number;
  isFavorite: boolean;
  addedAt: string;
  lastOpenedAt: string | null;
  sourceLabel: string;
  sourceType?: BookSourceType;
  file?: BookFileMetadata | null;
};

export type ImportedBookInput = {
  title: string;
  arabicTitle?: string;
  author: string;
  description: string;
  category: BookCategory;
  totalPages: number;
  file: BookFileMetadata;
};

export type BookLibraryStats = {
  totalBooks: number;
  startedBooks: number;
  completedBooks: number;
  favoriteBooks: number;
};

export type BookProgress = {
  currentPage: number;
  totalPages: number;
  percentage: number;
  completed: boolean;
  started: boolean;
};