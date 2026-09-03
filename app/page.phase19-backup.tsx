"use client";

import {
  AppContainer,
  AppHero,
  AppShell,
  ResponsiveCard,
  ResponsiveCardGrid,
  ResponsiveTwoColumnSection,
} from "@/components/layout";
import { QuranTextInput, QuizMethodSelector, HideCountSelector, StudySessionResumePanel, GeneratedQuizPreview, ShareableQuizPanel, SavedQuizHistory } from "@/components/quiz";

// Dynamic imports for Quiz components with loading states
import { Button, SectionTitle } from "@/components/ui";

import usePage from "@/hooks/usePage";

export default function HomePage() {
  const usePageState = usePage();
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
              value={usePageState.quranText}
              onChange={usePageState.handleTextChange}
              error={usePageState.error}
            />
          </ResponsiveCard>

          <ResponsiveTwoColumnSection>
            <ResponsiveCard className="h-full">
              <QuizMethodSelector
                value={usePageState.quizMethod}
                onChange={usePageState.handleMethodChange}
              />
            </ResponsiveCard>

            <ResponsiveCard className="h-full">
              <HideCountSelector
                value={usePageState.hideCount}
                text={usePageState.quranText}
                method={usePageState.quizMethod}
                onChange={usePageState.handleHideCountChange}
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
                  {usePageState.stats.arabicWords}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Valid Lines</p>
                <p
                  data-testid="valid-line-count"
                  className="mt-2 text-3xl font-bold text-slate-950"
                >
                  {usePageState.stats.validLines}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Characters</p>
                <p
                  data-testid="character-count"
                  className="mt-2 text-3xl font-bold text-slate-950"
                >
                  {usePageState.stats.characters}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Selected Method</p>
                <p
                  data-testid="selected-method"
                  className="mt-2 text-lg font-bold text-slate-950"
                >
                  {usePageState.selectedMethod?.label}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Hide Count</p>
                <p
                  data-testid="selected-hide-count"
                  className="mt-2 text-3xl font-bold text-slate-950"
                >
                  {usePageState.hideCount}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Status:{" "}
                <strong
                  className={
                    usePageState.canGenerate
                      ? "text-emerald-700"
                      : "text-slate-500"
                  }
                >
                  {usePageState.canGenerate
                    ? "Ready to generate"
                    : "Waiting for valid Arabic text and hide count"}
                </strong>
              </p>

              <Button
                type="button"
                disabled={!usePageState.canGenerate}
                onClick={usePageState.handleGenerate}
              >
                Continue
              </Button>
            </div>

            {usePageState.generateError && (
              <p
                data-testid="generate-error"
                className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {usePageState.generateError}
              </p>
            )}

            {usePageState.historyStatus && (
              <p
                data-testid="history-status"
                role="status"
                aria-live="polite"
                className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                {usePageState.historyStatus}
              </p>
            )}
          </ResponsiveCard>

          <ResponsiveCard>
            <StudySessionResumePanel
              document={usePageState.persistedStudySession}
              onResume={usePageState.handleResumeStudySession}
              onClear={usePageState.handleClearStudySession}
            />
          </ResponsiveCard>

          {usePageState.generatedQuiz && (
            <ResponsiveCard>
              <GeneratedQuizPreview
                quiz={usePageState.generatedQuiz}
                onSaveQuiz={usePageState.handleSaveQuiz}
                onResetQuiz={() => {
                  usePageState.setGeneratedQuiz(null);
                  usePageState.setPersistedStudySession(null);
                  usePageState.clearResumeState();
                }}
                initialStudyState={usePageState.resumeStudyState}
                initialReviewState={usePageState.resumeReviewState}
                studySessionId={usePageState.resumeSessionId}
              />
            </ResponsiveCard>
          )}

          <ResponsiveCard>
            <ShareableQuizPanel
              quiz={usePageState.generatedQuiz}
              onImportQuiz={usePageState.handleImportShareableQuiz}
            />
          </ResponsiveCard>

          <ResponsiveCard>
            <SavedQuizHistory
              items={usePageState.savedQuizzes}
              onOpen={usePageState.handleOpenSavedQuiz}
              onDelete={usePageState.handleDeleteSavedQuiz}
              onClear={usePageState.handleClearHistory}
            />
          </ResponsiveCard>
        </ResponsiveCardGrid>
      </AppContainer>
    </AppShell>
  );
}







