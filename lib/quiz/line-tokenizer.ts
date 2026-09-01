export interface LineToken {
  index: number;
  value: string;
  type: "line" | "newline";
  lineIndex: number;
  isHideable: boolean;
}

export interface HideableLineToken {
  tokenIndex: number;
  lineIndex: number;
  value: string;
}

/**
 * Split text while preserving original line endings.
 *
 * Important:
 * - Preserves \n
 * - Preserves \r\n
 * - Preserves \r
 * - Preserves blank lines
 * - Does not trim or normalize the original text
 */
export function splitTextPreservingLineEndings(text: string): string[] {
  if (text.length === 0) {
    return [];
  }

  return text.split(/(\r\n|\n|\r)/).filter((part) => part.length > 0);
}

export function createLineTokens(text: string): LineToken[] {
  const parts = splitTextPreservingLineEndings(text);
  const tokens: LineToken[] = [];

  let currentLineIndex = 0;

  parts.forEach((value, index) => {
    const isNewline = value === "\n" || value === "\r\n" || value === "\r";

    if (isNewline) {
      tokens.push({
        index,
        value,
        type: "newline",
        lineIndex: currentLineIndex,
        isHideable: false,
      });

      currentLineIndex += 1;
      return;
    }

    tokens.push({
      index,
      value,
      type: "line",
      lineIndex: currentLineIndex,
      isHideable: value.trim().length > 0,
    });
  });

  return tokens;
}

export function getHideableLineTokens(text: string): HideableLineToken[] {
  return createLineTokens(text)
    .filter((token) => token.type === "line" && token.isHideable)
    .map((token) => ({
      tokenIndex: token.index,
      lineIndex: token.lineIndex,
      value: token.value,
    }));
}

export function countHideableLines(text: string): number {
  return getHideableLineTokens(text).length;
}

export function rebuildTextFromLineTokens(tokens: LineToken[]): string {
  return tokens.map((token) => token.value).join("");
}
