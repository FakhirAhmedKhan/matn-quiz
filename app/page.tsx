"use client";

import { useState } from "react";
import { BookOpen, FileText, Type } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Container,
  Counter,
  Divider,
  EmptyState,
  Input,
  RadioCard,
  SectionTitle,
  Textarea,
} from "@/components/ui";

export default function HomePage() {
  const [method, setMethod] = useState("HIDE_WORD");
  const [count, setCount] = useState(1);

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <Container>
        <section className="mx-auto max-w-3xl text-center">
          <Badge variant="primary">Phase 1.2</Badge>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Matn Quiz
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Learn Quran and Islamic texts through interactive quizzes.
          </p>
        </section>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card
            title="UI Components"
            description="Reusable frontend building blocks for the quiz builder."
          >
            <div className="space-y-6">
              <Input
                label="Student Name"
                placeholder="Example input"
                helperText="Reusable input component."
              />

              <Textarea
                label="Arabic Text Preview"
                rtl
                rows={4}
                defaultValue={"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"}
                helperText="RTL-ready textarea for Quran and matn text."
              />

              <Divider />

              <SectionTitle
                title="Quiz Method"
                description="These cards will later control quiz generation."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <RadioCard
                  title="Hide Words"
                  description="Hide selected words from the text."
                  value="HIDE_WORD"
                  selected={method === "HIDE_WORD"}
                  onSelect={setMethod}
                  icon={<Type className="h-5 w-5" />}
                />

                <RadioCard
                  title="Hide Lines"
                  description="Hide full lines from the text."
                  value="HIDE_LINE"
                  selected={method === "HIDE_LINE"}
                  onSelect={setMethod}
                  icon={<FileText className="h-5 w-5" />}
                />
              </div>

              <Counter
                label="Number to Hide"
                value={count}
                min={1}
                max={10}
                onChange={setCount}
              />

              <div className="flex flex-wrap gap-3">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
          </Card>

          <Card
            title="Empty Quiz State"
            description="This will be used before quiz generation."
          >
            <EmptyState
              icon={<BookOpen className="h-6 w-6" />}
              title="No Quiz Generated"
              message="Paste Quran or matn text to begin building a quiz."
              action={<Button variant="outline">Start Later</Button>}
            />
          </Card>
        </div>
      </Container>
    </main>
  );
}
