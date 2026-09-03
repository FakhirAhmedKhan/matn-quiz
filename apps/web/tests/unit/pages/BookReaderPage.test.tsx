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

import BookReaderPage from "@/app/books/[bookId]/read/page";

vi.mock("next/navigation", () => ({
  usePathname: () =>
    "/books/book-1/read",
}));

describe("BookReaderPage", () => {
  it("renders the PDF reader page", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          ok: true,
          book: {
            id: "book-1",
            title: "Reader Page Book",
            author: "Author",
            description: null,
            category: null,
            language: "English",
            coverUrl: null,
            fileUrl:
              "/uploads/books/files/page.pdf",
            fileName: "page.pdf",
            mimeType:
              "application/pdf",
            fileSize: 100,
            status: "VERIFIED",
            verifiedAt:
              "2026-09-04T00:00:00.000Z",
            createdAt:
              "2026-09-04T00:00:00.000Z",
            updatedAt:
              "2026-09-04T00:00:00.000Z",
          },
        }),
      }),
    );

    const element =
      await BookReaderPage({
        params: Promise.resolve({
          bookId: "book-1",
        }),
      });

    render(element);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Read Book",
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-pdf-frame",
        ),
      ).toBeInTheDocument();
    });
  });
});