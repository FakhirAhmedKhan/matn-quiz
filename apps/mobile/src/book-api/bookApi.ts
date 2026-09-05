import {
  apiClient,
} from "../api/apiClient";

import {
  BOOK_API_CONFIG,
  bookDeletePath,
  bookDetailPath,
  bookFavoritePath,
  bookProgressPath,
  bookUpdatePath,
} from "./bookApiConfig";

import {
  normalizeBookPage,
  normalizeRemoteBook,
} from "./bookResponse";

import type {
  BookPage,
  BookQuery,
  CreateRemoteBookInput,
  RemoteBook,
  SaveBookProgressInput,
  SetFavoriteInput,
  UpdateRemoteBookInput,
} from "./types";

const DEFAULT_PAGE_SIZE =
  20;

export const bookApi = {
  async getBooks(
    query: BookQuery = {},
  ): Promise<BookPage> {
    const page =
      Math.max(
        1,
        Math.floor(
          query.page ??
          1,
        ),
      );

    const pageSize =
      Math.max(
        1,
        Math.min(
          100,
          Math.floor(
            query.pageSize ??
            DEFAULT_PAGE_SIZE,
          ),
        ),
      );

    const response =
      await apiClient.get<unknown>(
        BOOK_API_CONFIG.listPath,
        {
          query: {
            page,

            pageSize,

            search:
              query.search,

            favorite:
              query.favorite,
          },

          retries:
            0,
        },
      );

    return normalizeBookPage(
      response,
      page,
      pageSize,
    );
  },

  async getBook(
    bookId: string,
  ): Promise<RemoteBook> {
    const response =
      await apiClient.get<unknown>(
        bookDetailPath(
          bookId,
        ),
        {
          retries:
            0,
        },
      );

    return normalizeRemoteBook(
      response,
    );
  },

  async createBook(
    input: CreateRemoteBookInput,
  ): Promise<RemoteBook> {
    const response =
      await apiClient.post<
        unknown,
        CreateRemoteBookInput
      >(
        BOOK_API_CONFIG.createPath,
        input,
        {
          retries:
            0,
        },
      );

    return normalizeRemoteBook(
      response,
    );
  },

  async updateBook(
    bookId: string,
    input: UpdateRemoteBookInput,
  ): Promise<RemoteBook> {
    const response =
      await apiClient.patch<
        unknown,
        UpdateRemoteBookInput
      >(
        bookUpdatePath(
          bookId,
        ),
        input,
        {
          retries:
            0,
        },
      );

    return normalizeRemoteBook(
      response,
    );
  },

  async setFavorite(
    bookId: string,
    favorite: boolean,
  ): Promise<RemoteBook | null> {
    const response =
      await apiClient.patch<
        unknown,
        SetFavoriteInput
      >(
        bookFavoritePath(
          bookId,
        ),
        {
          favorite,
        },
        {
          retries:
            0,
        },
      );

    if (
      response === undefined ||
      response === null
    ) {
      return null;
    }

    return normalizeRemoteBook(
      response,
    );
  },

  async saveProgress(
    bookId: string,
    input: SaveBookProgressInput,
  ): Promise<void> {
    await apiClient.patch<
      unknown,
      SaveBookProgressInput
    >(
      bookProgressPath(
        bookId,
      ),
      input,
      {
        retries:
          0,
      },
    );
  },

  async deleteBook(
    bookId: string,
  ): Promise<void> {
    await apiClient.delete<unknown>(
      bookDeletePath(
        bookId,
      ),
      {
        retries:
          0,
      },
    );
  },
};