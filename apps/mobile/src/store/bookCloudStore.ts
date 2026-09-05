import {
  create,
} from "zustand";

import {
  isApiError,
} from "../api/ApiError";

import {
  createBookProgressFromLocalStore,
  createRemoteBookFromLocalStore,
} from "../book-api/bookAdapter";

import {
  bookApi,
} from "../book-api/bookApi";

import type {
  BookCloudStatus,
  RemoteBook,
  SaveBookProgressInput,
  UpdateRemoteBookInput,
} from "../book-api/types";

type BookCloudState = {
  items:
    RemoteBook[];

  selected:
    RemoteBook | null;

  status:
    BookCloudStatus;

  error:
    string | null;

  page:
    number;

  pageSize:
    number;

  total:
    number;

  hasMore:
    boolean;

  search:
    string;

  lastSyncedAt:
    string | null;

  loadBooks:
    (
      search?: string,
    ) =>
      Promise<boolean>;

  refreshBooks:
    () =>
      Promise<boolean>;

  loadMore:
    () =>
      Promise<boolean>;

  loadBook:
    (
      bookId: string,
    ) =>
      Promise<boolean>;

  createFromLocal:
    () =>
      Promise<boolean>;

  updateSelected:
    (
      input: UpdateRemoteBookInput,
    ) =>
      Promise<boolean>;

  toggleFavorite:
    (
      bookId: string,
    ) =>
      Promise<boolean>;

  saveSelectedProgress:
    (
      input?: SaveBookProgressInput,
    ) =>
      Promise<boolean>;

  deleteBook:
    (
      bookId: string,
    ) =>
      Promise<boolean>;

  clearSelected:
    () =>
      void;

  clearError:
    () =>
      void;

  reset:
    () =>
      void;
};

function getErrorMessage(
  error: unknown,
): string {
  if (
    isApiError(
      error,
    )
  ) {
    if (
      error.code ===
      "NETWORK_ERROR"
    ) {
      return "Unable to reach the book server.";
    }

    if (
      error.code ===
      "TIMEOUT"
    ) {
      return "The book request timed out.";
    }

    if (
      error.status ===
      401
    ) {
      return "Your session has expired.";
    }

    if (
      error.status ===
      404
    ) {
      return "Book endpoint or book was not found.";
    }

    return (
      error.message ||
      "Book synchronization failed."
    );
  }

  if (
    error instanceof
    Error
  ) {
    return error.message;
  }

  return "Book synchronization failed.";
}

function replaceItem(
  items: RemoteBook[],
  updated: RemoteBook,
): RemoteBook[] {
  const exists =
    items.some(
      (
        item,
      ) =>
        item.id ===
        updated.id,
    );

  if (!exists) {
    return [
      updated,
      ...items,
    ];
  }

  return items.map(
    (
      item,
    ) =>
      item.id ===
      updated.id
        ? updated
        : item,
  );
}

export const useBookCloudStore =
  create<BookCloudState>(
    (
      set,
      get,
    ) => ({
      items:
        [],

      selected:
        null,

      status:
        "idle",

      error:
        null,

      page:
        1,

      pageSize:
        20,

      total:
        0,

      hasMore:
        false,

      search:
        "",

      lastSyncedAt:
        null,

      clearSelected: () => {
        set({
          selected:
            null,
        });
      },

      clearError: () => {
        set({
          error:
            null,
        });
      },

      reset: () => {
        set({
          items:
            [],

          selected:
            null,

          status:
            "idle",

          error:
            null,

          page:
            1,

          total:
            0,

          hasMore:
            false,

          search:
            "",

          lastSyncedAt:
            null,
        });
      },

      loadBooks:
        async (
          requestedSearch = "",
        ) => {
          set({
            status:
              "loading",

            error:
              null,

            search:
              requestedSearch,
          });

          try {
            const result =
              await bookApi.getBooks({
                page:
                  1,

                pageSize:
                  get().pageSize,

                search:
                  requestedSearch ||
                  undefined,
              });

            set({
              items:
                result.items,

              page:
                result.page,

              total:
                result.total,

              hasMore:
                result.hasMore,

              status:
                "ready",

              error:
                null,

              lastSyncedAt:
                new Date().toISOString(),
            });

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                getErrorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      refreshBooks:
        async () => {
          set({
            status:
              "refreshing",

            error:
              null,
          });

          try {
            const state =
              get();

            const result =
              await bookApi.getBooks({
                page:
                  1,

                pageSize:
                  state.pageSize,

                search:
                  state.search ||
                  undefined,
              });

            set({
              items:
                result.items,

              page:
                result.page,

              total:
                result.total,

              hasMore:
                result.hasMore,

              status:
                "ready",

              error:
                null,

              lastSyncedAt:
                new Date().toISOString(),
            });

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                getErrorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      loadMore:
        async () => {
          const state =
            get();

          if (
            !state.hasMore ||
            state.status ===
              "loading-more"
          ) {
            return false;
          }

          set({
            status:
              "loading-more",

            error:
              null,
          });

          try {
            const result =
              await bookApi.getBooks({
                page:
                  state.page +
                  1,

                pageSize:
                  state.pageSize,

                search:
                  state.search ||
                  undefined,
              });

            const knownIds =
              new Set(
                state.items.map(
                  (
                    item,
                  ) =>
                    item.id,
                ),
              );

            const incoming =
              result.items.filter(
                (
                  item,
                ) =>
                  !knownIds.has(
                    item.id,
                  ),
              );

            set({
              items: [
                ...state.items,
                ...incoming,
              ],

              page:
                result.page,

              total:
                result.total,

              hasMore:
                result.hasMore,

              status:
                "ready",

              error:
                null,

              lastSyncedAt:
                new Date().toISOString(),
            });

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                getErrorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      loadBook:
        async (
          bookId,
        ) => {
          set({
            status:
              "loading-detail",

            error:
              null,
          });

          try {
            const selected =
              await bookApi.getBook(
                bookId,
              );

            set(
              (
                state,
              ) => ({
                selected,

                items:
                  replaceItem(
                    state.items,
                    selected,
                  ),

                status:
                  "ready",

                error:
                  null,

                lastSyncedAt:
                  new Date().toISOString(),
              }),
            );

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                getErrorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      createFromLocal:
        async () => {
          set({
            status:
              "creating",

            error:
              null,
          });

          try {
            const input =
              createRemoteBookFromLocalStore();

            const created =
              await bookApi.createBook(
                input,
              );

            set(
              (
                state,
              ) => ({
                selected:
                  created,

                items: [
                  created,
                  ...state.items.filter(
                    (
                      item,
                    ) =>
                      item.id !==
                      created.id,
                  ),
                ],

                total:
                  state.total +
                  1,

                status:
                  "ready",

                error:
                  null,

                lastSyncedAt:
                  new Date().toISOString(),
              }),
            );

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                getErrorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      updateSelected:
        async (
          input,
        ) => {
          const selected =
            get().selected;

          if (!selected) {
            set({
              status:
                "error",

              error:
                "Select a cloud book first.",
            });

            return false;
          }

          set({
            status:
              "updating",

            error:
              null,
          });

          try {
            const updated =
              await bookApi.updateBook(
                selected.id,
                input,
              );

            set(
              (
                state,
              ) => ({
                selected:
                  updated,

                items:
                  replaceItem(
                    state.items,
                    updated,
                  ),

                status:
                  "ready",

                error:
                  null,

                lastSyncedAt:
                  new Date().toISOString(),
              }),
            );

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                getErrorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      toggleFavorite:
        async (
          bookId,
        ) => {
          const state =
            get();

          const current =
            state.items.find(
              (
                item,
              ) =>
                item.id ===
                bookId,
            ) ??
            (
              state.selected?.id ===
                bookId
                ? state.selected
                : null
            );

          if (!current) {
            set({
              status:
                "error",

              error:
                "Book not found in the cloud library.",
            });

            return false;
          }

          const nextFavorite =
            !current.favorite;

          set({
            status:
              "saving-favorite",

            error:
              null,
          });

          try {
            const response =
              await bookApi.setFavorite(
                bookId,
                nextFavorite,
              );

            const updated:
              RemoteBook =
                response ??
                {
                  ...current,

                  favorite:
                    nextFavorite,

                  updatedAt:
                    new Date().toISOString(),
                };

            set(
              (
                currentState,
              ) => ({
                items:
                  replaceItem(
                    currentState.items,
                    updated,
                  ),

                selected:
                  currentState.selected?.id ===
                    bookId
                    ? updated
                    : currentState.selected,

                status:
                  "ready",

                error:
                  null,

                lastSyncedAt:
                  new Date().toISOString(),
              }),
            );

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                getErrorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      saveSelectedProgress:
        async (
          input,
        ) => {
          const selected =
            get().selected;

          if (!selected) {
            set({
              status:
                "error",

              error:
                "Select a cloud book first.",
            });

            return false;
          }

          set({
            status:
              "saving-progress",

            error:
              null,
          });

          try {
            const progress =
              input ??
              createBookProgressFromLocalStore(
                selected.pageCount,
              );

            await bookApi.saveProgress(
              selected.id,
              progress,
            );

            const updated:
              RemoteBook = {
                ...selected,

                currentPage:
                  progress.currentPage,

                readerMode:
                  progress.readerMode,

                progressPercentage:
                  progress.progressPercentage,

                lastReadAt:
                  new Date().toISOString(),
              };

            set(
              (
                state,
              ) => ({
                selected:
                  updated,

                items:
                  replaceItem(
                    state.items,
                    updated,
                  ),

                status:
                  "ready",

                error:
                  null,

                lastSyncedAt:
                  new Date().toISOString(),
              }),
            );

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                getErrorMessage(
                  error,
                ),
            });

            return false;
          }
        },

      deleteBook:
        async (
          bookId,
        ) => {
          set({
            status:
              "deleting",

            error:
              null,
          });

          try {
            await bookApi.deleteBook(
              bookId,
            );

            set(
              (
                state,
              ) => ({
                items:
                  state.items.filter(
                    (
                      item,
                    ) =>
                      item.id !==
                      bookId,
                  ),

                selected:
                  state.selected?.id ===
                    bookId
                    ? null
                    : state.selected,

                total:
                  Math.max(
                    0,
                    state.total -
                      1,
                  ),

                status:
                  "ready",

                error:
                  null,

                lastSyncedAt:
                  new Date().toISOString(),
              }),
            );

            return true;
          } catch (error) {
            set({
              status:
                "error",

              error:
                getErrorMessage(
                  error,
                ),
            });

            return false;
          }
        },
    }),
  );