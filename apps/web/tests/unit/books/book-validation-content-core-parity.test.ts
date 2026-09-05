import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ALLOWED_BOOK_EXTENSIONS as WEB_ALLOWED_BOOK_EXTENSIONS,
  ALLOWED_BOOK_MIME_TYPES as WEB_ALLOWED_BOOK_MIME_TYPES,
  ALLOWED_COVER_EXTENSIONS as WEB_ALLOWED_COVER_EXTENSIONS,
  ALLOWED_COVER_MIME_TYPES as WEB_ALLOWED_COVER_MIME_TYPES,
  MAX_BOOK_COVER_SIZE as WEB_MAX_BOOK_COVER_SIZE,
  MAX_BOOK_FILE_SIZE as WEB_MAX_BOOK_FILE_SIZE,
  validateBookCover as validateWebBookCover,
  validateBookFile as validateWebBookFile,
  validateBookUpload as validateWebBookUpload,
} from "@/lib/books/book-validation";

import {
  ALLOWED_BOOK_EXTENSIONS as CORE_ALLOWED_BOOK_EXTENSIONS,
  ALLOWED_BOOK_MIME_TYPES as CORE_ALLOWED_BOOK_MIME_TYPES,
  ALLOWED_COVER_EXTENSIONS as CORE_ALLOWED_COVER_EXTENSIONS,
  ALLOWED_COVER_MIME_TYPES as CORE_ALLOWED_COVER_MIME_TYPES,
  MAX_BOOK_COVER_SIZE as CORE_MAX_BOOK_COVER_SIZE,
  MAX_BOOK_FILE_SIZE as CORE_MAX_BOOK_FILE_SIZE,
  validateBookCover as validateCoreBookCover,
  validateBookFile as validateCoreBookFile,
  validateBookUpload as validateCoreBookUpload,
} from "@matn-quiz/content-core/book-file-validation";

describe(
  "Web Book validation content-core parity",
  () => {
    const validPdf = {
      name:
        "book.pdf",

      type:
        "application/pdf",

      size:
        1024,
    };

    it(
      "shares validation constants",
      () => {
        expect(
          WEB_MAX_BOOK_FILE_SIZE,
        ).toBe(
          CORE_MAX_BOOK_FILE_SIZE,
        );

        expect(
          WEB_MAX_BOOK_COVER_SIZE,
        ).toBe(
          CORE_MAX_BOOK_COVER_SIZE,
        );

        expect(
          WEB_ALLOWED_BOOK_MIME_TYPES,
        ).toEqual(
          CORE_ALLOWED_BOOK_MIME_TYPES,
        );

        expect(
          WEB_ALLOWED_COVER_MIME_TYPES,
        ).toEqual(
          CORE_ALLOWED_COVER_MIME_TYPES,
        );

        expect(
          WEB_ALLOWED_BOOK_EXTENSIONS,
        ).toEqual(
          CORE_ALLOWED_BOOK_EXTENSIONS,
        );

        expect(
          WEB_ALLOWED_COVER_EXTENSIONS,
        ).toEqual(
          CORE_ALLOWED_COVER_EXTENSIONS,
        );
      },
    );

    it(
      "matches valid PDF validation",
      () => {
        expect(
          validateWebBookFile(
            validPdf,
          ),
        ).toEqual(
          validateCoreBookFile(
            validPdf,
          ),
        );
      },
    );

    it(
      "matches invalid MIME validation",
      () => {
        const file = {
          ...validPdf,

          type:
            "application/octet-stream",
        };

        expect(
          validateWebBookFile(
            file,
          ),
        ).toEqual(
          validateCoreBookFile(
            file,
          ),
        );
      },
    );

    it(
      "matches invalid extension validation",
      () => {
        const file = {
          ...validPdf,

          name:
            "book.txt",
        };

        expect(
          validateWebBookFile(
            file,
          ),
        ).toEqual(
          validateCoreBookFile(
            file,
          ),
        );
      },
    );

    it(
      "matches unsafe path validation",
      () => {
        const file = {
          ...validPdf,

          name:
            "../book.pdf",
        };

        expect(
          validateWebBookFile(
            file,
          ),
        ).toEqual(
          validateCoreBookFile(
            file,
          ),
        );
      },
    );

    it(
      "matches empty file validation",
      () => {
        const file = {
          ...validPdf,

          size:
            0,
        };

        expect(
          validateWebBookFile(
            file,
          ),
        ).toEqual(
          validateCoreBookFile(
            file,
          ),
        );
      },
    );

    it(
      "matches oversized PDF validation",
      () => {
        const file = {
          ...validPdf,

          size:
            CORE_MAX_BOOK_FILE_SIZE +
            1,
        };

        expect(
          validateWebBookFile(
            file,
          ),
        ).toEqual(
          validateCoreBookFile(
            file,
          ),
        );
      },
    );

    it(
      "matches optional cover validation",
      () => {
        expect(
          validateWebBookCover(
            null,
          ),
        ).toEqual(
          validateCoreBookCover(
            null,
          ),
        );

        const cover = {
          name:
            "cover.webp",

          type:
            "image/webp",

          size:
            1024,
        };

        expect(
          validateWebBookCover(
            cover,
          ),
        ).toEqual(
          validateCoreBookCover(
            cover,
          ),
        );
      },
    );

    it(
      "matches complete upload validation",
      () => {
        const upload = {
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
            validPdf,

          coverFile:
            null,
        };

        expect(
          validateWebBookUpload(
            upload,
          ),
        ).toEqual(
          validateCoreBookUpload(
            upload,
          ),
        );
      },
    );

    it(
      "matches invalid metadata validation",
      () => {
        const upload = {
          title:
            "",

          author:
            "",

          description:
            "x".repeat(
              5001,
            ),

          category:
            "x".repeat(
              101,
            ),

          language:
            "x".repeat(
              101,
            ),

          bookFile: {
            name:
              "bad.txt",

            type:
              "text/plain",

            size:
              0,
          },

          coverFile:
            null,
        };

        expect(
          validateWebBookUpload(
            upload,
          ),
        ).toEqual(
          validateCoreBookUpload(
            upload,
          ),
        );
      },
    );
  },
);
