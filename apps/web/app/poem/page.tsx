"use client";

import { AppPageShell, AppStepHeader, ResponsiveCard } from "@/components/layout";
import { PoemInputForm } from "@/components/poem";

export default function PoemPage() {
  return (
    <AppPageShell>
      <AppStepHeader
        eyebrow="Poem Reader"
        title="Poem / Nazm Setup"
        description="Paste an Urdu or Arabic poem, choose a reading layout, and open it in a clean page-style reader."
      />

      <ResponsiveCard ariaLabel="Poem setup form">
        <PoemInputForm />
      </ResponsiveCard>
    </AppPageShell>
  );
}