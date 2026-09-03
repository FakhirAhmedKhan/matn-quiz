"use client";

import { ResponsiveCard } from "@/components/layout";
// import { GeneratedQuizPreview } from "@/components/quiz/dynamic-components";
import type { HomePageState } from "./types";
import { GeneratedQuizPreview } from "@/components/quiz";

interface GeneratedQuizSectionProps {
  page: HomePageState;
}

export function GeneratedQuizSection({ page }: GeneratedQuizSectionProps) {
  if (!page.generatedQuiz) {
    return null;
  }

  return (
    <ResponsiveCard>
      <section data-testid="generated-quiz-section">
        <GeneratedQuizPreview
          quiz={page.generatedQuiz}
          onSaveQuiz={page.handleSaveQuiz}
          onResetQuiz={() => {
            page.setGeneratedQuiz(null);
            page.clearResumeState();
          }}
          initialStudyState={page.resumeStudyState}
          initialReviewState={page.resumeReviewState}
          studySessionId={page.resumeSessionId}
        />
      </section>
    </ResponsiveCard>
  );
}
