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

import { BookLibrary } from "@/components/books";
import { BOOK_STATUSES } from "@/lib/books/book-types";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("BookLibrary", () => {
  it("shows the empty state", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          books: [],
        }),
      }),
    );

    render(<BookLibrary />);

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-library-empty",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "No verified books yet",
      ),
    ).toBeInTheDocument();
  });

  it("renders verified books returned by the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          books: [
            {
              id: "verified-1",
              title: "Public Book",
              author: "Public Author",
              description: null,
              category: "History",
              language: "English",
              coverUrl: null,
              fileUrl: "/public.pdf",
              fileName: "public.pdf",
              mimeType:
                "application/pdf",
              fileSize: 100,
              status:
                BOOK_STATUSES.VERIFIED,
              verifiedAt:
                "2026-09-04T00:00:00.000Z",
              createdAt:
                "2026-09-04T00:00:00.000Z",
              updatedAt:
                "2026-09-04T00:00:00.000Z",
            },
          ],
        }),
      }),
    );

    render(<BookLibrary />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Public Book",
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows an error state when loading fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          ok: false,
          error: "Library unavailable",
        }),
      }),
    );

    render(<BookLibrary />);

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-library-error",
        ),
      ).toHaveTextContent(
        "Library unavailable",
      );
    });
  });
});