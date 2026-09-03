import type {
  BookRecord,
  BookStatus,
  CreateBookInput,
} from "./book-types";

export interface BookRepository {
  create(input: CreateBookInput): Promise<BookRecord>;

  findById(id: string): Promise<BookRecord | null>;

  list(): Promise<BookRecord[]>;

  listByStatus(status: BookStatus): Promise<BookRecord[]>;

  listPublicBooks(): Promise<BookRecord[]>;

  updateStatus(
    id: string,
    status: BookStatus,
  ): Promise<BookRecord | null>;

  verify(id: string): Promise<BookRecord | null>;
}