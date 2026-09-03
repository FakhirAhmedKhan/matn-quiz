export type QuizFlowMethod = "HIDE_WORDS" | "HIDE_LINES";

export type QuizFlowGeneratedQuiz = Record<string, unknown>;

export interface QuizFlowDraft {
  quranText: string;
  method: QuizFlowMethod;
  hideCount: number;
  generatedQuiz: QuizFlowGeneratedQuiz | null;
  updatedAt: string;
}

export const QUIZ_FLOW_STORAGE_KEY = "matn-quiz:quiz-flow-draft";

export const DEFAULT_QUIZ_FLOW_DRAFT: QuizFlowDraft = {
  quranText: "",
  method: "HIDE_WORDS",
  hideCount: 1,
  generatedQuiz: null,
  updatedAt: "",
};

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function normalizeDraft(value: Partial<QuizFlowDraft> | null | undefined): QuizFlowDraft {
  const method =
    value?.method === "HIDE_LINES" || value?.method === "HIDE_WORDS"
      ? value.method
      : DEFAULT_QUIZ_FLOW_DRAFT.method;

  const parsedHideCount = Number(value?.hideCount);
  const hideCount =
    Number.isFinite(parsedHideCount) && parsedHideCount > 0
      ? Math.floor(parsedHideCount)
      : DEFAULT_QUIZ_FLOW_DRAFT.hideCount;

  return {
    quranText: typeof value?.quranText === "string" ? value.quranText : "",
    method,
    hideCount,
    generatedQuiz:
      value?.generatedQuiz && typeof value.generatedQuiz === "object"
        ? value.generatedQuiz
        : null,
    updatedAt:
      typeof value?.updatedAt === "string" && value.updatedAt.length > 0
        ? value.updatedAt
        : new Date(0).toISOString(),
  };
}

export function createQuizFlowDraft(
  value: Partial<QuizFlowDraft> = {},
): QuizFlowDraft {
  return normalizeDraft({
    ...DEFAULT_QUIZ_FLOW_DRAFT,
    ...value,
    updatedAt: value.updatedAt ?? new Date().toISOString(),
  });
}

export function loadQuizFlowDraft(): QuizFlowDraft {
  if (!canUseBrowserStorage()) {
    return createQuizFlowDraft(DEFAULT_QUIZ_FLOW_DRAFT);
  }

  const raw = window.sessionStorage.getItem(QUIZ_FLOW_STORAGE_KEY);

  if (!raw) {
    return createQuizFlowDraft(DEFAULT_QUIZ_FLOW_DRAFT);
  }

  try {
    const parsed = JSON.parse(raw) as Partial<QuizFlowDraft>;
    return normalizeDraft(parsed);
  } catch {
    window.sessionStorage.removeItem(QUIZ_FLOW_STORAGE_KEY);
    return createQuizFlowDraft(DEFAULT_QUIZ_FLOW_DRAFT);
  }
}

export function saveQuizFlowDraft(draft: Partial<QuizFlowDraft>): QuizFlowDraft {
  const normalized = createQuizFlowDraft({
    ...loadQuizFlowDraft(),
    ...draft,
    updatedAt: new Date().toISOString(),
  });

  if (canUseBrowserStorage()) {
    window.sessionStorage.setItem(
      QUIZ_FLOW_STORAGE_KEY,
      JSON.stringify(normalized),
    );
  }

  return normalized;
}

export function updateQuizFlowText(quranText: string): QuizFlowDraft {
  return saveQuizFlowDraft({
    quranText,
    generatedQuiz: null,
  });
}

export function updateQuizFlowMethod(method: QuizFlowMethod): QuizFlowDraft {
  return saveQuizFlowDraft({
    method,
    generatedQuiz: null,
  });
}

export function updateQuizFlowHideCount(hideCount: number): QuizFlowDraft {
  return saveQuizFlowDraft({
    hideCount,
    generatedQuiz: null,
  });
}

export function saveQuizFlowGeneratedQuiz(
  generatedQuiz: QuizFlowGeneratedQuiz,
): QuizFlowDraft {
  return saveQuizFlowDraft({
    generatedQuiz,
  });
}

export function clearQuizFlowDraft(): QuizFlowDraft {
  if (canUseBrowserStorage()) {
    window.sessionStorage.removeItem(QUIZ_FLOW_STORAGE_KEY);
  }

  return createQuizFlowDraft(DEFAULT_QUIZ_FLOW_DRAFT);
}

export function hasQuizFlowText(draft: QuizFlowDraft): boolean {
  return draft.quranText.trim().length > 0;
}

export function hasGeneratedQuiz(draft: QuizFlowDraft): boolean {
  return draft.generatedQuiz !== null;
}