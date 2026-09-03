import { containsArabicText } from "@/lib/utils/arabic";

export interface TextToken {
  index: number;
  value: string;
  type: "arabic-word" | "whitespace" | "text";
}

export interface ArabicWordToken {
  tokenIndex: number;
  wordIndex: number;
  value: string;
}

/**
 * Split text while preserving all whitespace tokens.
 *
 * Important:
 * - Do not use text.split(" ")
 * - Do not trim the full text
 * - Do not remove harakat
 * - Do not remove Quran symbols
 * - Do not remove newlines
 */
export function splitTextPreservingWhitespace(text: string): string[] {
  if (text.length === 0) {
    return [];
  }

  return text.split(/(\s+)/).filter((part) => part.length > 0);
}

export function createTextTokens(text: string): TextToken[] {
  const parts = splitTextPreservingWhitespace(text);

  return parts.map((value, index) => {
    if (/^\s+$/.test(value)) {
      return {
        index,
        value,
        type: "whitespace",
      };
    }

    if (containsArabicText(value)) {
      return {
        index,
        value,
        type: "arabic-word",
      };
    }

    return {
      index,
      value,
      type: "text",
    };
  });
}

export function getArabicWordTokens(text: string): ArabicWordToken[] {
  const tokens = createTextTokens(text);

  let wordIndex = 0;

  return tokens.flatMap((token) => {
    if (token.type !== "arabic-word") {
      return [];
    }

    const arabicWordToken: ArabicWordToken = {
      tokenIndex: token.index,
      wordIndex,
      value: token.value,
    };

    wordIndex += 1;

    return [arabicWordToken];
  });
}

export function countHideableArabicWords(text: string): number {
  return getArabicWordTokens(text).length;
}

export function rebuildTextFromTokens(tokens: TextToken[]): string {
  return tokens.map((token) => token.value).join("");
}
