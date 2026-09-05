import {
  ApiError,
} from "../api/ApiError";

import type {
  PoemPage,
  PoemReaderMode,
  RemotePoem,
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

function normalizeReaderMode(
  value: unknown,
): PoemReaderMode {
  return value ===
    "FOCUS"
    ? "FOCUS"
    : "ALL";
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
      "Poem API returned an invalid response.",
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

  const poem =
    asRecord(
      root.poem,
    );

  const dataPoem =
    asRecord(
      data?.poem,
    );

  return (
    dataPoem ??
    poem ??
    data ??
    root
  );
}

export function normalizeRemotePoem(
  raw: unknown,
  index = 0,
): RemotePoem {
  const poem =
    unwrapSingle(
      raw,
    );

  const progress =
    asRecord(
      poem.progress,
    );

  const id =
    asString(
      poem.id ??
      poem.poemId,
    ) ??
    `remote-poem-${index}`;

  const text =
    asString(
      poem.text ??
      poem.content ??
      poem.poemText,
    ) ??
    "";

  const lines =
    text
      .split(
        /\r?\n/,
      )
      .filter(
        (
          line,
        ) =>
          line.trim()
            .length >
          0,
      );

  const currentLineIndex =
    Math.max(
      0,
      Math.floor(
        asNumber(
          progress?.currentLineIndex ??
          poem.currentLineIndex ??
          poem.lastLineIndex,
        ) ??
        0,
      ),
    );

  const progressPercentage =
    Math.max(
      0,
      Math.min(
        100,
        asNumber(
          progress?.percentage ??
          poem.progressPercentage ??
          poem.percentage,
        ) ??
        (
          lines.length > 0
            ? Math.round(
                (
                  Math.min(
                    currentLineIndex +
                      1,
                    lines.length,
                  ) /
                  lines.length
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
        poem.title ??
        poem.name,
      ) ??
      "Untitled poem",

    text,

    author:
      asString(
        poem.author ??
        poem.poet,
      ),

    language:
      asString(
        poem.language ??
        poem.locale,
      ),

    lineCount:
      Math.max(
        0,
        Math.floor(
          asNumber(
            poem.lineCount,
          ) ??
          lines.length,
        ),
      ),

    readerMode:
      normalizeReaderMode(
        progress?.readerMode ??
        poem.readerMode,
      ),

    currentLineIndex,

    progressPercentage,

    createdAt:
      asString(
        poem.createdAt,
      ),

    updatedAt:
      asString(
        poem.updatedAt,
      ),

    lastReadAt:
      asString(
        progress?.lastReadAt ??
        poem.lastReadAt,
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
    root.poems,
    root.results,
    data?.items,
    data?.poems,
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

export function normalizePoemPage(
  raw: unknown,
  requestedPage: number,
  requestedPageSize: number,
): PoemPage {
  const items =
    resolveList(
      raw,
    ).map(
      (
        item,
        index,
      ) =>
        normalizeRemotePoem(
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