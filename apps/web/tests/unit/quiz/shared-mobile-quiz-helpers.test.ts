import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getArabicInputStats,
  validateArabicInput,
} from "@matn-quiz/quiz-core/input";

import {
  clampHideCount,
  getHideCountPresets,
  getItemLabel,
  getMaximumHideCount,
  getMethodLabel,
  MIN_HIDE_COUNT,
} from "@matn-quiz/quiz-core/quiz-setup";

import {
  buildTextPreview,
  calculateHistoryStats,
} from "@matn-quiz/quiz-core/history";

import {
  calculateResumeProgress,
} from "@matn-quiz/quiz-core/resume";

import type {
  QuizHistorySession,
} from "@matn-quiz/shared-types/history";

import type {
  ActiveStudySession,
} from "@matn-quiz/shared-types/resume";

describe(
  "shared Mobile Quiz helpers",
  () => {
    it(
      "calculates Arabic input statistics",
      () => {
        const stats =
          getArabicInputStats(
            "إنما الأعمال\nبالنيات",
          );

        expect(
          stats.words,
        ).toBe(3);

        expect(
          stats.lines,
        ).toBe(2);

        expect(
          stats.arabicCharacters,
        ).toBeGreaterThan(0);
      },
    );

    it(
      "rejects empty Arabic input",
      () => {
        expect(
          validateArabicInput(
            "",
          ).valid,
        ).toBe(false);
      },
    );

    it(
      "accepts valid Arabic input",
      () => {
        expect(
          validateArabicInput(
            "إنما الأعمال بالنيات",
          ).valid,
        ).toBe(true);
      },
    );

    it(
      "uses the canonical minimum hide count",
      () => {
        expect(
          MIN_HIDE_COUNT,
        ).toBe(1);
      },
    );

    it(
      "calculates maximum hide count from Mobile stats",
      () => {
        expect(
          getMaximumHideCount(
            "HIDE_WORD",
            7,
            2,
          ),
        ).toBe(7);

        expect(
          getMaximumHideCount(
            "HIDE_LINE",
            7,
            2,
          ),
        ).toBe(2);
      },
    );

    it(
      "preserves Mobile zero-available hide-count behavior",
      () => {
        expect(
          clampHideCount(
            4,
            0,
          ),
        ).toBe(0);
      },
    );

    it(
      "clamps setup hide count to maximum",
      () => {
        expect(
          clampHideCount(
            10,
            3,
          ),
        ).toBe(3);
      },
    );

    it(
      "creates stable hide-count presets",
      () => {
        expect(
          getHideCountPresets(
            6,
          ),
        ).toEqual([
          1,
          3,
          5,
          6,
        ]);
      },
    );

    it(
      "uses shared Quiz method labels",
      () => {
        expect(
          getMethodLabel(
            "HIDE_WORD",
          ),
        ).toBe(
          "Hide Words",
        );

        expect(
          getMethodLabel(
            "HIDE_LINE",
          ),
        ).toBe(
          "Hide Lines",
        );
      },
    );

    it(
      "creates singular and plural item labels",
      () => {
        expect(
          getItemLabel(
            "HIDE_WORD",
            1,
          ),
        ).toBe("word");

        expect(
          getItemLabel(
            "HIDE_WORD",
            2,
          ),
        ).toBe("words");

        expect(
          getItemLabel(
            "HIDE_LINE",
            1,
          ),
        ).toBe("line");

        expect(
          getItemLabel(
            "HIDE_LINE",
            2,
          ),
        ).toBe("lines");
      },
    );

    it(
      "normalizes history text previews",
      () => {
        expect(
          buildTextPreview(
            "  إنما   الأعمال   بالنيات  ",
          ),
        ).toBe(
          "إنما الأعمال بالنيات",
        );
      },
    );

    it(
      "calculates history statistics",
      () => {
        const sessions:
          QuizHistorySession[] = [
            {
              id:
                "history-1",

              quizId:
                "quiz-1",

              method:
                "HIDE_WORD",

              textPreview:
                "Quiz one",

              hiddenCount:
                2,

              total:
                2,

              correct:
                2,

              incorrect:
                0,

              percentage:
                100,

              completedAt:
                "2026-01-01T00:00:00.000Z",
            },
            {
              id:
                "history-2",

              quizId:
                "quiz-2",

              method:
                "HIDE_LINE",

              textPreview:
                "Quiz two",

              hiddenCount:
                2,

              total:
                2,

              correct:
                1,

              incorrect:
                1,

              percentage:
                50,

              completedAt:
                "2026-01-02T00:00:00.000Z",
            },
          ];

        expect(
          calculateHistoryStats(
            sessions,
          ),
        ).toEqual({
          totalSessions:
            2,

          averageScore:
            75,

          bestScore:
            100,

          totalAnswers:
            4,

          correctAnswers:
            3,
        });
      },
    );

    it(
      "calculates resume progress using unique revealed ids",
      () => {
        const session:
          ActiveStudySession = {
            quizId:
              "quiz-1",

            method:
              "HIDE_WORD",

            textPreview:
              "Quiz",

            hiddenCount:
              4,

            revealedItemIds: [
              "one",
              "one",
              "two",
            ],

            startedAt:
              "2026-01-01T00:00:00.000Z",

            updatedAt:
              "2026-01-01T00:00:00.000Z",
          };

        expect(
          calculateResumeProgress(
            session,
          ),
        ).toEqual({
          revealed:
            2,

          remaining:
            2,

          total:
            4,

          percentage:
            50,
        });
      },
    );
  },
);
