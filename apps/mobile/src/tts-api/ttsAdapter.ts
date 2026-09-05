import {
  useAudioStore,
} from "../store/audioStore";

import {
  usePoemStore,
} from "../store/poemStore";

import {
  useBookStore,
} from "../store/bookStore";

type UnknownRecord =
  Record<string, unknown>;

function firstString(
  value: unknown,
  keys: readonly string[],
): string | null {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return null;
  }

  const record =
    value as UnknownRecord;

  for (
    const key of keys
  ) {
    const candidate =
      record[key];

    if (
      typeof candidate ===
        "string" &&
      candidate.trim()
    ) {
      return candidate.trim();
    }
  }

  return null;
}

export function getCurrentLocalTtsText(): string {
  const audio =
    useAudioStore.getState() as unknown;

  const audioText =
    firstString(
      audio,
      [
        "text",
        "sourceText",
        "currentText",
        "content",
        "previewText",
      ],
    );

  if (audioText) {
    return audioText;
  }

  const poem =
    usePoemStore.getState() as unknown;

  const poemText =
    firstString(
      poem,
      [
        "text",
        "poemText",
        "content",
        "sourceText",
      ],
    );

  if (poemText) {
    return poemText;
  }

  const books =
    useBookStore.getState() as unknown;

  const bookText =
    firstString(
      books,
      [
        "text",
        "pageText",
        "currentPageText",
        "content",
      ],
    );

  return (
    bookText ??
    ""
  );
}