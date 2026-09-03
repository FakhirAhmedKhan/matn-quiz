import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { BookReader } from "@/components/books";
import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

afterEach(() => {
  vi.unstubAllGlobals();
});

function createBook(
  status = BOOK_STATUSES.VERIFIED,
): BookRecord {
  return {
    id: "book-1",
    title: "Reader Book",
    author: "Reader Author",
    description: null,
    category: "Education",
    language: "English",
    coverUrl: null,
    fileUrl:
      "/uploads/books/files/reader.pdf",
    fileName: "reader.pdf",
    mimeType: "application/pdf",
    fileSize: 100,
    status,
    verifiedAt:
      status ===
      BOOK_STATUSES.VERIFIED
        ? "2026-09-04T00:00:00.000Z"
        : null,
    createdAt:
      "2026-09-04T00:00:00.000Z",
    updatedAt:
      "2026-09-04T00:00:00.000Z",
  };
}

describe("BookReader", () => {
  it("renders a verified PDF in an iframe", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: createBook(),
        }),
      }),
    );

    render(
      <BookReader
        bookId="book-1"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-pdf-frame",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(
        "book-pdf-frame",
      ),
    ).toHaveAttribute(
      "src",
      "/uploads/books/files/reader.pdf",
    );

    expect(
      screen.getByTitle(
        "Reader Book PDF reader",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Open PDF",
      }),
    ).toHaveAttribute(
      "href",
      "/uploads/books/files/reader.pdf",
    );
  });

  it("blocks pending books from the reader", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: createBook(
            BOOK_STATUSES.PENDING,
          ),
        }),
      }),
    );

    render(
      <BookReader
        bookId="book-1"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-reader-unverified",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId(
        "book-pdf-frame",
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText(
        "Verification required",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error when the book cannot be loaded", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          ok: false,
          error: "Book not found.",
        }),
      }),
    );

    render(
      <BookReader
        bookId="missing"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-reader-error",
        ),
      ).toHaveTextContent(
        "Book not found.",
      );
    });
  });
});