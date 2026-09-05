import {
  ApiError,
} from "../api/ApiError";

import type {
  BookPage,
  BookReaderMode,
  RemoteBook,
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

function asString(
  value: unknown,
): string | null {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  if (
    typeof value === "number"
  ) {
    return String(
      value,
    );
  }

  return null;
}

function asNumber(
  value: unknown,
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const parsed =
      Number(
        value,
      );

    if (
      Number.isFinite(parsed)
    ) {
      return parsed;
    }
  }

  return null;
}

function asBoolean(
  value: unknown,
  fallback = false,
): boolean {
  if (
    typeof value === "boolean"
  ) {
    return value;
  }

  if (
    value === 1 ||
    value === "1" ||
    value === "true"
  ) {
    return true;
  }

  if (
    value === 0 ||
    value === "0" ||
    value === "false"
  ) {
    return false;
  }

  return fallback;
}

function normalizeReaderMode(
  value: unknown,
): BookReaderMode {
  return value ===
    "FOCUS"
    ? "FOCUS"
    : "READING";
}

function unwrapSingle(
  raw: unknown,
): UnknownRecord {
  const root =
    asRecord(
      raw,
    );

  if (!root) {
    throw new ApiError(
      "Book API returned an invalid response.",
      {
        code:
          "PARSE_ERROR",

        details:
          raw,
      },
    );
  }

  const data =
    asRecord(
      root.data,
    );

  const book =
    asRecord(
      root.book,
    );

  const dataBook =
    asRecord(
      data?.book,
    );

  return (
    dataBook ??
    book ??
    data ??
    root
  );
}

export function normalizeRemoteBook(
  raw: unknown,
  index = 0,
): RemoteBook {
  const book =
    unwrapSingle(
      raw,
    );

  const progress =
    asRecord(
      book.progress,
    );

  const id =
    asString(
      book.id ??
      book.bookId,
    ) ??
    `remote-book-${index}`;

  const pageCount =
    Math.max(
      0,
      Math.floor(
        asNumber(
          book.pageCount ??
          book.pages ??
          book.totalPages,
        ) ??
        0,
      ),
    );

  const currentPage =
    Math.max(
      0,
      Math.floor(
        asNumber(
          progress?.currentPage ??
          progress?.page ??
          book.currentPage ??
          book.lastPage,
        ) ??
        0,
      ),
    );

  const explicitPercentage =
    asNumber(
      progress?.percentage ??
      progress?.progressPercentage ??
      book.progressPercentage ??
      book.percentage,
    );

  const progressPercentage =
    Math.max(
      0,
      Math.min(
        100,
        explicitPercentage ??
        (
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
            : 0
        ),
      ),
    );

  return {
    id,

    title:
      asString(
        book.title ??
        book.name,
      ) ??
      "Untitled book",

    author:
      asString(
        book.author ??
        book.writer,
      ),

    description:
      asString(
        book.description ??
        book.summary,
      ),

    language:
      asString(
        book.language ??
        book.locale,
      ),

    pageCount,

    favorite:
      asBoolean(
        book.favorite ??
        book.isFavorite,
        false,
      ),

    readerMode:
      normalizeReaderMode(
        progress?.readerMode ??
        book.readerMode,
      ),

    currentPage,

    progressPercentage,

    coverUrl:
      asString(
        book.coverUrl ??
        book.coverImageUrl ??
        book.thumbnailUrl,
      ),

    fileUrl:
      asString(
        book.fileUrl ??
        book.documentUrl ??
        book.pdfUrl,
      ),

    sourceFileName:
      asString(
        book.sourceFileName ??
        book.fileName ??
        book.originalFileName,
      ),

    createdAt:
      asString(
        book.createdAt,
      ),

    updatedAt:
      asString(
        book.updatedAt,
      ),

    lastReadAt:
      asString(
        progress?.lastReadAt ??
        book.lastReadAt,
      ),
  };
}

function resolveList(
  raw: unknown,
): unknown[] {
  if (
    Array.isArray(
      raw,
    )
  ) {
    return raw;
  }

  const root =
    asRecord(
      raw,
    );

  if (!root) {
    return [];
  }

  if (
    Array.isArray(
      root.data,
    )
  ) {
    return root.data;
  }

  const data =
    asRecord(
      root.data,
    );

  const candidates = [
    root.items,
    root.books,
    root.results,
    data?.items,
    data?.books,
    data?.results,
  ];

  for (
    const candidate of candidates
  ) {
    if (
      Array.isArray(
        candidate,
      )
    ) {
      return candidate;
    }
  }

  return [];
}

export function normalizeBookPage(
  raw: unknown,
  requestedPage: number,
  requestedPageSize: number,
): BookPage {
  const items =
    resolveList(
      raw,
    ).map(
      (
        item,
        index,
      ) =>
        normalizeRemoteBook(
          item,
          index,
        ),
    );

  const root =
    Array.isArray(
      raw,
    )
      ? null
      : asRecord(
          raw,
        );

  const data =
    asRecord(
      root?.data,
    );

  const meta =
    asRecord(
      root?.meta,
    ) ??
    asRecord(
      root?.pagination,
    ) ??
    asRecord(
      data?.meta,
    ) ??
    asRecord(
      data?.pagination,
    );

  const total =
    asNumber(
      meta?.total ??
      root?.total ??
      data?.total,
    ) ??
    items.length;

  const page =
    asNumber(
      meta?.page ??
      root?.page ??
      data?.page,
    ) ??
    requestedPage;

  const pageSize =
    asNumber(
      meta?.pageSize ??
      meta?.limit ??
      root?.pageSize ??
      root?.limit ??
      data?.pageSize ??
      data?.limit,
    ) ??
    requestedPageSize;

  const explicitHasMore =
    meta?.hasMore ??
    root?.hasMore ??
    data?.hasMore;

  const hasMore =
    typeof explicitHasMore ===
      "boolean"
      ? explicitHasMore
      : page *
          pageSize <
        total;

  return {
    items,

    total:
      Math.max(
        0,
        Math.floor(
          total,
        ),
      ),

    page:
      Math.max(
        1,
        Math.floor(
          page,
        ),
      ),

    pageSize:
      Math.max(
        1,
        Math.floor(
          pageSize,
        ),
      ),

    hasMore,
  };
}