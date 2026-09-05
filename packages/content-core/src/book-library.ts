import type {
  Book,
  BookCategory,
  BookCategoryFilter,
  BookLibraryStats,
  BookProgress,
} from "@matn-quiz/shared-types/book";

export const BOOK_CATEGORY_LABELS: Record<
  BookCategory,
  string
> = {
  QURAN: "Quran",
  HADITH: "Hadith",
  FIQH: "Fiqh",
  AQEEDAH: "Aqeedah",
  ARABIC: "Arabic",
  POETRY: "Poetry",
};

export const BOOK_FILTERS: {
  value: BookCategoryFilter;
  label: string;
}[] = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "QURAN",
    label: "Quran",
  },
  {
    value: "HADITH",
    label: "Hadith",
  },
  {
    value: "FIQH",
    label: "Fiqh",
  },
  {
    value: "AQEEDAH",
    label: "Aqeedah",
  },
  {
    value: "ARABIC",
    label: "Arabic",
  },
  {
    value: "POETRY",
    label: "Poetry",
  },
];

export function getBookProgress(
  book: Pick<
    Book,
    "currentPage" | "totalPages"
  >,
): BookProgress {
  const totalPages =
    Math.max(
      1,
      Math.floor(
        book.totalPages,
      ),
    );

  const currentPage =
    Math.min(
      totalPages,
      Math.max(
        0,
        Math.floor(
          book.currentPage,
        ),
      ),
    );

  const percentage =
    Math.round(
      (currentPage /
        totalPages) *
        100,
    );

  return {
    currentPage,
    totalPages,
    percentage,
    completed:
      currentPage >=
      totalPages,
    started:
      currentPage > 0,
  };
}

export function getBookLibraryStats(
  books: Book[],
): BookLibraryStats {
  return books.reduce<BookLibraryStats>(
    (stats, book) => {
      const progress =
        getBookProgress(
          book,
        );

      stats.totalBooks += 1;

      if (
        progress.started &&
        !progress.completed
      ) {
        stats.startedBooks += 1;
      }

      if (
        progress.completed
      ) {
        stats.completedBooks += 1;
      }

      if (
        book.isFavorite
      ) {
        stats.favoriteBooks += 1;
      }

      return stats;
    },
    {
      totalBooks: 0,
      startedBooks: 0,
      completedBooks: 0,
      favoriteBooks: 0,
    },
  );
}

export function filterBooks(
  books: Book[],
  query: string,
  category: BookCategoryFilter,
): Book[] {
  const normalizedQuery =
    query
      .trim()
      .toLocaleLowerCase();

  return books.filter(
    (book) => {
      if (
        category !== "ALL" &&
        book.category !==
          category
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchable =
        [
          book.title,
          book.arabicTitle ?? "",
          book.author,
          book.description,
        ]
          .join(" ")
          .toLocaleLowerCase();

      return searchable.includes(
        normalizedQuery,
      );
    },
  );
}

export function getRecentBooks(
  books: Book[],
  limit = 3,
): Book[] {
  return books
    .filter(
      (book) =>
        Boolean(
          book.lastOpenedAt,
        ),
    )
    .sort(
      (a, b) =>
        new Date(
          b.lastOpenedAt ?? 0,
        ).getTime() -
        new Date(
          a.lastOpenedAt ?? 0,
        ).getTime(),
    )
    .slice(
      0,
      limit,
    );
}

export function getBookStatusLabel(
  book: Book,
): string {
  const progress =
    getBookProgress(book);

  if (progress.completed) {
    return "Completed";
  }

  if (progress.started) {
    return "Continue Reading";
  }

  return "Not Started";
}
