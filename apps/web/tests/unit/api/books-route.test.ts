import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { GET } from "@/app/api/books/route";
import {
  getBookRepository,
  resetDemoBookRepositoryForTests,
} from "@/lib/books/book-repository-provider";
import { BOOK_STATUSES } from "@/lib/books/book-types";

describe("GET /api/books", () => {
  beforeEach(() => {
    resetDemoBookRepositoryForTests();
  });

  it("returns only verified books", async () => {
    const repository =
      getBookRepository();

    await repository.create({
      title: "Pending Book",
      author: "Pending Author",
      fileUrl: "/pending.pdf",
    });

    const verified =
      await repository.create({
        title: "Verified Book",
        author: "Verified Author",
        fileUrl: "/verified.pdf",
      });

    await repository.verify(
      verified.id,
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.books).toHaveLength(1);
    expect(data.books[0].title).toBe(
      "Verified Book",
    );
    expect(data.books[0].status).toBe(
      BOOK_STATUSES.VERIFIED,
    );
  });
});