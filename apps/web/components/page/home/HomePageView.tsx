"use client";

import {
  AppContainer,
  AppShell,
  ResponsiveCardGrid,
} from "@/components/layout";
import { GeneratedQuizSection } from "./GeneratedQuizSection";
import { HistoryStatusSection } from "./HistoryStatusSection";
import { HomeHeroSection } from "./HomeHeroSection";
import { QuranTextSection } from "./QuranTextSection";
import { QuizOptionsSection } from "./QuizOptionsSection";
import { QuizSetupSummarySection } from "./QuizSetupSummarySection";
import { ResumeStudySection } from "./ResumeStudySection";
import { SavedHistorySection } from "./SavedHistorySection";
import { ShareableQuizSection } from "./ShareableQuizSection";
import type { HomePageState } from "./types";

interface HomePageViewProps {
  page: HomePageState;
}

export function HomePageView({ page }: HomePageViewProps) {
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

