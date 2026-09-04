$ErrorActionPreference = "Continue"

Write-Host "=== FIX QUIZ WIZARD STATE ACROSS SPLIT ROUTES ===" -ForegroundColor Cyan

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$ok = $true

function Write-NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [AllowEmptyString()]
        [Parameter(Mandatory = $true)][string]$Content
    )

    $fullPath = Join-Path (Get-Location) $Path
    $dir = Split-Path $fullPath -Parent

    if (!(Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }

    [System.IO.File]::WriteAllText(
        $fullPath,
        $Content,
        $utf8NoBom
    )
}

$usePageFile = "apps\web\hooks\usePage.ts"

if (!(Test-Path -LiteralPath $usePageFile)) {
    Write-Host "Missing: $usePageFile" -ForegroundColor Red
    Read-Host "Press Enter to close"
    return
}

$backup = "$usePageFile.quiz-wizard-backup"
Copy-Item -LiteralPath $usePageFile -Destination $backup -Force

Write-Host ""
Write-Host "Creating quiz workflow draft storage..." -ForegroundColor Yellow

Write-NoBom "apps\web\lib\quiz\quiz-workflow-draft.ts" @'
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
'@

Write-Host "Updating usePage so every split route restores the same draft..." -ForegroundColor Yellow

Write-NoBom $usePageFile @'
"use client";

import {
  DEFAULT_QUIZ_METHOD,
  HIDE_COUNT_DEFAULT,
  QUIZ_METHOD_OPTIONS,
} from "@/lib/constants/quiz";
import { safeGenerateQuiz } from "@/lib/quiz/generate-quiz";
import {
  isValidHideCount,
  normalizeHideCount,
} from "@/lib/quiz/hide-count";
import type {
  SavedQuizRecord,
} from "@/lib/quiz/quiz-history";
import {
  clearQuizHistoryStorage,
  deleteSavedQuizFromHistory,
  loadSavedQuizHistory,
  saveQuizToHistory,
} from "@/lib/quiz/quiz-history-repository";
import {
  loadQuizWorkflowDraft,
  saveQuizWorkflowDraft,
} from "@/lib/quiz/quiz-workflow-draft";
import type {
  QuizReviewState,
} from "@/lib/quiz/review-session";
import type {
  ShareableQuizDocument,
} from "@/lib/quiz/shareable-quiz";
import type {
  QuizStudyState,
} from "@/lib/quiz/study-session";
import type {
  PersistedStudySessionDocument,
} from "@/lib/quiz/study-session-persistence";
import {
  clearPersistedStudySession,
  loadPersistedStudySession,
} from "@/lib/quiz/study-session-repository";
import {
  getQuranTextInputError,
  validateQuranTextInput,
} from "@/lib/quiz/validation";
import {
  getArabicTextStats,
} from "@/lib/utils/arabic";
import type {
  GeneratedQuiz,
  QuizMethod,
} from "@/types/quiz";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

const usePage = () => {
  const [quranText, setQuranText] =
    useState("");
  const [quizMethod, setQuizMethod] =
    useState<QuizMethod>(
      DEFAULT_QUIZ_METHOD,
    );
  const [hideCount, setHideCount] =
    useState(HIDE_COUNT_DEFAULT);
  const [
    generatedQuiz,
    setGeneratedQuiz,
  ] =
    useState<GeneratedQuiz | null>(
      null,
    );
  const [
    savedQuizzes,
    setSavedQuizzes,
  ] =
    useState<SavedQuizRecord[]>([]);
  const [
    persistedStudySession,
    setPersistedStudySession,
  ] =
    useState<PersistedStudySessionDocument | null>(
      null,
    );
  const [
    resumeStudyState,
    setResumeStudyState,
  ] =
    useState<QuizStudyState | undefined>();
  const [
    resumeReviewState,
    setResumeReviewState,
  ] =
    useState<QuizReviewState | undefined>();
  const [
    resumeSessionId,
    setResumeSessionId,
  ] =
    useState<string | undefined>();
  const [
    generateError,
    setGenerateError,
  ] =
    useState<string | undefined>();
  const [
    historyStatus,
    setHistoryStatus,
  ] =
    useState<string | undefined>();
  const [
    workflowHydrated,
    setWorkflowHydrated,
  ] = useState(false);

  const stats = useMemo(
    () => getArabicTextStats(quranText),
    [quranText],
  );

  const validation = useMemo(
    () =>
      validateQuranTextInput(
        quranText,
      ),
    [quranText],
  );

  const hideCountValid = useMemo(
    () =>
      isValidHideCount(
        hideCount,
        quranText,
        quizMethod,
      ),
    [
      hideCount,
      quranText,
      quizMethod,
    ],
  );

  const selectedMethod =
    QUIZ_METHOD_OPTIONS.find(
      (method) =>
        method.value ===
        quizMethod,
    );

  const error =
    quranText.trim().length > 0
      ? getQuranTextInputError(
          quranText,
        )
      : undefined;

  const canGenerate =
    validation.valid &&
    hideCountValid;

  const refreshSavedQuizzes =
    () => {
      setSavedQuizzes(
        loadSavedQuizHistory(),
      );
    };

  const refreshPersistedStudySession =
    () => {
      setPersistedStudySession(
        loadPersistedStudySession(),
      );
    };

  useEffect(() => {
    const draft =
      loadQuizWorkflowDraft();

    if (draft) {
      setQuranText(
        draft.quranText,
      );
      setQuizMethod(
        draft.quizMethod,
      );
      setHideCount(
        normalizeHideCount(
          draft.hideCount,
          draft.quranText,
          draft.quizMethod,
        ),
      );
      setGeneratedQuiz(
        draft.generatedQuiz,
      );
    }

    refreshSavedQuizzes();
    refreshPersistedStudySession();

    setWorkflowHydrated(true);
  }, []);

  useEffect(() => {
    if (!workflowHydrated) {
      return;
    }

    saveQuizWorkflowDraft({
      quranText,
      quizMethod,
      hideCount,
      generatedQuiz,
    });
  }, [
    workflowHydrated,
    quranText,
    quizMethod,
    hideCount,
    generatedQuiz,
  ]);

  useEffect(() => {
    setHideCount(
      (current) =>
        normalizeHideCount(
          current,
          quranText,
          quizMethod,
        ),
    );
  }, [
    quranText,
    quizMethod,
  ]);

  const clearResumeState = () => {
    setResumeStudyState(
      undefined,
    );
    setResumeReviewState(
      undefined,
    );
    setResumeSessionId(
      undefined,
    );
  };

  const handleTextChange = (
    value: string,
  ) => {
    setQuranText(value);
    setGeneratedQuiz(null);
    setGenerateError(
      undefined,
    );
    setHistoryStatus(
      undefined,
    );
    clearResumeState();
  };

  const handleMethodChange = (
    value: QuizMethod,
  ) => {
    setQuizMethod(value);
    setGeneratedQuiz(null);
    setGenerateError(
      undefined,
    );
    setHistoryStatus(
      undefined,
    );
    clearResumeState();
  };

  const handleHideCountChange = (
    value: number,
  ) => {
    setHideCount(
      normalizeHideCount(
        value,
        quranText,
        quizMethod,
      ),
    );
    setGeneratedQuiz(null);
    setGenerateError(
      undefined,
    );
    setHistoryStatus(
      undefined,
    );
    clearResumeState();
  };

  const handleGenerate = () => {
    const result =
      safeGenerateQuiz({
        text: quranText,
        method:
          quizMethod,
        hideCount,
      });

    if (!result.ok) {
      setGeneratedQuiz(
        null,
      );
      setGenerateError(
        result.errors[0]
          ?.message ??
          "Unable to generate quiz.",
      );
      return;
    }

    setGeneratedQuiz(
      result.quiz,
    );
    setGenerateError(
      undefined,
    );
    setHistoryStatus(
      undefined,
    );
    setPersistedStudySession(
      null,
    );
    clearResumeState();

    saveQuizWorkflowDraft({
      quranText,
      quizMethod,
      hideCount,
      generatedQuiz:
        result.quiz,
    });
  };

  const handleSaveQuiz = () => {
    if (!generatedQuiz) {
      setHistoryStatus(
        "Generate a quiz before saving.",
      );
      return;
    }

    const saved =
      saveQuizToHistory(
        generatedQuiz,
      );

    if (!saved) {
      setHistoryStatus(
        "Unable to save quiz in this browser.",
      );
      return;
    }

    refreshSavedQuizzes();
    setHistoryStatus(
      "Quiz saved to history.",
    );
  };

  const openQuizPayload = (
    quiz: GeneratedQuiz,
    statusMessage: string,
  ) => {
    const nextHideCount =
      normalizeHideCount(
        quiz.requestedCount,
        quiz.originalText,
        quiz.method,
      );

    setQuranText(
      quiz.originalText,
    );
    setQuizMethod(
      quiz.method,
    );
    setHideCount(
      nextHideCount,
    );
    setGeneratedQuiz(
      quiz,
    );
    setGenerateError(
      undefined,
    );
    setHistoryStatus(
      statusMessage,
    );

    saveQuizWorkflowDraft({
      quranText:
        quiz.originalText,
      quizMethod:
        quiz.method,
      hideCount:
        nextHideCount,
      generatedQuiz:
        quiz,
    });
  };

  const handleOpenSavedQuiz = (
    record: SavedQuizRecord,
  ) => {
    clearResumeState();
    openQuizPayload(
      record.quiz,
      "Saved quiz opened.",
    );
  };

  const handleImportShareableQuiz = (
    quiz: GeneratedQuiz,
    _document: ShareableQuizDocument,
  ) => {
    void _document;

    clearResumeState();
    openQuizPayload(
      quiz,
      "Imported quiz opened.",
    );
  };

  const handleResumeStudySession = (
    document: PersistedStudySessionDocument,
  ) => {
    const quiz =
      document.studyState.quiz;

    setResumeStudyState(
      document.studyState,
    );
    setResumeReviewState(
      document.reviewState,
    );
    setResumeSessionId(
      document.sessionId,
    );
    openQuizPayload(
      quiz,
      "Study session resumed.",
    );
  };

  const handleClearStudySession =
    () => {
      const cleared =
        clearPersistedStudySession();

      if (!cleared) {
        setHistoryStatus(
          "Unable to clear study session.",
        );
        return;
      }

      setPersistedStudySession(
        null,
      );
      clearResumeState();
      setHistoryStatus(
        "Study session cleared.",
      );
    };

  const handleDeleteSavedQuiz = (
    id: string,
  ) => {
    const deleted =
      deleteSavedQuizFromHistory(
        id,
      );

    if (!deleted) {
      setHistoryStatus(
        "Unable to delete saved quiz.",
      );
      return;
    }

    refreshSavedQuizzes();
    setHistoryStatus(
      "Saved quiz deleted.",
    );
  };

  const handleClearHistory = () => {
    const cleared =
      clearQuizHistoryStorage();

    if (!cleared) {
      setHistoryStatus(
        "Unable to clear saved history.",
      );
      return;
    }

    setSavedQuizzes([]);
    setHistoryStatus(
      "Saved history cleared.",
    );
  };

  return {
    handleTextChange,
    handleMethodChange,
    handleHideCountChange,
    handleGenerate,
    handleSaveQuiz,
    handleOpenSavedQuiz,
    handleImportShareableQuiz,
    handleResumeStudySession,
    handleClearStudySession,
    handleDeleteSavedQuiz,
    handleClearHistory,
    setPersistedStudySession,
    setGeneratedQuiz,
    setResumeStudyState,
    setResumeReviewState,
    setResumeSessionId,
    clearResumeState,
    quranText,
    quizMethod,
    hideCount,
    generatedQuiz,
    savedQuizzes,
    persistedStudySession,
    resumeStudyState,
    resumeReviewState,
    resumeSessionId,
    generateError,
    historyStatus,
    stats,
    validation,
    hideCountValid,
    selectedMethod,
    error,
    canGenerate,
  };
};

export default usePage;
'@

Write-Host "Creating workflow persistence regression tests..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\quiz\quiz-workflow-draft.test.ts" @'
import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  clearQuizWorkflowDraft,
  createDefaultQuizWorkflowDraft,
  loadQuizWorkflowDraft,
  QUIZ_WORKFLOW_DRAFT_STORAGE_KEY,
  saveQuizWorkflowDraft,
} from "@/lib/quiz/quiz-workflow-draft";

describe("quiz workflow draft storage", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("returns null when no draft exists", () => {
    expect(
      loadQuizWorkflowDraft(),
    ).toBeNull();
  });

  it("persists text, method, and hide count between page instances", () => {
    expect(
      saveQuizWorkflowDraft({
        quranText:
          "السلام عليكم ورحمة الله",
        quizMethod:
          "HIDE_LINE",
        hideCount: 1,
        generatedQuiz: null,
      }),
    ).toBe(true);

    expect(
      loadQuizWorkflowDraft(),
    ).toEqual({
      version: 1,
      quranText:
        "السلام عليكم ورحمة الله",
      quizMethod:
        "HIDE_LINE",
      hideCount: 1,
      generatedQuiz: null,
    });
  });

  it("rejects malformed stored data", () => {
    window.sessionStorage.setItem(
      QUIZ_WORKFLOW_DRAFT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        quranText: 123,
      }),
    );

    expect(
      loadQuizWorkflowDraft(),
    ).toBeNull();
  });

  it("clears the draft", () => {
    const draft =
      createDefaultQuizWorkflowDraft();

    saveQuizWorkflowDraft({
      quranText:
        draft.quranText,
      quizMethod:
        draft.quizMethod,
      hideCount:
        draft.hideCount,
      generatedQuiz:
        draft.generatedQuiz,
    });

    expect(
      clearQuizWorkflowDraft(),
    ).toBe(true);

    expect(
      loadQuizWorkflowDraft(),
    ).toBeNull();
  });
});
'@

if ($ok) {
    Write-Host ""
    Write-Host "Running focused workflow tests..." -ForegroundColor Cyan

    pnpm --filter "@matn-quiz/web" exec vitest run `
      tests/unit/quiz/quiz-workflow-draft.test.ts `
      tests/unit/quiz/hide-count.test.ts `
      tests/unit/quiz/generate-quiz.test.ts `
      --testTimeout=20000

    if ($LASTEXITCODE -ne 0) {
        $ok = $false
        Write-Host "Focused tests FAILED." -ForegroundColor Red
    }
}

if ($ok) {
    Write-Host ""
    Write-Host "Running production build..." -ForegroundColor Cyan

    pnpm --filter "@matn-quiz/web" build

    if ($LASTEXITCODE -ne 0) {
        $ok = $false
        Write-Host "Production build FAILED." -ForegroundColor Red
    }
}

if ($ok) {
    Remove-Item -LiteralPath $backup -Force -ErrorAction SilentlyContinue

    Write-Host ""
    Write-Host "=== QUIZ WIZARD STATE FIX PASSED ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Expected flow:" -ForegroundColor Cyan
    Write-Host "/create -> enter Arabic text"
    Write-Host "/create/method -> text is restored"
    Write-Host "/create/count -> text + method + count are restored"
    Write-Host "Generate Quiz -> generated quiz is saved in sessionStorage"
    Write-Host "/study -> generated quiz is restored"
    Write-Host "Browser refresh -> current wizard draft survives"

    git add `
      apps/web/hooks/usePage.ts `
      apps/web/lib/quiz/quiz-workflow-draft.ts `
      apps/web/tests/unit/quiz/quiz-workflow-draft.test.ts

    $pending = git status --porcelain

    if ($pending) {
        git commit -m "fix(web): persist quiz wizard state across routes"
    }
}
else {
    Write-Host ""
    Write-Host "Verification failed. Restoring usePage..." -ForegroundColor Yellow

    if (Test-Path -LiteralPath $backup) {
        Copy-Item -LiteralPath $backup -Destination $usePageFile -Force
        Remove-Item -LiteralPath $backup -Force -ErrorAction SilentlyContinue
    }

    Remove-Item -LiteralPath "apps\web\lib\quiz\quiz-workflow-draft.ts" -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath "apps\web\tests\unit\quiz\quiz-workflow-draft.test.ts" -Force -ErrorAction SilentlyContinue

    Write-Host "Source restored. Send me the failed output." -ForegroundColor Red
}

Read-Host "Press Enter to close"
