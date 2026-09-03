import {
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
} from "vitest";

import { BookCard } from "@/components/books";
import {
  BOOK_STATUSES,
  type BookRecord,
} from "@/lib/books/book-types";

function createBook(
  overrides: Partial<BookRecord> = {},
): BookRecord {
  return {
    id: "book-1",
    title: "Demo Book",
    author: "Demo Author",
    description: "Description",
    category: "Education",
    language: "English",
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
    ...overrides,
  };
}

describe("BookCard", () => {
  it("renders book information", () => {
    render(
      <BookCard
        book={createBook()}
      />,
    );

    expect(
      screen.getByText("Demo Book"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Demo Author"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Education"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("English"),
    ).toBeInTheDocument();
  });

  it("links to the book details route", () => {
    render(
      <BookCard
        book={createBook()}
      />,
    );

    expect(
      screen.getByRole("link", {
        name: "View Book",
      }),
    ).toHaveAttribute(
      "href",
      "/books/book-1",
    );
  });

  it("shows a cover placeholder", () => {
    render(
      <BookCard
        book={createBook({
          coverUrl: null,
        })}
      />,
    );

    expect(
      screen.getByText(
        "No cover uploaded",
      ),
    ).toBeInTheDocument();
  });
});