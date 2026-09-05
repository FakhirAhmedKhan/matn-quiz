import {
  create,
} from "zustand";

import {
  isApiError,
} from "../api/ApiError";

import {
  createPoemProgressFromLocalStore,
  createRemotePoemFromLocalStore,
} from "../poem-api/poemAdapter";

import {
  poemApi,
} from "../poem-api/poemApi";

import type {
  PoemCloudStatus,
  RemotePoem,
  SavePoemProgressInput,
  UpdateRemotePoemInput,
} from "../poem-api/types";

type PoemCloudState = {
  items:
    RemotePoem[];

  selected:
    RemotePoem | null;

  status:
    PoemCloudStatus;

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

  lastSyncedAt:
    string | null;

  loadPoems:
    () =>
      Promise<boolean>;

  refreshPoems:
    () =>
      Promise<boolean>;

  loadMore:
    () =>
      Promise<boolean>;

  loadPoem:
    (
      poemId: string,
    ) =>
      Promise<boolean>;

  createFromLocal:
    () =>
      Promise<boolean>;

  updateSelected:
    (
      input: UpdateRemotePoemInput,
    ) =>
      Promise<boolean>;

  saveSelectedProgress:
    (
      input?: SavePoemProgressInput,
    ) =>
      Promise<boolean>;

  deletePoem:
    (
      poemId: string,
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
      return "Unable to reach the poem server.";
    }

    if (
      error.code ===
      "TIMEOUT"
    ) {
      return "The poem request timed out.";
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
      return "Poem endpoint or poem was not found.";
    }

    return (
      error.message ||
      "Poem synchronization failed."
    );
  }

  if (
    error instanceof
    Error
  ) {
    return error.message;
  }

  return "Poem synchronization failed.";
}

function replaceItem(
  items: RemotePoem[],
  updated: RemotePoem,
): RemotePoem[] {
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

export const usePoemCloudStore =
  create<PoemCloudState>(
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

          lastSyncedAt:
            null,
        });
      },

      loadPoems:
        async () => {
          set({
            status:
              "loading",

            error:
              null,
          });

          try {
            const result =
              await poemApi.getPoems({
                page:
                  1,

                pageSize:
                  get().pageSize,
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

      refreshPoems:
        async () => {
          set({
            status:
              "refreshing",

            error:
              null,
          });

          try {
            const result =
              await poemApi.getPoems({
                page:
                  1,

                pageSize:
                  get().pageSize,
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

          const nextPage =
            state.page +
            1;

          set({
            status:
              "loading-more",

            error:
              null,
          });

          try {
            const result =
              await poemApi.getPoems({
                page:
                  nextPage,

                pageSize:
                  state.pageSize,
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

      loadPoem:
        async (
          poemId,
        ) => {
          set({
            status:
              "loading-detail",

            error:
              null,
          });

          try {
            const selected =
              await poemApi.getPoem(
                poemId,
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
              createRemotePoemFromLocalStore();

            const created =
              await poemApi.createPoem(
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
                "Select a cloud poem first.",
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
              await poemApi.updatePoem(
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
                "Select a cloud poem first.",
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
              createPoemProgressFromLocalStore(
                selected.lineCount,
              );

            await poemApi.saveProgress(
              selected.id,
              progress,
            );

            const updated:
              RemotePoem = {
                ...selected,

                currentLineIndex:
                  progress.currentLineIndex,

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

      deletePoem:
        async (
          poemId,
        ) => {
          set({
            status:
              "deleting",

            error:
              null,
          });

          try {
            await poemApi.deletePoem(
              poemId,
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
                      poemId,
                  ),

                selected:
                  state.selected?.id ===
                    poemId
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