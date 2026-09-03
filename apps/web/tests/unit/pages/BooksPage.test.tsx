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

import BooksPage from "@/app/books/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/books",
}));

describe("BooksPage", () => {
  it("renders the public library page", async () => {
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

    render(<BooksPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Public Books",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /Upload Book/i,
      }),
    ).toHaveAttribute(
      "href",
      "/books/upload",
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "book-library-empty",
        ),
      ).toBeInTheDocument();
    });
  });
});