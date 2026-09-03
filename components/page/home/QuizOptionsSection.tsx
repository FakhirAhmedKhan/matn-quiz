"use client";

import {
  ResponsiveCard,
  ResponsiveTwoColumnSection,
} from "@/components/layout";
// import {
//   HideCountSelector,
//   QuizMethodSelector,
// } from "@/components/quiz/dynamic-components";
import type { HomePageState } from "./types";
import { HideCountSelector, QuizMethodSelector } from "@/components/quiz";

interface QuizOptionsSectionProps {
  page: HomePageState;
}

export function QuizOptionsSection({ page }: QuizOptionsSectionProps) {
  return (
    <ResponsiveTwoColumnSection>
      <ResponsiveCard className="h-full">
        <QuizMethodSelector
          value={page.quizMethod}
          onChange={page.handleMethodChange}
        />
      </ResponsiveCard>

      <ResponsiveCard className="h-full">
        <HideCountSelector
          value={page.hideCount}
          text={page.quranText}
          method={page.quizMethod}
          onChange={page.handleHideCountChange}
        />
      </ResponsiveCard>
    </ResponsiveTwoColumnSection>
  );
}
