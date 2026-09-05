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

export const POEM_API_CONFIG =
  Object.freeze({
    listPath:
      normalizePath(
        process.env.EXPO_PUBLIC_POEM_LIST_PATH,
        "/poems",
      ),

    createPath:
      normalizePath(
        process.env.EXPO_PUBLIC_POEM_CREATE_PATH,
        "/poems",
      ),

    detailPath:
      normalizePath(
        process.env.EXPO_PUBLIC_POEM_DETAIL_PATH,
        "/poems/:poemId",
      ),

    updatePath:
      normalizePath(
        process.env.EXPO_PUBLIC_POEM_UPDATE_PATH,
        "/poems/:poemId",
      ),

    deletePath:
      normalizePath(
        process.env.EXPO_PUBLIC_POEM_DELETE_PATH,
        "/poems/:poemId",
      ),

    progressPath:
      normalizePath(
        process.env.EXPO_PUBLIC_POEM_PROGRESS_PATH,
        "/poems/:poemId/progress",
      ),
  });

export function poemDetailPath(
  poemId: string,
): string {
  return interpolatePath(
    POEM_API_CONFIG.detailPath,
    {
      poemId,
    },
  );
}

export function poemUpdatePath(
  poemId: string,
): string {
  return interpolatePath(
    POEM_API_CONFIG.updatePath,
    {
      poemId,
    },
  );
}

export function poemDeletePath(
  poemId: string,
): string {
  return interpolatePath(
    POEM_API_CONFIG.deletePath,
    {
      poemId,
    },
  );
}

export function poemProgressPath(
  poemId: string,
): string {
  return interpolatePath(
    POEM_API_CONFIG.progressPath,
    {
      poemId,
    },
  );
}