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