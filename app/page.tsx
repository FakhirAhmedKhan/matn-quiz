"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GeneratedQuizPreview,
  HideCountSelector,
  QuranTextInput,
  QuizMethodSelector,
  SavedQuizHistory,
  ShareableQuizPanel,
  StudySessionResumePanel,
} from "@/components/quiz";
import {
  AppContainer,
  AppHero,
  AppShell,
  ResponsiveCard,
  ResponsiveCardGrid,
  ResponsiveTwoColumnSection,
} from "@/components/layout";
import { Button, SectionTitle } from "@/components/ui";
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
import type { SavedQuizRecord } from "@/lib/quiz/quiz-history";
import {
  clearQuizHistoryStorage,
  deleteSavedQuizFromHistory,
  loadSavedQuizHistory,
  saveQuizToHistory,
} from "@/lib/quiz/quiz-history-repository";
import type { ShareableQuizDocument } from "@/lib/quiz/shareable-quiz";
import type {
  PersistedStudySessionDocument,
} from "@/lib/quiz/study-session-persistence";
import {
  clearPersistedStudySession,
  loadPersistedStudySession,
} from "@/lib/quiz/study-session-repository";
import type { QuizReviewState } from "@/lib/quiz/review-session";
import type { QuizStudyState } from "@/lib/quiz/study-session";
import {
  getQuranTextInputError,
  validateQuranTextInput,
} from "@/lib/quiz/validation";
import { getArabicTextStats } from "@/lib/utils/arabic";
import type { GeneratedQuiz, QuizMethod } from "@/types/quiz";

export default function HomePage() {
  const [quranText, setQuranText] = useState("");
  const [quizMethod, setQuizMethod] =
    useState<QuizMethod>(DEFAULT_QUIZ_METHOD);
  const [hideCount, setHideCount] = useState(HIDE_COUNT_DEFAULT);
  const [generatedQuiz, setGeneratedQuiz] =
    useState<GeneratedQuiz | null>(null);
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuizRecord[]>([]);
  const [persistedStudySession, setPersistedStudySession] =
    useState<PersistedStudySessionDocument | null>(null);
  const [resumeStudyState, setResumeStudyState] =
    useState<QuizStudyState | undefined>();
  const [resumeReviewState, setResumeReviewState] =
    useState<QuizReviewState | undefined>();
  const [resumeSessionId, setResumeSessionId] = useState<string | undefined>();
  const [generateError, setGenerateError] = useState<string | undefined>();
  const [historyStatus, setHistoryStatus] = useState<string | undefined>();

  const stats = useMemo(() => getArabicTextStats(quranText), [quranText]);

  const validation = useMemo(
    () => validateQuranTextInput(quranText),
    [quranText],
  );

  const hideCountValid = useMemo(
    () => isValidHideCount(hideCount, quranText, quizMethod),
    [hideCount, quranText, quizMethod],
  );

  const selectedMethod = QUIZ_METHOD_OPTIONS.find(
    (method) => method.value === quizMethod,
  );

  const error =
    quranText.trim().length > 0
      ? getQuranTextInputError(quranText)
      : undefined;

  const canGenerate = validation.valid && hideCountValid;

  const refreshSavedQuizzes = () => {
    setSavedQuizzes(loadSavedQuizHistory());
  };

  const refreshPersistedStudySession = () => {
    setPersistedStudySession(loadPersistedStudySession());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshSavedQuizzes();
    refreshPersistedStudySession();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHideCount((current) =>
      normalizeHideCount(current, quranText, quizMethod),
    );
  }, [quranText, quizMethod]);

  const clearResumeState = () => {
    setResumeStudyState(undefined);
    setResumeReviewState(undefined);
    setResumeSessionId(undefined);
  };

  const handleTextChange = (value: string) => {
    setQuranText(value);
    setGeneratedQuiz(null);
    setGenerateError(undefined);
    setHistoryStatus(undefined);
    clearResumeState();
  };

  const handleMethodChange = (value: QuizMethod) => {
    setQuizMethod(value);
    setGeneratedQuiz(null);
    setGenerateError(undefined);
    setHistoryStatus(undefined);
    clearResumeState();
  };

  const handleHideCountChange = (value: number) => {
    setHideCount(normalizeHideCount(value, quranText, quizMethod));
    setGeneratedQuiz(null);
    setGenerateError(undefined);
    setHistoryStatus(undefined);
    clearResumeState();
  };

  const handleGenerate = () => {
    const result = safeGenerateQuiz({
      text: quranText,
      method: quizMethod,
      hideCount,
    });

    if (!result.ok) {
      setGeneratedQuiz(null);
      setGenerateError(result.errors[0]?.message ?? "Unable to generate quiz.");
      return;
    }

    setGeneratedQuiz(result.quiz);
    setGenerateError(undefined);
    setHistoryStatus(undefined);
    setPersistedStudySession(null);
    clearResumeState();
  };

  const handleSaveQuiz = () => {
    if (!generatedQuiz) {
      setHistoryStatus("Generate a quiz before saving.");
      return;
    }

    const saved = saveQuizToHistory(generatedQuiz);

    if (!saved) {
      setHistoryStatus("Unable to save quiz in this browser.");
      return;
    }

    refreshSavedQuizzes();
    setHistoryStatus("Quiz saved to history.");
  };

  const openQuizPayload = (
    quiz: GeneratedQuiz,
    statusMessage: string,
  ) => {
    setQuranText(quiz.originalText);
    setQuizMethod(quiz.method);
    setHideCount(
      normalizeHideCount(quiz.requestedCount, quiz.originalText, quiz.method),
    );
    setGeneratedQuiz(quiz);
    setGenerateError(undefined);
    setHistoryStatus(statusMessage);
  };

  const handleOpenSavedQuiz = (record: SavedQuizRecord) => {
    clearResumeState();
    openQuizPayload(record.quiz, "Saved quiz opened.");
  };

  const handleImportShareableQuiz = (
    quiz: GeneratedQuiz,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _document: ShareableQuizDocument,
  ) => {
    clearResumeState();
    openQuizPayload(quiz, "Imported quiz opened.");
  };

  const handleResumeStudySession = (document: PersistedStudySessionDocument) => {
    const quiz = document.studyState.quiz;

    setResumeStudyState(document.studyState);
    setResumeReviewState(document.reviewState);
    setResumeSessionId(document.sessionId);
    openQuizPayload(quiz, "Study session resumed.");
  };

  const handleClearStudySession = () => {
    const cleared = clearPersistedStudySession();

    if (!cleared) {
      setHistoryStatus("Unable to clear study session.");
      return;
    }

    setPersistedStudySession(null);
    clearResumeState();
    setHistoryStatus("Study session cleared.");
  };

  const handleDeleteSavedQuiz = (id: string) => {
    const deleted = deleteSavedQuizFromHistory(id);

    if (!deleted) {
      setHistoryStatus("Unable to delete saved quiz.");
      return;
    }

    refreshSavedQuizzes();
    setHistoryStatus("Saved quiz deleted.");
  };

  const handleClearHistory = () => {
    const cleared = clearQuizHistoryStorage();

    if (!cleared) {
      setHistoryStatus("Unable to clear saved history.");
      return;
    }

    setSavedQuizzes([]);
    setHistoryStatus("Saved history cleared.");
  };

  return (
    <AppShell>
      <AppContainer>
        <AppHero
          eyebrow="Phase 17.5"
          title="Matn Quiz"
          description="A mobile-friendly Quran and matn quiz workspace for generating, reviewing, saving, importing, exporting, and resuming study sessions."
        />

        <ResponsiveCardGrid>
          <ResponsiveCard>
            <QuranTextInput
              value={quranText}
              onChange={handleTextChange}
              error={error}
            />
          </ResponsiveCard>

          <ResponsiveTwoColumnSection>
            <ResponsiveCard className="h-full">
              <QuizMethodSelector
                value={quizMethod}
                onChange={handleMethodChange}
              />
            </ResponsiveCard>

            <ResponsiveCard className="h-full">
              <HideCountSelector
                value={hideCount}
                text={quranText}
                method={quizMethod}
                onChange={handleHideCountChange}
              />
            </ResponsiveCard>
          </ResponsiveTwoColumnSection>

          <ResponsiveCard>
            <SectionTitle
              title="Quiz Setup Summary"
              description="These values are used by the unified quiz generator."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Arabic Words</p>
                <p
                  data-testid="arabic-word-count"
                  className="mt-2 text-3xl font-bold text-slate-950"
                >
                  {stats.arabicWords}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Valid Lines</p>
                <p
                  data-testid="valid-line-count"
                  className="mt-2 text-3xl font-bold text-slate-950"
                >
                  {stats.validLines}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Characters</p>
                <p
                  data-testid="character-count"
                  className="mt-2 text-3xl font-bold text-slate-950"
                >
                  {stats.characters}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Selected Method</p>
                <p
                  data-testid="selected-method"
                  className="mt-2 text-lg font-bold text-slate-950"
                >
                  {selectedMethod?.label}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Hide Count</p>
                <p
                  data-testid="selected-hide-count"
                  className="mt-2 text-3xl font-bold text-slate-950"
                >
                  {hideCount}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Status:{" "}
                <strong
                  className={
                    canGenerate
                      ? "text-emerald-700"
                      : "text-slate-500"
                  }
                >
                  {canGenerate
                    ? "Ready to generate"
                    : "Waiting for valid Arabic text and hide count"}
                </strong>
              </p>

              <Button
                type="button"
                disabled={!canGenerate}
                onClick={handleGenerate}
              >
                Continue
              </Button>
            </div>

            {generateError && (
              <p
                data-testid="generate-error"
                className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {generateError}
              </p>
            )}

            {historyStatus && (
              <p
                data-testid="history-status"
                role="status"
                aria-live="polite"
                className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                {historyStatus}
              </p>
            )}
          </ResponsiveCard>

          <ResponsiveCard>
            <StudySessionResumePanel
              document={persistedStudySession}
              onResume={handleResumeStudySession}
              onClear={handleClearStudySession}
            />
          </ResponsiveCard>

          {generatedQuiz && (
            <ResponsiveCard>
              <GeneratedQuizPreview
                quiz={generatedQuiz}
                onSaveQuiz={handleSaveQuiz}
                onResetQuiz={() => {
                  setGeneratedQuiz(null);
                  setPersistedStudySession(null);
                  clearResumeState();
                }}
                initialStudyState={resumeStudyState}
                initialReviewState={resumeReviewState}
                studySessionId={resumeSessionId}
              />
            </ResponsiveCard>
          )}

          <ResponsiveCard>
            <ShareableQuizPanel
              quiz={generatedQuiz}
              onImportQuiz={handleImportShareableQuiz}
            />
          </ResponsiveCard>

          <ResponsiveCard>
            <SavedQuizHistory
              items={savedQuizzes}
              onOpen={handleOpenSavedQuiz}
              onDelete={handleDeleteSavedQuiz}
              onClear={handleClearHistory}
            />
          </ResponsiveCard>
        </ResponsiveCardGrid>
      </AppContainer>
    </AppShell>
  );
}






