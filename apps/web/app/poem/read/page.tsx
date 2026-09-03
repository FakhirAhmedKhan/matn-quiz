"use client";

import { useEffect, useState } from "react";

import { AppPageShell, AppStepHeader } from "@/components/layout";
import { PoemReader } from "@/components/poem";
import {
  clearPoemDraft,
  createPoemDraft,
  loadPoemDraft,
  savePoemDraft,
  type PoemDraft,
  type PoemLayout,
} from "@/lib/poem/poem-storage";

export default function PoemReadPage() {
  const [draft, setDraft] = useState<PoemDraft>(() => createPoemDraft());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(loadPoemDraft());
  }, []);

  function handleLayoutChange(layout: PoemLayout) {
    setDraft(savePoemDraft({ layout }));
  }

  function handleFontSizeChange(fontSize: number) {
    setDraft(savePoemDraft({ fontSize }));
  }

  function handleClear() {
    setDraft(clearPoemDraft());
  }

  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Poem Reader"
        title="Read Poem"
        description="Read your poem in a focused Urdu/Arabic page layout with center spacing and clean typography."
      />

      <PoemReader
        draft={draft}
        onLayoutChange={handleLayoutChange}
        onFontSizeChange={handleFontSizeChange}
        onClear={handleClear}
      />
    </AppPageShell>
  );
}