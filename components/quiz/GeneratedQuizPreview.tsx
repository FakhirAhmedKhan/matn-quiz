"use client";

import { CheckCircle2 } from "lucide-react";
import { getGeneratedQuizSummary } from "@/lib/quiz/unified-quiz";
import { cn } from "@/lib/utils/cn";
import type { GeneratedQuiz } from "@/types/quiz";

interface GeneratedQuizPreviewProps {
  quiz: GeneratedQuiz;
  className?: string;
}

export function GeneratedQuizPreview({
  quiz,
  className,
}: GeneratedQuizPreviewProps) {
  return (
    <section
      data-testid="generated-quiz-panel"
      className={cn("space-y-6", className)}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <CheckCircle2 className="h-5 w-5 shrink-0" />

        <p data-testid="generation-success-message">
          Text accepted with{" "}
          <strong>
            {quiz.method === "HIDE_WORD" ? "Hide Words" : "Hide Lines"}
          </strong>{" "}
          and hide count{" "}
          <strong data-testid="generated-hidden-count">
            {quiz.hiddenCount}
          </strong>
          .
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Generated Quiz
        </h2>

        <p
          data-testid="generated-quiz-summary"
          className="mt-1 text-sm leading-6 text-slate-600"
        >
          {getGeneratedQuizSummary(quiz)}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-950">
          Quiz Text
        </h3>

        <div
          data-testid="generated-quiz-text"
          className="arabic-text mt-3 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-5 text-2xl leading-loose text-slate-950"
        >
          {quiz.quizText}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-950">
          Answers
        </h3>

        <ol
          data-testid="generated-answer-list"
          className="mt-3 space-y-3"
        >
          {quiz.answers.map((answer) => (
            <li
              key={`${answer.kind}-${answer.tokenIndex}-${answer.index}`}
              data-testid="generated-answer-item"
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Answer {answer.index}
                </p>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {answer.kind === "word" ? "Word" : "Line"}
                </span>
              </div>

              <p className="arabic-text mt-3 text-xl font-semibold text-slate-950">
                {answer.answer}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
