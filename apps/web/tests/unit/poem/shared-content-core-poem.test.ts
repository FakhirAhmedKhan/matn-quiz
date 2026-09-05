import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getPoemDisplayTitle,
  getPoemStats,
  getPoemVerses,
  hasPoemText,
  normalizePoemText,
  splitPoemIntoColumns,
  splitPoemLines,
  validatePoemDraft,
} from "@matn-quiz/content-core/poem";

import {
  clampPoemReaderIndex,
  getFirstPoemReaderIndex,
  getLastPoemReaderIndex,
  getNextPoemReaderIndex,
  getPoemReaderPercentage,
  getPoemReaderProgress,
  getPoemReaderState,
  getPreviousPoemReaderIndex,
  normalizePoemReaderMode,
} from "@matn-quiz/content-core/poem-reader";

describe(
  "shared content-core Poem logic",
  () => {
    it(
      "normalizes Windows and legacy line endings",
      () => {
        expect(
          normalizePoemText(
            "A\r\nB\rC",
          ),
        ).toBe(
          "A\nB\nC",
        );
      },
    );

    it(
      "splits non-empty poem lines consistently",
      () => {
        expect(
          splitPoemLines(
            "A\n\nB\r\n C ",
          ),
        ).toEqual([
          "A",
          "B",
          "C",
        ]);

        expect(
          getPoemVerses(
            "A\n\nB\r\n C ",
          ),
        ).toEqual([
          "A",
          "B",
          "C",
        ]);
      },
    );

    it(
      "splits lines into RTL-first Web reader columns",
      () => {
        expect(
          splitPoemIntoColumns(
            "Line 1\nLine 2\nLine 3\nLine 4",
          ),
        ).toEqual({
          rightColumn: [
            "Line 1",
            "Line 2",
          ],

          leftColumn: [
            "Line 3",
            "Line 4",
          ],
        });
      },
    );

    it(
      "puts the extra odd line in the right column",
      () => {
        expect(
          splitPoemIntoColumns(
            "1\n2\n3",
          ),
        ).toEqual({
          rightColumn: [
            "1",
            "2",
          ],

          leftColumn: [
            "3",
          ],
        });
      },
    );

    it(
      "detects poem text",
      () => {
        expect(
          hasPoemText({
            text:
              "  poem  ",
          }),
        ).toBe(true);

        expect(
          hasPoemText({
            text:
              "   ",
          }),
        ).toBe(false);
      },
    );

    it(
      "creates a poem display title",
      () => {
        expect(
          getPoemDisplayTitle({
            title:
              "  نور العلم  ",
          }),
        ).toBe(
          "نور العلم",
        );

        expect(
          getPoemDisplayTitle({
            title:
              " ",
          }),
        ).toBe(
          "Untitled Poem",
        );
      },
    );

    it(
      "calculates poem statistics",
      () => {
        const text =
          "نور العلم\n\nالعلم نور";

        const stats =
          getPoemStats(
            text,
          );

        expect(
          stats.words,
        ).toBe(4);

        expect(
          stats.verses,
        ).toBe(2);

        expect(
          stats.lines,
        ).toBe(3);

        expect(
          stats.stanzas,
        ).toBe(2);

        expect(
          stats.arabicCharacters,
        ).toBeGreaterThan(
          0,
        );

        expect(
          stats.characters,
        ).toBe(
          Array.from(
            text,
          ).length,
        );
      },
    );

    it(
      "rejects a missing poem title",
      () => {
        const result =
          validatePoemDraft(
            "",
            "نور العلم\nالعلم نور",
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.titleValid,
        ).toBe(false);
      },
    );

    it(
      "rejects non-Arabic poem content",
      () => {
        const result =
          validatePoemDraft(
            "Poem",
            "Line one\nLine two",
          );

        expect(
          result.valid,
        ).toBe(false);

        expect(
          result.textValid,
        ).toBe(false);
      },
    );

    it(
      "accepts a valid Arabic poem",
      () => {
        const result =
          validatePoemDraft(
            "نور العلم",
            "العلم نور في الدروب\nوالقلب بالمعنى الجميل",
          );

        expect(
          result,
        ).toEqual({
          valid:
            true,

          titleValid:
            true,

          textValid:
            true,

          message:
            "Poem draft is ready for the reader.",
        });
      },
    );

    it(
      "normalizes reader modes",
      () => {
        expect(
          normalizePoemReaderMode(
            "FOCUS",
          ),
        ).toBe(
          "FOCUS",
        );

        expect(
          normalizePoemReaderMode(
            "anything",
          ),
        ).toBe(
          "ALL",
        );
      },
    );

    it(
      "clamps reader indexes",
      () => {
        expect(
          clampPoemReaderIndex(
            -5,
            4,
          ),
        ).toBe(0);

        expect(
          clampPoemReaderIndex(
            100,
            4,
          ),
        ).toBe(3);

        expect(
          clampPoemReaderIndex(
            2,
            4,
          ),
        ).toBe(2);

        expect(
          clampPoemReaderIndex(
            2,
            0,
          ),
        ).toBe(0);
      },
    );

    it(
      "calculates previous and next indexes",
      () => {
        expect(
          getPreviousPoemReaderIndex(
            2,
            4,
          ),
        ).toBe(1);

        expect(
          getPreviousPoemReaderIndex(
            0,
            4,
          ),
        ).toBe(0);

        expect(
          getNextPoemReaderIndex(
            1,
            4,
          ),
        ).toBe(2);

        expect(
          getNextPoemReaderIndex(
            3,
            4,
          ),
        ).toBe(3);
      },
    );

    it(
      "calculates first and last indexes",
      () => {
        expect(
          getFirstPoemReaderIndex(),
        ).toBe(0);

        expect(
          getLastPoemReaderIndex(
            4,
          ),
        ).toBe(3);

        expect(
          getLastPoemReaderIndex(
            0,
          ),
        ).toBe(0);
      },
    );

    it(
      "calculates reader progress",
      () => {
        expect(
          getPoemReaderProgress(
            1,
            4,
          ),
        ).toBe(0.5);

        expect(
          getPoemReaderPercentage(
            1,
            4,
          ),
        ).toBe(50);

        expect(
          getPoemReaderProgress(
            0,
            0,
          ),
        ).toBe(0);

        expect(
          getPoemReaderPercentage(
            0,
            0,
          ),
        ).toBe(0);
      },
    );

    it(
      "creates normalized reader state",
      () => {
        expect(
          getPoemReaderState(
            99,
            4,
          ),
        ).toEqual({
          currentIndex:
            3,

          total:
            4,

          progress:
            1,

          percentage:
            100,
        });
      },
    );
  },
);
