import { randomUUID } from "node:crypto";

import type { BookRepository } from "./book-repository";
import {
  BOOK_STATUSES,
  type BookRecord,
  type BookStatus,
  type CreateBookInput,
} from "./book-types";

export class DemoBookRepository implements BookRepository {
  private readonly books = new Map<string, BookRecord>();

  async create(input: CreateBookInput): Promise<BookRecord> {
    const now = new Date().toISOString();

    const book: BookRecord = {
      id: randomUUID(),
      title: input.title.trim(),
      author: input.author.trim(),
      description: input.description?.trim() || null,
      category: input.category?.trim() || null,
      language: input.language?.trim() || null,
      coverUrl: input.coverUrl ?? null,
      fileUrl: input.fileUrl,
      fileName: input.fileName ?? null,
      mimeType: input.mimeType ?? null,
      fileSize: input.fileSize ?? null,
      status: BOOK_STATUSES.PENDING,
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    this.books.set(book.id, book);

    return book;
  }

  async findById(id: string): Promise<BookRecord | null> {
    return this.books.get(id) ?? null;
  }

  async list(): Promise<BookRecord[]> {
    return Array.from(this.books.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async listByStatus(status: BookStatus): Promise<BookRecord[]> {
    const books = await this.list();

    return books.filter((book) => book.status === status);
  }

  async listPublicBooks(): Promise<BookRecord[]> {
    return this.listByStatus(BOOK_STATUSES.VERIFIED);
  }

  async updateStatus(
    id: string,
    status: BookStatus,
  ): Promise<BookRecord | null> {
    const existing = this.books.get(id);

    if (!existing) {
      return null;
    }

    const now = new Date().toISOString();

    const updated: BookRecord = {
      ...existing,
      status,
      verifiedAt:
        status === BOOK_STATUSES.VERIFIED
          ? existing.verifiedAt ?? now
          : null,
      updatedAt: now,
    };

    this.books.set(id, updated);

    return updated;
  }

  async verify(id: string): Promise<BookRecord | null> {
    return this.updateStatus(id, BOOK_STATUSES.VERIFIED);
  }

  clear(): void {
    this.books.clear();
  }
}