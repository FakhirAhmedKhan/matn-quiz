import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  GET,
  PATCH,
} from "@/app/api/books/[bookId]/route";
import {
  getBookRepository,
  resetDemoBookRepositoryForTests,
} from "@/lib/books/book-repository-provider";
import { BOOK_STATUSES } from "@/lib/books/book-types";

function context(
  bookId: string,
) {
  return {
    params: Promise.resolve({
      bookId,
    }),
  };
}

describe("/api/books/[bookId]", () => {
  beforeEach(() => {
    resetDemoBookRepositoryForTests();
  });

  it("gets a book by id", async () => {
    const repository =
      getBookRepository();

    const created =
      await repository.create({
        title: "Detail Book",
        author: "Author",
        fileUrl: "/detail.pdf",
      });

    const response = await GET(
      new Request(
        `http://localhost/api/books/${created.id}`,
      ),
      context(created.id),
    );

    const data =
      await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.book.id).toBe(
      created.id,
    );
  });

  it("returns 404 for an unknown book", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/books/missing",
      ),
      context("missing"),
    );

    expect(response.status).toBe(404);
  });

  it("verifies a pending book", async () => {
    const repository =
      getBookRepository();

    const created =
      await repository.create({
        title: "Pending Book",
        author: "Author",
        fileUrl: "/pending.pdf",
      });

    const response = await PATCH(
      new Request(
        `http://localhost/api/books/${created.id}`,
        {
          method: "PATCH",
          headers: {
            "content-type":
              "application/json",
          },
          body: JSON.stringify({
            action: "verify",
          }),
        },
      ),
      context(created.id),
    );

    const data =
      await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.book.status).toBe(
      BOOK_STATUSES.VERIFIED,
    );
    expect(
      data.book.verifiedAt,
    ).toBeTruthy();

    const publicBooks =
      await repository.listPublicBooks();

    expect(publicBooks).toHaveLength(1);
  });

  it("rejects unsupported patch actions", async () => {
    const repository =
      getBookRepository();

    const created =
      await repository.create({
        title: "Pending Book",
        author: "Author",
        fileUrl: "/pending.pdf",
      });

    const response = await PATCH(
      new Request(
        `http://localhost/api/books/${created.id}`,
        {
          method: "PATCH",
          headers: {
            "content-type":
              "application/json",
          },
          body: JSON.stringify({
            action: "delete",
          }),
        },
      ),
      context(created.id),
    );

    expect(response.status).toBe(400);
  });
});