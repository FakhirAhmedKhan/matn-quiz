import {
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
} from "vitest";

import { BookGrid } from "@/components/books";
import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

function book(
  id: string,
  title: string,
): BookRecord {
  return {
    id,
    title,
    author: "Author",
    description: null,
    category: null,
    language: null,
    coverUrl: null,
    fileUrl: `/${id}.pdf`,
    fileName: `${id}.pdf`,
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

describe("BookGrid", () => {
  it("renders every book", () => {
    render(
      <BookGrid
        books={[
          book("1", "Book One"),
          book("2", "Book Two"),
        ]}
      />,
    );

    expect(
      screen.getAllByTestId(
        "book-card",
      ),
    ).toHaveLength(2);

    expect(
      screen.getByText("Book One"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Book Two"),
    ).toBeInTheDocument();
  });
});