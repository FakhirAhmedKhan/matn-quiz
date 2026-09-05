import {
  useBookStore,
} from "../store/bookStore";

import type {
  BookReaderMode,
  CreateRemoteBookInput,
  SaveBookProgressInput,
} from "./types";

type UnknownRecord =
  Record<string, unknown>;

function asRecord(
  value: unknown,
): UnknownRecord | null {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return null;
  }

  return value as UnknownRecord;
}

function readString(
  source: UnknownRecord,
  keys: readonly string[],
): string | null {
  for (
    const key of keys
  ) {
    const value =
      source[key];

    if (
      typeof value ===
        "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return null;
}

function readNumber(
  source: UnknownRecord,
  keys: readonly string[],
): number | null {
  for (
    const key of keys
  ) {
    const value =
      source[key];

    if (
      typeof value ===
        "number" &&
      Number.isFinite(
        value,
      )
    ) {
      return value;
    }
  }

  return null;
}

function resolveLocalBook(): UnknownRecord {
  const state =
    useBookStore.getState() as unknown as UnknownRecord;

  const direct =
    asRecord(
      state.selectedBook,
    ) ??
    asRecord(
      state.currentBook,
    ) ??
    asRecord(
      state.activeBook,
    );

  if (direct) {
    return direct;
  }

  const books =
    Array.isArray(
      state.books,
    )
      ? state.books
      : Array.isArray(
          state.items,
        )
        ? state.items
        : [];

  const first =
    books
      .map(
        asRecord,
      )
      .find(
        Boolean,
      );

  if (first) {
    return first;
  }

  return state;
}

export function createRemoteBookFromLocalStore(): CreateRemoteBookInput {
  const local =
    resolveLocalBook();

  const title =
    readString(
      local,
      [
        "title",
        "name",
        "bookTitle",
      ],
    );

  if (!title) {
    throw new Error(
      "No local book is available to synchronize.",
    );
  }

  const author =
    readString(
      local,
      [
        "author",
        "writer",
      ],
    );

  const description =
    readString(
      local,
      [
        "description",
        "summary",
      ],
    );

  const language =
    readString(
      local,
      [
        "language",
        "locale",
      ],
    );

  const sourceFileName =
    readString(
      local,
      [
        "sourceFileName",
        "fileName",
        "name",
      ],
    );

  const pageCount =
    readNumber(
      local,
      [
        "pageCount",
        "totalPages",
        "pages",
      ],
    );

  return {
    title,

    ...(author
      ? {
          author,
        }
      : {}),

    ...(description
      ? {
          description,
        }
      : {}),

    ...(language
      ? {
          language,
        }
      : {}),

    ...(sourceFileName
      ? {
          sourceFileName,
        }
      : {}),

    ...(pageCount !== null
      ? {
          pageCount:
            Math.max(
              0,
              Math.floor(
                pageCount,
              ),
            ),
        }
      : {}),
  };
}

export function createBookProgressFromLocalStore(
  pageCount: number,
): SaveBookProgressInput {
  const local =
    resolveLocalBook();

  const currentPage =
    Math.max(
      0,
      Math.floor(
        readNumber(
          local,
          [
            "currentPage",
            "page",
            "currentPageIndex",
            "lastPage",
          ],
        ) ??
        0,
      ),
    );

  const rawMode =
    readString(
      local,
      [
        "readerMode",
        "mode",
      ],
    );

  const readerMode:
    BookReaderMode =
      rawMode ===
        "FOCUS"
        ? "FOCUS"
        : "READING";

  const progressPercentage =
    pageCount > 0
      ? Math.round(
          (
            Math.min(
              currentPage,
              pageCount,
            ) /
            pageCount
          ) *
          100,
        )
      : 0;

  return {
    currentPage,

    readerMode,

    progressPercentage:
      Math.max(
        0,
        Math.min(
          100,
          progressPercentage,
        ),
      ),
  };
}