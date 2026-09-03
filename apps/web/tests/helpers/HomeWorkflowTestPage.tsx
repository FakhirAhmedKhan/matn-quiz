"use client";

import {
  AppContainer,
  AppShell,
  ResponsiveCardGrid,
} from "@/components/layout";
import { GeneratedQuizSection } from "@/components/page/home/GeneratedQuizSection";
import { HistoryStatusSection } from "@/components/page/home/HistoryStatusSection";
import { HomeHeroSection } from "@/components/page/home/HomeHeroSection";
import { QuranTextSection } from "@/components/page/home/QuranTextSection";
import { QuizOptionsSection } from "@/components/page/home/QuizOptionsSection";
import { QuizSetupSummarySection } from "@/components/page/home/QuizSetupSummarySection";
import { ResumeStudySection } from "@/components/page/home/ResumeStudySection";
import { SavedHistorySection } from "@/components/page/home/SavedHistorySection";
import { ShareableQuizSection } from "@/components/page/home/ShareableQuizSection";
import usePage from "@/hooks/usePage";

export function HomeWorkflowTestPage() {
  const page = usePage();

  return (
    <AppShell>
      <AppContainer>
        <HomeHeroSection />

        <ResponsiveCardGrid>
          <QuranTextSection page={page} />
          <QuizOptionsSection page={page} />
          <QuizSetupSummarySection page={page} />
          <HistoryStatusSection page={page} />
          <GeneratedQuizSection page={page} />
          <ResumeStudySection page={page} />
          <ShareableQuizSection page={page} />
          <SavedHistorySection page={page} />
        </ResponsiveCardGrid>
      </AppContainer>
    </AppShell>
  );
}