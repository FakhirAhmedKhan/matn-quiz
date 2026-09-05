import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Book,
  BookFileMetadata,
} from "@matn-quiz/shared-types/book";

import {
  clampBookPage,
  createDemoBookPage,
  getBookPagePercentage,
  getBookPageProgress,
  getBookReaderState,
  getFirstBookPage,
  getInitialReaderPage,
  getLastBookPage,
  getNextBookPage,
  getPreviousBookPage,
  getReaderFontStyle,
  normalizeBookReaderFontSize,
  normalizeBookReaderMode,
} from "@matn-quiz/content-core/book-reader";

import {
  filterBooks,
  getBookLibraryStats,
  getBookProgress,
  getBookStatusLabel,
  getRecentBooks,
} from "@matn-quiz/content-core/book-library";

import {
  buildImportedBookInput,
  formatFileSize,
  validateBookImportFile,
  validateImportedBookInput,
} from "@matn-quiz/content-core/book-import";

import {
  MAX_BOOK_COVER_SIZE,
  MAX_BOOK_FILE_SIZE,
  validateBookCover,
  validateBookFile,
  validateBookUpload,
} from "@matn-quiz/content-core/book-file-validation";

function createBook(
  overrides: Partial<Book> = {},
): Book {
  return {
    id:
      "book-1",

    title:
      "Test Book",

    author:
      "Test Author",

    description:
      "Description",

    category:
      "FIQH",

    totalPages:
      100,

    currentPage:
      0,

    isFavorite:
      false,

    addedAt:
      "2026-01-01T00:00:00.000Z",

    lastOpenedAt:
      null,

    sourceLabel:
      "Demo",

    sourceType:
      "DEMO",

    file:
      null,

    ...overrides,
  };
}

describe(
  "shared Book Reader",
  () => {
    it(
      "clamps Book pages",
      () => {
        expect(
          clampBookPage(
            -1,
            100,
          ),
        ).toBe(1);

        expect(
          clampBookPage(
            101,
            100,
          ),
        ).toBe(100);

        expect(
          clampBookPage(
            50,
            100,
          ),
        ).toBe(50);
      },
    );

    it(
      "preserves initial Mobile page semantics",
      () => {
        expect(
          getInitialReaderPage(
            createBook({
              currentPage:
                0,
            }),
          ),
        ).toBe(1);

        expect(
          getInitialReaderPage(
            createBook({
              currentPage:
                30,
            }),
          ),
        ).toBe(30);

        expect(
          getInitialReaderPage(
            createBook({
              currentPage:
                100,
            }),
          ),
        ).toBe(1);
      },
    );

    it(
      "calculates Book reader progress",
      () => {
        expect(
          getBookPageProgress(
            50,
            100,
          ),
        ).toBe(0.5);

        expect(
          getBookPagePercentage(
            50,
            100,
          ),
        ).toBe(50);
      },
    );

    it(
      "supports canonical page navigation",
      () => {
        expect(
          getPreviousBookPage(
            5,
            10,
          ),
        ).toBe(4);

        expect(
          getPreviousBookPage(
            1,
            10,
          ),
        ).toBe(1);

        expect(
          getNextBookPage(
            5,
            10,
          ),
        ).toBe(6);

        expect(
          getNextBookPage(
            10,
            10,
          ),
        ).toBe(10);

        expect(
          getFirstBookPage(),
        ).toBe(1);

        expect(
          getLastBookPage(
            10,
          ),
        ).toBe(10);
      },
    );

    it(
      "normalizes reader settings",
      () => {
        expect(
          normalizeBookReaderMode(
            "FOCUS",
          ),
        ).toBe(
          "FOCUS",
        );

        expect(
          normalizeBookReaderMode(
            "unknown",
          ),
        ).toBe(
          "READING",
        );

        expect(
          normalizeBookReaderFontSize(
            "LARGE",
          ),
        ).toBe(
          "LARGE",
        );

        expect(
          normalizeBookReaderFontSize(
            "unknown",
          ),
        ).toBe(
          "MEDIUM",
        );
      },
    );

    it(
      "preserves Mobile font rules",
      () => {
        expect(
          getReaderFontStyle(
            "SMALL",
          ),
        ).toEqual({
          fontSize:
            22,

          lineHeight:
            40,
        });

        expect(
          getReaderFontStyle(
            "MEDIUM",
          ),
        ).toEqual({
          fontSize:
            28,

          lineHeight:
            48,
        });

        expect(
          getReaderFontStyle(
            "LARGE",
          ),
        ).toEqual({
          fontSize:
            34,

          lineHeight:
            58,
        });
      },
    );

    it(
      "creates Book reader state",
      () => {
        expect(
          getBookReaderState(
            100,
            100,
          ),
        ).toEqual({
          page:
            100,

          totalPages:
            100,

          progress:
            1,

          percentage:
            100,

          firstPage:
            false,

          lastPage:
            true,
        });
      },
    );

    it(
      "creates demo reader content",
      () => {
        const page =
          createDemoBookPage(
            createBook(),
            1,
          );

        expect(
          page.pageNumber,
        ).toBe(1);

        expect(
          page.heading.length,
        ).toBeGreaterThan(0);

        expect(
          page.arabicText.length,
        ).toBeGreaterThan(0);
      },
    );
  },
);

describe(
  "shared Book Library",
  () => {
    it(
      "calculates local Book progress",
      () => {
        expect(
          getBookProgress(
            createBook({
              currentPage:
                25,
            }),
          ),
        ).toEqual({
          currentPage:
            25,

          totalPages:
            100,

          percentage:
            25,

          completed:
            false,

          started:
            true,
        });
      },
    );

    it(
      "calculates library stats",
      () => {
        expect(
          getBookLibraryStats([
            createBook({
              id:
                "one",
            }),

            createBook({
              id:
                "two",

              currentPage:
                40,

              isFavorite:
                true,
            }),

            createBook({
              id:
                "three",

              currentPage:
                100,
            }),
          ]),
        ).toEqual({
          totalBooks:
            3,

          startedBooks:
            1,

          completedBooks:
            1,

          favoriteBooks:
            1,
        });
      },
    );

    it(
      "filters Books",
      () => {
        const books = [
          createBook({
            id:
              "fiqh",

            title:
              "Fiqh Manual",

            category:
              "FIQH",
          }),

          createBook({
            id:
              "poetry",

            title:
              "Arabic Poetry",

            category:
              "POETRY",
          }),
        ];

        expect(
          filterBooks(
            books,
            "poetry",
            "ALL",
          ).map(
            (
              book,
            ) =>
              book.id,
          ),
        ).toEqual([
          "poetry",
        ]);
      },
    );

    it(
      "returns recent Books",
      () => {
        const books = [
          createBook({
            id:
              "older",

            lastOpenedAt:
              "2026-01-01T00:00:00.000Z",
          }),

          createBook({
            id:
              "newer",

            lastOpenedAt:
              "2026-02-01T00:00:00.000Z",
          }),
        ];

        expect(
          getRecentBooks(
            books,
            1,
          )[0]?.id,
        ).toBe(
          "newer",
        );
      },
    );

    it(
      "creates Book status labels",
      () => {
        expect(
          getBookStatusLabel(
            createBook({
              currentPage:
                0,
            }),
          ),
        ).toBe(
          "Not Started",
        );

        expect(
          getBookStatusLabel(
            createBook({
              currentPage:
                50,
            }),
          ),
        ).toBe(
          "Continue Reading",
        );

        expect(
          getBookStatusLabel(
            createBook({
              currentPage:
                100,
            }),
          ),
        ).toBe(
          "Completed",
        );
      },
    );
  },
);

describe(
  "shared Mobile Book Import compatibility",
  () => {
    const pdf: BookFileMetadata = {
      fileName:
        "book.pdf",

      fileUri:
        "file://book.pdf",

      mimeType:
        "application/pdf",

      sizeBytes:
        1024,
    };

    it(
      "formats file size",
      () => {
        expect(
          formatFileSize(
            null,
          ),
        ).toBe(
          "Unknown size",
        );

        expect(
          formatFileSize(
            1024,
          ),
        ).toBe(
          "1.0 KB",
        );
      },
    );

    it(
      "preserves Mobile PDF OR policy",
      () => {
        expect(
          validateBookImportFile({
            ...pdf,

            mimeType:
              null,
          }).valid,
        ).toBe(true);

        expect(
          validateBookImportFile({
            ...pdf,

            fileName:
              "book.bin",

            mimeType:
              "application/pdf",
          }).valid,
        ).toBe(true);
      },
    );

    it(
      "allows unknown Mobile size",
      () => {
        expect(
          validateBookImportFile({
            ...pdf,

            sizeBytes:
              null,
          }).valid,
        ).toBe(true);
      },
    );

    it(
      "rejects oversized Mobile PDF",
      () => {
        expect(
          validateBookImportFile({
            ...pdf,

            sizeBytes:
              MAX_BOOK_FILE_SIZE +
              1,
          }).valid,
        ).toBe(false);
      },
    );

    it(
      "validates imported Book metadata",
      () => {
        expect(
          validateImportedBookInput({
            title:
              "Book",

            author:
              "Author",

            description:
              "",

            category:
              "FIQH",

            totalPages:
              100,

            file:
              pdf,
          }).valid,
        ).toBe(true);
      },
    );

    it(
      "normalizes imported Book input",
      () => {
        expect(
          buildImportedBookInput({
            title:
              " Book ",

            arabicTitle:
              " الكتاب ",

            author:
              " Author ",

            description:
              " Description ",

            category:
              "FIQH",

            totalPages:
              100,

            file:
              pdf,
          }),
        ).toEqual({
          title:
            "Book",

          arabicTitle:
            "الكتاب",

          author:
            "Author",

          description:
            "Description",

          category:
            "FIQH",

          totalPages:
            100,

          file:
            pdf,
        });
      },
    );
  },
);

describe(
  "shared strict Web Book validation",
  () => {
    const pdf = {
      name:
        "book.pdf",

      type:
        "application/pdf",

      size:
        1024,
    };

    it(
      "accepts strict PDF metadata",
      () => {
        expect(
          validateBookFile(
            pdf,
          ),
        ).toEqual({
          valid:
            true,

          errors:
            [],
        });
      },
    );

    it(
      "requires MIME and extension",
      () => {
        expect(
          validateBookFile({
            ...pdf,

            type:
              "application/octet-stream",
          }).valid,
        ).toBe(false);

        expect(
          validateBookFile({
            ...pdf,

            name:
              "book.txt",
          }).valid,
        ).toBe(false);
      },
    );

    it(
      "rejects oversized strict PDF",
      () => {
        expect(
          validateBookFile({
            ...pdf,

            size:
              MAX_BOOK_FILE_SIZE +
              1,
          }).valid,
        ).toBe(false);
      },
    );

    it(
      "accepts valid optional cover",
      () => {
        expect(
          validateBookCover(
            null,
          ).valid,
        ).toBe(true);

        expect(
          validateBookCover({
            name:
              "cover.webp",

            type:
              "image/webp",

            size:
              1024,
          }).valid,
        ).toBe(true);
      },
    );

    it(
      "rejects oversized cover",
      () => {
        expect(
          validateBookCover({
            name:
              "cover.png",

            type:
              "image/png",

            size:
              MAX_BOOK_COVER_SIZE +
              1,
          }).valid,
        ).toBe(false);
      },
    );

    it(
      "validates complete upload metadata",
      () => {
        expect(
          validateBookUpload({
            title:
              "Book",

            author:
              "Author",

            description:
              "Description",

            category:
              "Fiqh",

            language:
              "Arabic",

            bookFile:
              pdf,

            coverFile:
              null,
          }),
        ).toEqual({
          valid:
            true,

          errors:
            [],
        });
      },
    );
  },
);
