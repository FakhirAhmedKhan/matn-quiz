"use client";

import { useState } from "react";
import { Badge, Card, Container } from "@/components/ui";
import { QuranTextInput } from "@/components/quiz";

export default function HomePage() {
  const [quranText, setQuranText] = useState("");

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <Container>
        <section className="mx-auto max-w-3xl text-center">
          <Badge variant="primary">Phase 2.1</Badge>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Matn Quiz
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Paste Quran or Islamic matn text to prepare it for quiz generation.
          </p>
        </section>

        <div className="mx-auto mt-12 max-w-4xl">
          <Card>
            <QuranTextInput
              value={quranText}
              onChange={setQuranText}
            />
          </Card>
        </div>
      </Container>
    </main>
  );
}
