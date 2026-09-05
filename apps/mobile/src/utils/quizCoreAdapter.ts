import {
  generateQuiz as generateCoreQuiz,
  type QuizRandomNumberGenerator,
} from "@matn-quiz/quiz-core/generate-quiz";

import {
  createTextTokens,
} from "@matn-quiz/quiz-core/word-tokenizer";

import {
  createLineTokens,
} from "@matn-quiz/quiz-core/line-tokenizer";

import type {
  GeneratedQuiz,
  GeneratedQuizItem,
  QuizMethod,
} from "../types/quiz";

export type GenerateMobileQuizOptions = {
  random?: QuizRandomNumberGenerator;
  now?: Date;
};

function normalizeMobileQuizText(
  text: string,
): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function countLineBreaks(
  value: string,
): number {
  return (
    value.match(/\n/gu)?.length ??
    0
  );
}

function buildMobileWordItems(
  originalText: string,
  selectedTokenIndexes: number[],
): GeneratedQuizItem[] {
  const selected =
    new Set(
      selectedTokenIndexes,
    );

  const tokens =
    createTextTokens(
      originalText,
    );

  const items:
    GeneratedQuizItem[] = [];

  let lineIndex = 0;
  let position = 0;

  for (
    const token of tokens
  ) {
    if (
      token.type ===
      "whitespace"
    ) {
      lineIndex +=
        countLineBreaks(
          token.value,
        );

      continue;
    }

    items.push({
      id:
        `word-${position}`,

      kind:
        "word",

      text:
        token.value,

      hidden:
        selected.has(
          token.index,
        ),

      lineIndex,

      position,
    });

    position += 1;
  }

  return items;
}

function buildMobileLineItems(
  originalText: string,
  selectedLineIndexes: number[],
): GeneratedQuizItem[] {
  const selected =
    new Set(
      selectedLineIndexes,
    );

  return createLineTokens(
    originalText,
  )
    .filter(
      (token) =>
        token.type ===
          "line" &&
        token.isHideable,
    )
    .map(
      (
        token,
        position,
      ) => ({
        id:
          `line-${position}`,

        kind:
          "line" as const,

        text:
          token.value.trim(),

        hidden:
          selected.has(
            token.lineIndex,
          ),

        lineIndex:
          token.lineIndex,

        position,
      }),
    );
}

export function generateMobileQuizFromCore(
  text: string,
  method: QuizMethod,
  requestedCount: number,
  options: GenerateMobileQuizOptions = {},
): GeneratedQuiz | null {
  const originalText =
    normalizeMobileQuizText(
      text,
    );

  if (!originalText) {
    return null;
  }

  const coreQuiz =
    generateCoreQuiz(
      {
        text:
          originalText,

        method,

        hideCount:
          requestedCount,
      },
      options.random ??
        Math.random,
    );

  const items =
    coreQuiz.method ===
    "HIDE_WORD"
      ? buildMobileWordItems(
          coreQuiz.originalText,
          coreQuiz.selectedTokenIndexes,
        )
      : buildMobileLineItems(
          coreQuiz.originalText,
          coreQuiz.selectedLineIndexes,
        );

  if (
    items.length === 0
  ) {
    return null;
  }

  const hiddenCount =
    items.filter(
      (item) =>
        item.hidden,
    ).length;

  const now =
    options.now ??
    new Date();

  return {
    id:
      `demo-${now.getTime()}`,

    originalText:
      coreQuiz.originalText,

    method:
      coreQuiz.method,

    requestedCount:
      coreQuiz.requestedCount,

    hiddenCount,

    items,

    createdAt:
      now.toISOString(),
  };
}
