import type { BookRecord } from "@/lib/books/book-types";

import { BookCard } from "./BookCard";

export interface BookGridProps {
  books: BookRecord[];
}

export function BookGrid({
  books,
}: BookGridProps) {
  return (
    <div
      data-testid="book-grid"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
        />
      ))}
    </div>
  );
}