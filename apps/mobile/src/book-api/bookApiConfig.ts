function normalizePath(
  value: string | undefined,
  fallback: string,
): string {
  const resolved =
    value?.trim() ||
    fallback;

  return resolved.startsWith("/")
    ? resolved
    : `/${resolved}`;
}

function interpolatePath(
  template: string,
  values: Record<string, string>,
): string {
  let output =
    template;

  Object.entries(
    values,
  ).forEach(
    ([key, value]) => {
      output =
        output.replaceAll(
          `:${key}`,
          encodeURIComponent(
            value,
          ),
        );
    },
  );

  return output;
}

export const BOOK_API_CONFIG =
  Object.freeze({
    listPath:
      normalizePath(
        process.env.EXPO_PUBLIC_BOOK_LIST_PATH,
        "/books",
      ),

    createPath:
      normalizePath(
        process.env.EXPO_PUBLIC_BOOK_CREATE_PATH,
        "/books",
      ),

    detailPath:
      normalizePath(
        process.env.EXPO_PUBLIC_BOOK_DETAIL_PATH,
        "/books/:bookId",
      ),

    updatePath:
      normalizePath(
        process.env.EXPO_PUBLIC_BOOK_UPDATE_PATH,
        "/books/:bookId",
      ),

    deletePath:
      normalizePath(
        process.env.EXPO_PUBLIC_BOOK_DELETE_PATH,
        "/books/:bookId",
      ),

    favoritePath:
      normalizePath(
        process.env.EXPO_PUBLIC_BOOK_FAVORITE_PATH,
        "/books/:bookId/favorite",
      ),

    progressPath:
      normalizePath(
        process.env.EXPO_PUBLIC_BOOK_PROGRESS_PATH,
        "/books/:bookId/progress",
      ),
  });

function resolveBookPath(
  template: string,
  bookId: string,
): string {
  return interpolatePath(
    template,
    {
      bookId,
    },
  );
}

export function bookDetailPath(
  bookId: string,
): string {
  return resolveBookPath(
    BOOK_API_CONFIG.detailPath,
    bookId,
  );
}

export function bookUpdatePath(
  bookId: string,
): string {
  return resolveBookPath(
    BOOK_API_CONFIG.updatePath,
    bookId,
  );
}

export function bookDeletePath(
  bookId: string,
): string {
  return resolveBookPath(
    BOOK_API_CONFIG.deletePath,
    bookId,
  );
}

export function bookFavoritePath(
  bookId: string,
): string {
  return resolveBookPath(
    BOOK_API_CONFIG.favoritePath,
    bookId,
  );
}

export function bookProgressPath(
  bookId: string,
): string {
  return resolveBookPath(
    BOOK_API_CONFIG.progressPath,
    bookId,
  );
}