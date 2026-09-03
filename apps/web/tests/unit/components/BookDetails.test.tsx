import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { BookDetails } from "@/components/books";
import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

afterEach(() => {
  vi.unstubAllGlobals();
});

function book(
  status = BOOK_STATUSES.PENDING,
): BookRecord {
  return {
    id: "book-1",
    title: "Detail Book",
    author: "Detail Author",
    description: "Book description",
    category: "Education",
    language: "English",
    coverUrl: null,
    fileUrl: "/detail.pdf",
    fileName: "detail.pdf",
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

describe("BookDetails", () => {
  it("shows pending details and verify action", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: book(),
        }),
      }),
    );

    render(
      <BookDetails
        bookId="book-1"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Detail Book",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(
        "book-status",
      ),
    ).toHaveTextContent(
      "PENDING",
    );

    expect(
      screen.getByRole("button", {
        name: "Verify Book",
      }),
    ).toBeInTheDocument();
  });

  it("updates the UI after verification", async () => {
    const user = userEvent.setup();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: book(),
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: book(
            BOOK_STATUSES.VERIFIED,
          ),
        }),
      });

    vi.stubGlobal(
      "fetch",
      fetchMock,
    );

    render(
      <BookDetails
        bookId="book-1"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Verify Book",
        }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", {
        name: "Verify Book",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-status",
        ),
      ).toHaveTextContent(
        "VERIFIED",
      );
    });

    expect(
      screen.getByRole("link", {
        name: "Read Book",
      }),
    ).toHaveAttribute(
      "href",
      "/books/book-1/read",
    );
  });

  it("shows a load error", async () => {
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
      <BookDetails
        bookId="missing"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-details-error",
        ),
      ).toHaveTextContent(
        "Book not found.",
      );
    });
  });
});