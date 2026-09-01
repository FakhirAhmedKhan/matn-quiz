"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  HideCountSelector,
  QuranTextInput,
  QuizMethodSelector,
} from "@/components/quiz";
import {
  Badge,
  Button,
  Card,
  Container,
  SectionTitle,
} from "@/components/ui";
import {
  DEFAULT_QUIZ_METHOD,
  HIDE_COUNT_DEFAULT,
  QUIZ_METHOD_OPTIONS,
} from "@/lib/constants/quiz";
import { getArabicTextStats } from "@/lib/utils/arabic";
import {
  getQuranTextInputError,
  validateQuranTextInput,
} from "@/lib/quiz/validation";
import {
  isValidHideCount,
  normalizeHideCount,
} from "@/lib/quiz/hide-count";
import type { QuizMethod } from "@/types/quiz";

export default function HomePage() {
  const [quranText, setQuranText] = useState("");
  const [quizMethod, setQuizMethod] =
    useState<QuizMethod>(DEFAULT_QUIZ_METHOD);
  const [hideCount, setHideCount] = useState(HIDE_COUNT_DEFAULT);
  const [submitted, setSubmitted] = useState(false);

  const stats = useMemo(() => getArabicTextStats(quranText), [quranText]);

  const validation = useMemo(
    () => validateQuranTextInput(quranText),
    [quranText],
  );

  const hideCountValid = useMemo(
    () => isValidHideCount(hideCount, quranText, quizMethod),
    [hideCount, quranText, quizMethod],
  );

  const selectedMethod = QUIZ_METHOD_OPTIONS.find(
    (method) => method.value === quizMethod,
  );

  const error =
    quranText.trim().length > 0
      ? getQuranTextInputError(quranText)
      : undefined;

  const canContinue = validation.valid && hideCountValid;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHideCount((current) =>
      normalizeHideCount(current, quranText, quizMethod),
    );
    setSubmitted(false);
  }, [quranText, quizMethod]);

  const handleTextChange = (value: string) => {
    setQuranText(value);
    setSubmitted(false);
  };

  const handleMethodChange = (value: QuizMethod) => {
    setQuizMethod(value);
    setSubmitted(false);
  };

  const handleHideCountChange = (value: number) => {
    setHideCount(normalizeHideCount(value, quranText, quizMethod));
    setSubmitted(false);
  };

  const handleContinue = () => {
    if (!canContinue) return;

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <Container>
        <section className="mx-auto max-w-3xl text-center">
          <Badge variant="primary">Phase 4.3</Badge>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Matn Quiz
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Paste Quran or Islamic matn text, choose the quiz method, then choose how much content should be hidden.
          </p>
        </section>

        <div className="mx-auto mt-12 max-w-4xl space-y-6">
          <Card>
            <QuranTextInput
              value={quranText}
              onChange={handleTextChange}
              error={error}
            />
          </Card>

          <Card>
            <QuizMethodSelector
              value={quizMethod}
              onChange={handleMethodChange}
            />
          </Card>

          <Card>
            <HideCountSelector
              value={hideCount}
              text={quranText}
              method={quizMethod}
              onChange={handleHideCountChange}
            />
          </Card>

          <Card>
            <SectionTitle
              title="Quiz Setup Summary"
              description="These values will be used later when quiz generation is added."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Arabic Words</p>
                <p
                  data-testid="arabic-word-count"
                  className="mt-2 text-3xl font-bold text-slate-950"
                >
                  {stats.arabicWords}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Valid Lines</p>
                <p
                  data-testid="valid-line-count"
                  className="mt-2 text-3xl font-bold text-slate-950"
                >
                  {stats.validLines}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Characters</p>
                <p
                  data-testid="character-count"
                  className="mt-2 text-3xl font-bold text-slate-950"
                >
                  {stats.characters}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Selected Method</p>
                <p
                  data-testid="selected-method"
                  className="mt-2 text-lg font-bold text-slate-950"
                >
                  {selectedMethod?.label}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Hide Count</p>
                <p
                  data-testid="selected-hide-count"
                  className="mt-2 text-3xl font-bold text-slate-950"
                >
                  {hideCount}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Status:{" "}
                <strong
                  className={
                    canContinue
                      ? "text-emerald-700"
                      : "text-slate-500"
                  }
                >
                  {canContinue
                    ? "Ready to continue"
                    : "Waiting for valid Arabic text and hide count"}
                </strong>
              </p>

              <Button
                type="button"
                disabled={!canContinue}
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>

            {submitted && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 className="h-5 w-5" />
                <p>
                  Text accepted with{" "}
                  <strong>{selectedMethod?.label}</strong> and hide count{" "}
                  <strong>{hideCount}</strong>. Quiz generation will be added in the next phases.
                </p>
              </div>
            )}
          </Card>
        </div>
      </Container>
    </main>
  );
}
