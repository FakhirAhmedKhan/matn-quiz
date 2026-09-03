import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import BookDetailsPage from "@/app/books/[bookId]/page";

vi.mock("next/navigation", () => ({
  usePathname: () =>
    "/books/book-1",
}));

describe("BookDetailsPage", () => {
  it("renders the book details page", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: {
            id: "book-1",
            title: "Page Book",
            author: "Author",
            description: null,
            category: null,
            language: "English",
            coverUrl: null,
            fileUrl: "/page.pdf",
            fileName: "page.pdf",
            mimeType:
              "application/pdf",
            fileSize: 100,
            status: "PENDING",
            verifiedAt: null,
            createdAt:
              "2026-09-04T00:00:00.000Z",
            updatedAt:
              "2026-09-04T00:00:00.000Z",
          },
        }),
      }),
    );

    const element =
      await BookDetailsPage({
        params: Promise.resolve({
          bookId: "book-1",
        }),
      });

    render(element);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Book Details",
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Page Book",
        ),
      ).toBeInTheDocument();
    });
  });
});