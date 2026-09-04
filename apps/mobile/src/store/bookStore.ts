import {
  create,
} from "zustand";

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

type BookStore = {
  books: Book[];
  searchQuery: string;
  categoryFilter: BookCategoryFilter;

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

export const useBookStore =
  create<BookStore>(
    (set) => ({
      books:
        demoBooks.map(
          (book) => ({
            ...book,
          }),
        ),

      searchQuery: "",

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
              demoBooks.map(
                (book) => ({
                  ...book,
                }),
              ),

            searchQuery:
              "",

            categoryFilter:
              "ALL",
          }),
    }),
  );