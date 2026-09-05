import {
  usePoemStore,
} from "../store/poemStore";

import type {
  CreateRemotePoemInput,
  PoemReaderMode,
  SavePoemProgressInput,
} from "./types";

type UnknownState =
  Record<string, unknown>;

function readString(
  state: UnknownState,
  keys: readonly string[],
): string | null {
  for (
    const key of keys
  ) {
    const value =
      state[key];

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
  state: UnknownState,
  keys: readonly string[],
): number | null {
  for (
    const key of keys
  ) {
    const value =
      state[key];

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

export function createRemotePoemFromLocalStore(): CreateRemotePoemInput {
  const state =
    usePoemStore.getState() as unknown as UnknownState;

  const text =
    readString(
      state,
      [
        "text",
        "poemText",
        "content",
        "inputText",
        "sourceText",
      ],
    ) ??
    "";

  if (
    text.length <
    2
  ) {
    throw new Error(
      "Add poem text before uploading it to the cloud.",
    );
  }

  const title =
    readString(
      state,
      [
        "title",
        "poemTitle",
        "name",
      ],
    ) ??
    text
      .split(
        /\r?\n/,
      )[0]
      ?.slice(
        0,
        60,
      )
      .trim() ??
    "Untitled poem";

  const author =
    readString(
      state,
      [
        "author",
        "poet",
      ],
    );

  const language =
    readString(
      state,
      [
        "language",
        "locale",
      ],
    );

  return {
    title:
      title ||
      "Untitled poem",

    text,

    ...(author
      ? {
          author,
        }
      : {}),

    ...(language
      ? {
          language,
        }
      : {}),
  };
}

export function createPoemProgressFromLocalStore(
  lineCount: number,
): SavePoemProgressInput {
  const state =
    usePoemStore.getState() as unknown as UnknownState;

  const currentLineIndex =
    Math.max(
      0,
      Math.floor(
        readNumber(
          state,
          [
            "currentLineIndex",
            "activeLineIndex",
            "selectedLineIndex",
            "lineIndex",
          ],
        ) ??
        0,
      ),
    );

  const rawMode =
    readString(
      state,
      [
        "readerMode",
        "mode",
      ],
    );

  const readerMode:
    PoemReaderMode =
      rawMode ===
        "FOCUS"
        ? "FOCUS"
        : "ALL";

  const percentage =
    lineCount > 0
      ? Math.round(
          (
            Math.min(
              currentLineIndex +
                1,
              lineCount,
            ) /
            lineCount
          ) *
          100,
        )
      : 0;

  return {
    currentLineIndex,

    readerMode,

    progressPercentage:
      Math.max(
        0,
        Math.min(
          100,
          percentage,
        ),
      ),
  };
}