import type {
  GeneratedQuiz,
  QuizMethod,
} from "@/types/quiz";
import {
  DEFAULT_QUIZ_METHOD,
  HIDE_COUNT_DEFAULT,
  QUIZ_METHODS,
} from "@/lib/constants/quiz";
import { isGeneratedQuiz } from "@/lib/quiz/quiz-history";

export const QUIZ_WORKFLOW_DRAFT_VERSION = 1;
export const QUIZ_WORKFLOW_DRAFT_STORAGE_KEY =
  "matn-quiz:quiz-workflow-draft:v1";

export interface QuizWorkflowDraft {
  version: typeof QUIZ_WORKFLOW_DRAFT_VERSION;
  quranText: string;
  quizMethod: QuizMethod;
  hideCount: number;
  generatedQuiz: GeneratedQuiz | null;
}

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isQuizMethod(
  value: unknown,
): value is QuizMethod {
  return (
    value === QUIZ_METHODS.HIDE_WORD ||
    value === QUIZ_METHODS.HIDE_LINE
  );
}

export function createDefaultQuizWorkflowDraft(): QuizWorkflowDraft {
  return {
    version: QUIZ_WORKFLOW_DRAFT_VERSION,
    quranText: "",
    quizMethod: DEFAULT_QUIZ_METHOD,
    hideCount: HIDE_COUNT_DEFAULT,
    generatedQuiz: null,
  };
}

export function isQuizWorkflowDraft(
  value: unknown,
): value is QuizWorkflowDraft {
  if (!isObject(value)) {
    return false;
  }

  const generatedQuiz =
    value.generatedQuiz;

  return (
    value.version ===
      QUIZ_WORKFLOW_DRAFT_VERSION &&
    typeof value.quranText === "string" &&
    isQuizMethod(value.quizMethod) &&
    typeof value.hideCount === "number" &&
    Number.isFinite(value.hideCount) &&
    value.hideCount >= 0 &&
    (generatedQuiz === null ||
      isGeneratedQuiz(generatedQuiz))
  );
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function loadQuizWorkflowDraft(): QuizWorkflowDraft | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(
      QUIZ_WORKFLOW_DRAFT_STORAGE_KEY,
    );

    if (!raw) {
      return null;
    }

    const parsed: unknown =
      JSON.parse(raw);

    return isQuizWorkflowDraft(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function saveQuizWorkflowDraft(
  draft: Omit<
    QuizWorkflowDraft,
    "version"
  >,
): boolean {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  const document: QuizWorkflowDraft = {
    version:
      QUIZ_WORKFLOW_DRAFT_VERSION,
    ...draft,
  };

  try {
    storage.setItem(
      QUIZ_WORKFLOW_DRAFT_STORAGE_KEY,
      JSON.stringify(document),
    );

    return true;
  } catch {
    return false;
  }
}

export function clearQuizWorkflowDraft(): boolean {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(
      QUIZ_WORKFLOW_DRAFT_STORAGE_KEY,
    );

    return true;
  } catch {
    return false;
  }
}