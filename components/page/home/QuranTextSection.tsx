"use client";

import { ResponsiveCard } from "@/components/layout";
// import { QuranTextInput } from "@/components/quiz/dynamic-components";
import type { HomePageState } from "./types";
import { QuranTextInput } from "@/components/quiz";

interface QuranTextSectionProps {
  page: HomePageState;
}

export function QuranTextSection({ page }: QuranTextSectionProps) {
  return (
    <ResponsiveCard>
      <QuranTextInput
        value={page.quranText}
        onChange={page.handleTextChange}
        error={page.error}
      />
    </ResponsiveCard>
  );
}
