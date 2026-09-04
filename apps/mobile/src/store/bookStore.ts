import {
  create,
} from "zustand";

import {
  persist,
} from "zustand/middleware";

import {
  demoBooks,
} from "../mocks/demoBooks";

import type {
  Book,
  BookCategoryFilter,
  ImportedBookInput,
} from "../types/book";

import {
  createImportedBookId,
} from "../utils/bookImport";

import {
  STORAGE_KEYS,
  STORAGE_VERSION,
  zustandAsyncStorage,
} from "../storage/appStorage";

type BookStore = {
  books: Book[];

  searchQuery: string;

  categoryFilter:
    BookCategoryFilter;

  setSearchQuery: (
    query: string,
  ) => void;

  setCategoryFilter: (
    category: BookCategoryFilter,
  ) => void;

  toggleFavorite: (
    bookId: string,
  ) => void;

  updateReadingProgress: (
    bookId: string,
    currentPage: number,
  ) => void;

  markBookOpened: (
    bookId: string,
  ) => void;

  addImportedBook: (
    input: ImportedBookInput,
  ) => Book;

  resetLibraryDemo:
    () => void;
};

function cloneDemoBooks(): Book[] {
  return demoBooks.map(
    (book) => ({
      ...book,

      sourceType:
        book.sourceType ??
        "DEMO",

      file:
        book.file ??
        null,
    }),
  );
}

export const useBookStore =
  create<BookStore>()(
    persist(
      (set) => ({
        books:
          cloneDemoBooks(),

        searchQuery:
          "",

        categoryFilter:
          "ALL",

        setSearchQuery: (
          searchQuery,
        ) =>
          set({
            searchQuery,
          }),

        setCategoryFilter: (
          categoryFilter,
        ) =>
          set({
            categoryFilter,
          }),

        toggleFavorite: (
          bookId,
        ) =>
          set(
            (state) => ({
              books:
                state.books.map(
                  (book) =>
                    book.id ===
                    bookId
                      ? {
                          ...book,

                          isFavorite:
                            !book.isFavorite,
                        }
                      : book,
                ),
            }),
          ),

        updateReadingProgress: (
          bookId,
          currentPage,
        ) =>
          set(
            (state) => ({
              books:
                state.books.map(
                  (book) => {
                    if (
                      book.id !==
                      bookId
                    ) {
                      return book;
                    }

                    const safePage =
                      Math.min(
                        book.totalPages,
                        Math.max(
                          0,
                          Math.floor(
                            currentPage,
                          ),
                        ),
                      );

                    return {
                      ...book,

                      currentPage:
                        safePage,

                      lastOpenedAt:
                        new Date().toISOString(),
                    };
                  },
                ),
            }),
          ),

        markBookOpened: (
          bookId,
        ) =>
          set(
            (state) => ({
              books:
                state.books.map(
                  (book) =>
                    book.id ===
                    bookId
                      ? {
                          ...book,

                          lastOpenedAt:
                            new Date().toISOString(),
                        }
                      : book,
                ),
            }),
          ),

        addImportedBook: (
          input,
        ) => {
          const now =
            new Date().toISOString();

          const book: Book = {
            id:
              createImportedBookId(
                input.title,
              ),

            title:
              input.title,

            arabicTitle:
              input.arabicTitle,

            author:
              input.author,

            description:
              input.description,

            category:
              input.category,

            totalPages:
              input.totalPages,

            currentPage:
              0,

            isFavorite:
              false,

            addedAt:
              now,

            lastOpenedAt:
              null,

            sourceLabel:
              "Imported PDF",

            sourceType:
              "IMPORTED",

            file:
              input.file,
          };

          set(
            (state) => ({
              books: [
                book,
                ...state.books,
              ],
            }),
          );

          return book;
        },

        resetLibraryDemo:
          () =>
            set({
              books:
                cloneDemoBooks(),

              searchQuery:
                "",

              categoryFilter:
                "ALL",
            }),
      }),
      {
        name:
          STORAGE_KEYS.books,

        version:
          STORAGE_VERSION,

        storage:
          zustandAsyncStorage,

        partialize: (
          state,
        ) => ({
          books:
            state.books,

          searchQuery:
            state.searchQuery,

          categoryFilter:
            state.categoryFilter,
        }),
      },
    ),
  );