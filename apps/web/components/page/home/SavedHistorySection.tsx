"use client";

import { ResponsiveCard } from "@/components/layout";
// import { SavedQuizHistory } from "@/components/quiz/dynamic-components";
import type { HomePageState } from "./types";
import { SavedQuizHistory } from "@/components/quiz";

interface SavedHistorySectionProps {
  page: HomePageState;
}

export function SavedHistorySection({ page }: SavedHistorySectionProps) {
  return (
    <ResponsiveCard>
      <section data-testid="saved-history-section">
        <SavedQuizHistory
        openHref="/study"
          items={page.savedQuizzes}
          onOpen={page.handleOpenSavedQuiz}
          onDelete={page.handleDeleteSavedQuiz}
          onClear={page.handleClearHistory}
        />
      </section>
    </ResponsiveCard>
  );
}
