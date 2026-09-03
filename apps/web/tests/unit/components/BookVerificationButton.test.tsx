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

import { BookVerificationButton } from "@/components/books";
import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

afterEach(() => {
  vi.unstubAllGlobals();
});

function verifiedBook(): BookRecord {
  return {
    id: "book-1",
    title: "Demo Book",
    author: "Author",
    description: null,
    category: null,
    language: null,
    coverUrl: null,
    fileUrl: "/demo.pdf",
    fileName: "demo.pdf",
    mimeType: "application/pdf",
    fileSize: 100,
    status: BOOK_STATUSES.VERIFIED,
    verifiedAt:
      "2026-09-04T00:00:00.000Z",
    createdAt:
      "2026-09-04T00:00:00.000Z",
    updatedAt:
      "2026-09-04T00:00:00.000Z",
  };
}

describe("BookVerificationButton", () => {
  it("verifies a book", async () => {
    const user = userEvent.setup();
    const onVerified = vi.fn();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        ok: true,
        book: verifiedBook(),
      }),
    });

    vi.stubGlobal(
      "fetch",
      fetchMock,
    );

    render(
      <BookVerificationButton
        bookId="book-1"
        onVerified={onVerified}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Verify Book",
      }),
    );

    await waitFor(() => {
      expect(onVerified).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/books/book-1",
      expect.objectContaining({
        method: "PATCH",
      }),
    );
  });

  it("shows verification errors", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          ok: false,
          error: "Verify failed",
        }),
      }),
    );

    render(
      <BookVerificationButton
        bookId="book-1"
        onVerified={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Verify Book",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-verify-error",
        ),
      ).toHaveTextContent(
        "Verify failed",
      );
    });
  });
});