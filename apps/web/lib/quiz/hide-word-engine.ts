import {
  createTextTokens,
  rebuildTextFromTokens,
  type TextToken,
} from "@/lib/quiz/word-tokenizer";
import {
  getSelectedTokenIndexes,
  selectArabicWordsToHide,
  type RandomNumberGenerator,
} from "@/lib/quiz/word-selection";

export const HIDDEN_WORD_PLACEHOLDER = "____";

const ARABIC_WORD_CORE_REGEX =
  /[\u0610-\u061A\u0620-\u064A\u064B-\u065F\u0670\u0671-\u06D3\u06D5-\u06ED\u06FA-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/u;

export interface HideWordAnswer {
  index: number;
  wordIndex: number;
  tokenIndex: number;
  answer: string;
}

export interface HideWordQuizResult {
  originalText: string;
  quizText: string;
  method: "HIDE_WORD";
  requestedCount: number;
  hiddenCount: number;
  answers: HideWordAnswer[];
  selectedTokenIndexes: number[];
}

function isArabicWordCoreChar(value: string): boolean {
  return ARABIC_WORD_CORE_REGEX.test(value);
}

export function preserveEdgePunctuation(
  value: string,
  placeholder = HIDDEN_WORD_PLACEHOLDER,
): string {
  const chars = Array.from(value);

  const firstCoreIndex = chars.findIndex((char) =>
    isArabicWordCoreChar(char),
  );

  if (firstCoreIndex === -1) {
    return placeholder;
  }

  let lastCoreIndex = -1;

  for (let index = chars.length - 1; index >= firstCoreIndex; index -= 1) {
    const char = chars[index];

    if (typeof char === "string" && isArabicWordCoreChar(char)) {
      lastCoreIndex = index;
      break;
    }
  }

  if (lastCoreIndex === -1) {
    return placeholder;
  }

  const prefix = chars.slice(0, firstCoreIndex).join("");
  const suffix = chars.slice(lastCoreIndex + 1).join("");

  return `${prefix}${placeholder}${suffix}`;
}

export function createHiddenWordToken(
  token: TextToken,
  selectedTokenIndexes: number[],
  placeholder = HIDDEN_WORD_PLACEHOLDER,
): TextToken {
  if (!selectedTokenIndexes.includes(token.index)) {
    return token;
  }

  return {
    ...token,
    value: preserveEdgePunctuation(token.value, placeholder),
  };
}

export function generateHideWordQuiz(
  text: string,
  hideCount: number,
  random: RandomNumberGenerator = Math.random,
): HideWordQuizResult {
  const tokens = createTextTokens(text);
  const selection = selectArabicWordsToHide(text, hideCount, random);
  const selectedTokenIndexes = getSelectedTokenIndexes(selection.selectedWords);

  const quizTokens = tokens.map((token) =>
    createHiddenWordToken(token, selectedTokenIndexes),
  );

  const answers: HideWordAnswer[] = selection.selectedWords.map(
    (word, answerIndex) => ({
      index: answerIndex + 1,
      wordIndex: word.wordIndex,
      tokenIndex: word.tokenIndex,
      answer: word.value,
    }),
  );

  return {
    originalText: text,
    quizText: rebuildTextFromTokens(quizTokens),
    method: "HIDE_WORD",
    requestedCount: hideCount,
    hiddenCount: answers.length,
    answers,
    selectedTokenIndexes,
  };
}

export function hasHiddenWords(result: HideWordQuizResult): boolean {
  return result.hiddenCount > 0;
}
