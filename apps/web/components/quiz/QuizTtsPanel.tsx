"use client";

import type { GeneratedQuiz } from "@/types/quiz";
import { QUIZ_METHODS } from "@/lib/constants/quiz";
import {
  assertSpeakableTextDoesNotLeakHiddenAnswers,
  buildSpeakableTextForVisibleWords,
  buildTtsLineOptions,
} from "@/lib/quiz/tts-safe-text";
import { cn } from "@/lib/utils/cn";
import { ArabicTtsControls } from "@/components/quiz/ArabicTtsControls";

export interface QuizTtsPanelProps {
  quiz: GeneratedQuiz;
  className?: string;
}

export function QuizTtsPanel({ quiz, className }: QuizTtsPanelProps) {
  if (quiz.method === QUIZ_METHODS.HIDE_WORD) {
    const speakableText = buildSpeakableTextForVisibleWords(quiz);
    const safe = assertSpeakableTextDoesNotLeakHiddenAnswers(
      quiz,
      speakableText,
    );

    return (
      <section
        data-testid="arabic-tts-panel"
        aria-label="Arabic text to speech"
        className={cn("space-y-3", className)}
      >
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Listen to Visible Words
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Hidden words are removed before audio starts.
          </p>
        </div>

        <ArabicTtsControls
          speakableText={safe ? speakableText : ""}
          label="Speak visible quiz text"
          hiddenWarning="No visible words are safe to play."
        />
      </section>
    );
  }

  const lines = buildTtsLineOptions(quiz);

  return (
    <section
      data-testid="arabic-tts-panel"
      aria-label="Arabic line text to speech"
      className={cn("space-y-4", className)}
    >
      <div>
        <h3 className="text-base font-semibold text-slate-950">
          Listen to Visible Lines
        </h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Only visible lines can be played. Hidden lines stay silent.
        </p>
      </div>

      <div className="space-y-3">
        {lines.map((line) => {
          const safe = !line.hidden && line.speakableText.trim().length > 0;

          return (
            <div
              key={line.tokenIndex}
              data-testid="tts-line-option"
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="text-sm font-semibold text-slate-700">
                Line {line.lineNumber}
              </p>

              {!line.hidden && (
                <p
                  data-testid="tts-visible-line-text"
                  dir="rtl"
                  lang="ar"
                  className="mt-2 rounded-xl bg-slate-50 p-3 text-right text-lg leading-9 text-slate-950"
                >
                  {line.text}
                </p>
              )}

              <div className="mt-3">
                <ArabicTtsControls
                  speakableText={!line.hidden && safe ? line.speakableText : ""}
                  label={
                    line.hidden
                      ? `Hidden line ${line.lineNumber} cannot be played`
                      : `Speak visible line ${line.lineNumber}`
                  }
                  disabled={line.hidden || !safe}
                  hiddenWarning={line.hidden ? "This line is hidden, so audio is disabled." : "No visible text is available to play."}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
