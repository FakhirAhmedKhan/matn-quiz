import {
  createLineTokens,
  rebuildTextFromLineTokens,
  type LineToken,
} from "@/lib/quiz/line-tokenizer";
import {
  getSelectedLineIndexes,
  getSelectedLineTokenIndexes,
  selectLinesToHide,
  type RandomNumberGenerator,
} from "@/lib/quiz/line-selection";

export const HIDDEN_LINE_PLACEHOLDER = "____";

export interface HideLineAnswer {
  index: number;
  lineIndex: number;
  tokenIndex: number;
  answer: string;
}

export interface HideLineQuizResult {
  originalText: string;
  quizText: string;
  method: "HIDE_LINE";
  requestedCount: number;
  hiddenCount: number;
  answers: HideLineAnswer[];
  selectedTokenIndexes: number[];
  selectedLineIndexes: number[];
}

export function createHiddenLineToken(
  token: LineToken,
  selectedTokenIndexes: number[],
  placeholder = HIDDEN_LINE_PLACEHOLDER,
): LineToken {
  if (token.type !== "line") {
    return token;
  }

  if (!token.isHideable) {
    return token;
  }

  if (!selectedTokenIndexes.includes(token.index)) {
    return token;
  }

  return {
    ...token,
    value: placeholder,
  };
}

export function generateHideLineQuiz(
  text: string,
  hideCount: number,
  random: RandomNumberGenerator = Math.random,
): HideLineQuizResult {
  const tokens = createLineTokens(text);
  const selection = selectLinesToHide(text, hideCount, random);

  const selectedTokenIndexes = getSelectedLineTokenIndexes(
    selection.selectedLines,
  );

  const selectedLineIndexes = getSelectedLineIndexes(selection.selectedLines);

  const quizTokens = tokens.map((token) =>
    createHiddenLineToken(token, selectedTokenIndexes),
  );

  const answers: HideLineAnswer[] = selection.selectedLines.map(
    (line, answerIndex) => ({
      index: answerIndex + 1,
      lineIndex: line.lineIndex,
      tokenIndex: line.tokenIndex,
      answer: line.value,
    }),
  );

  return {
    originalText: text,
    quizText: rebuildTextFromLineTokens(quizTokens),
    method: "HIDE_LINE",
    requestedCount: hideCount,
    hiddenCount: answers.length,
    answers,
    selectedTokenIndexes,
    selectedLineIndexes,
  };
}

export function hasHiddenLines(result: HideLineQuizResult): boolean {
  return result.hiddenCount > 0;
}
