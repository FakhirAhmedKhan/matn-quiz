"use client";

import { ResponsiveCard } from "@/components/layout";
// import { StudySessionResumePanel } from "@/components/quiz/dynamic-components";
import type { HomePageState } from "./types";
import { StudySessionResumePanel } from "@/components/quiz";

interface ResumeStudySectionProps {
  page: HomePageState;
}

export function ResumeStudySection({ page }: ResumeStudySectionProps) {
  return (
    <ResponsiveCard>
      <section data-testid="resume-study-section">
        <StudySessionResumePanel
          document={page.persistedStudySession}
          onResume={page.handleResumeStudySession}
          onClear={page.handleClearStudySession}
        />
      </section>
    </ResponsiveCard>
  );
}
