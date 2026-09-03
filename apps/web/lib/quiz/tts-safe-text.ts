import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
  GeneratedQuiz,
} from "@/types/quiz";
import { QUIZ_METHODS } from "@/lib/constants/quiz";
import { normalizeLineEndings } from "@/lib/utils/arabic";

export interface TtsTextToken {
  index: number;
  value: string;
  type: "word" | "whitespace" | "text";
  hidden: boolean;
}

export interface TtsLineOption {
  tokenIndex: number;
  lineNumber: number;
  text: string;
  hidden: boolean;
  speakableText: string;
}

export interface BuildSpeakableTextFromQuizOptions {
  quiz: GeneratedQuiz;
  lineTokenIndex?: number;
}

const WHITESPACE_REGEX = /^\s+$/u;

function splitTextPreservingWhitespace(text: string): string[] {
  return text.split(/(\s+)/u).filter((part) => part.length > 0);
}

export function normalizeSpeakableArabicText(value: string): string {
  return normalizeLineEndings(value)
    .split("\n")
    .map((line) => line.replace(/[ \t\f\v]+/gu, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .trim();
}

export function getHiddenAnswerValues(quiz: GeneratedQuiz): string[] {
  return quiz.answers
    .map((answer) => answer.answer.trim())
    .filter((answer) => answer.length > 0);
}

export function containsHiddenAnswerText(
  speakableText: string,
  hiddenAnswers: string[],
): boolean {
  const normalizedText = normalizeSpeakableArabicText(speakableText);

  return hiddenAnswers.some((answer) => {
    const normalizedAnswer = normalizeSpeakableArabicText(answer);

    return (
      normalizedAnswer.length > 0 && normalizedText.includes(normalizedAnswer)
    );
  });
}

export function buildTtsWordTokens(quiz: GeneratedHideWordQuiz): TtsTextToken[] {
  const hiddenTokenIndexes = new Set(quiz.selectedTokenIndexes);

  return splitTextPreservingWhitespace(quiz.originalText).map(
    (value, index): TtsTextToken => {
      const isWhitespace = WHITESPACE_REGEX.test(value);

      return {
        index,
        value,
        type: isWhitespace ? "whitespace" : "word",
        hidden: hiddenTokenIndexes.has(index),
      };
    },
  );
}

export function buildSpeakableTextForVisibleWords(
  quiz: GeneratedHideWordQuiz,
): string {
  const visibleText = buildTtsWordTokens(quiz)
    .filter((token) => !token.hidden)
    .map((token) => token.value)
    .join("");

  const speakableText = normalizeSpeakableArabicText(visibleText);

  if (containsHiddenAnswerText(speakableText, getHiddenAnswerValues(quiz))) {
    return "";
  }

  return speakableText;
}

export function buildTtsLineOptions(quiz: GeneratedHideLineQuiz): TtsLineOption[] {
  // HIDE_LINE uses token indexes from the newline-preserving tokenizer:
  // line 1 = 0, line 2 = 2, line 3 = 4, ...
  //
  // Keep that existing contract. As a safety fallback, also trust the
  // tokenIndex stored on hidden-answer records and selectedTokenIndexes.
  const hiddenTokenIndexes = new Set<number>([
    ...quiz.selectedLineIndexes,
    ...quiz.selectedTokenIndexes,
    ...quiz.answers
      .filter((answer) => answer.kind === "line")
      .map((answer) => answer.tokenIndex),
  ]);

  const parts = normalizeLineEndings(quiz.originalText).split(/(\n)/u);
  let lineNumber = 0;

  return parts
    .map((part, tokenIndex): TtsLineOption | null => {
      if (part === "\n" || part.trim().length === 0) {
        return null;
      }

      lineNumber += 1;

      const hidden = hiddenTokenIndexes.has(tokenIndex);
      const speakableText = hidden ? "" : normalizeSpeakableArabicText(part);

      return {
        tokenIndex,
        lineNumber,
        text: part,
        hidden,
        speakableText,
      };
    })
    .filter((line): line is TtsLineOption => line !== null);
}

export function buildSpeakableTextForVisibleLine(
  quiz: GeneratedHideLineQuiz,
  lineTokenIndex: number,
): string {
  const line = buildTtsLineOptions(quiz).find(
    (item) => item.tokenIndex === lineTokenIndex,
  );

  if (!line || line.hidden) {
    return "";
  }

  const speakableText = normalizeSpeakableArabicText(line.speakableText);

  if (containsHiddenAnswerText(speakableText, getHiddenAnswerValues(quiz))) {
    return "";
  }

  return speakableText;
}

export function getFirstVisibleSpeakableLine(
  quiz: GeneratedHideLineQuiz,
): string {
  const firstVisibleLine = buildTtsLineOptions(quiz).find(
    (line) => !line.hidden && line.speakableText.trim().length > 0,
  );

  return firstVisibleLine?.speakableText ?? "";
}

export function buildSpeakableTextFromQuiz({
  quiz,
  lineTokenIndex,
}: BuildSpeakableTextFromQuizOptions): string {
  if (quiz.method === QUIZ_METHODS.HIDE_WORD) {
    return buildSpeakableTextForVisibleWords(quiz);
  }

  if (typeof lineTokenIndex === "number") {
    return buildSpeakableTextForVisibleLine(quiz, lineTokenIndex);
  }

  return getFirstVisibleSpeakableLine(quiz);
}

export function assertSpeakableTextDoesNotLeakHiddenAnswers(
  quiz: GeneratedQuiz,
  speakableText: string,
): boolean {
  if (speakableText.includes("____")) {
    return false;
  }

  return !containsHiddenAnswerText(speakableText, getHiddenAnswerValues(quiz));
}

export function canSpeakQuizText(quiz: GeneratedQuiz): boolean {
  if (quiz.method === QUIZ_METHODS.HIDE_WORD) {
    return buildSpeakableTextForVisibleWords(quiz).trim().length > 0;
  }

  return buildTtsLineOptions(quiz).some(
    (line) => !line.hidden && line.speakableText.trim().length > 0,
  );
}