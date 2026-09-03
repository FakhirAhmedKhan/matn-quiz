import { describe, expect, it } from "vitest";

import {
  BOOK_STATUSES,
} from "@/lib/books/book-types";
import { DemoBookRepository } from "@/lib/books/demo-book-repository";

describe("DemoBookRepository", () => {
  it("creates books as pending", async () => {
    const repository = new DemoBookRepository();

    const book = await repository.create({
      title: "Test Book",
      author: "Test Author",
      fileUrl: "/uploads/books/files/test.pdf",
      fileName: "test.pdf",
      mimeType: "application/pdf",
      fileSize: 1000,
    });

    expect(book.id).toBeTruthy();
    expect(book.status).toBe(
      BOOK_STATUSES.PENDING,
    );
    expect(book.verifiedAt).toBeNull();
  });

  it("does not expose pending books publicly", async () => {
    const repository = new DemoBookRepository();

    await repository.create({
      title: "Pending Book",
      author: "Author",
      fileUrl: "/pending.pdf",
    });

    const publicBooks =
      await repository.listPublicBooks();

    expect(publicBooks).toEqual([]);
  });

  it("verifies a pending book", async () => {
    const repository = new DemoBookRepository();

    const created = await repository.create({
      title: "Book",
      author: "Author",
      fileUrl: "/book.pdf",
    });

    const verified =
      await repository.verify(created.id);

    expect(verified?.status).toBe(
      BOOK_STATUSES.VERIFIED,
    );

    expect(verified?.verifiedAt).toBeTruthy();
  });

  it("shows verified books publicly", async () => {
    const repository = new DemoBookRepository();

    const created = await repository.create({
      title: "Public Book",
      author: "Author",
      fileUrl: "/public.pdf",
    });

    await repository.verify(created.id);

    const publicBooks =
      await repository.listPublicBooks();

    expect(publicBooks).toHaveLength(1);
    expect(publicBooks[0]?.id).toBe(created.id);
  });

  it("returns null when verifying an unknown book", async () => {
    const repository = new DemoBookRepository();

    const result =
      await repository.verify("missing");

    expect(result).toBeNull();
  });
});