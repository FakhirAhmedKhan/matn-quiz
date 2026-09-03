"use client";

import { ResponsiveCard } from "@/components/layout";
// import { ShareableQuizPanel } from "@/components/quiz/dynamic-components";
import type { HomePageState } from "./types";
import { ShareableQuizPanel } from "@/components/quiz";

interface ShareableQuizSectionProps {
  page: HomePageState;
}

export function ShareableQuizSection({ page }: ShareableQuizSectionProps) {
  return (
    <ResponsiveCard>
      <section data-testid="shareable-quiz-section">
        <ShareableQuizPanel
          quiz={page.generatedQuiz}
          onImportQuiz={page.handleImportShareableQuiz}
        />
      </section>
    </ResponsiveCard>
  );
}
