"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GeneratedQuizPreview,
  HideCountSelector,
  QuranTextInput,
  QuizMethodSelector,
  SavedQuizHistory,
  ShareableQuizPanel,
} from "@/components/quiz";
import {
  AppContainer,
  AppHero,
  AppShell,
  ResponsiveCard,
  ResponsiveCardGrid,
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshSavedQuizzes();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHideCount((current) =>
      normalizeHideCount(current, quranText, quizMethod),
    );
  }, [quranText, quizMethod]);

  const handleTextChange = (value: string) => {
    setQuranText(value);
    setGeneratedQuiz(null);
    setGenerateError(undefined);
    setHistoryStatus(undefined);
  };

  const handleMethodChange = (value: QuizMethod) => {
    setQuizMethod(value);
    setGeneratedQuiz(null);
    setGenerateError(undefined);
    setHistoryStatus(undefined);
  };

  const handleHideCountChange = (value: number) => {
    setHideCount(normalizeHideCount(value, quranText, quizMethod));
    setGeneratedQuiz(null);
    setGenerateError(undefined);
    setHistoryStatus(undefined);
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
    openQuizPayload(record.quiz, "Saved quiz opened.");
  };

  const handleImportShareableQuiz = (
    quiz: GeneratedQuiz,
    _document: ShareableQuizDocument,
  ) => {
    openQuizPayload(quiz, "Imported quiz opened.");
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
          eyebrow="Phase 11.4"
          title="Matn Quiz"
          description="Paste Quran or Islamic matn text, generate a study quiz, save it locally, or import/export it as shareable JSON."
        />

        <ResponsiveCardGrid>
          <ResponsiveCard>
            <QuranTextInput
              value={quranText}
              onChange={handleTextChange}
              error={error}
            />
          </ResponsiveCard>

          <div
            data-testid="responsive-two-column-section"
            className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
          >
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
          </div>

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

          {generatedQuiz && (
            <ResponsiveCard>
              <GeneratedQuizPreview
                quiz={generatedQuiz}
                onSaveQuiz={handleSaveQuiz}
                onResetQuiz={() => setGeneratedQuiz(null)}
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
