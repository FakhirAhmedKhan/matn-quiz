import {
  existsSync,
  readFileSync,
} from "node:fs";

import {
  resolve,
} from "node:path";

function loadEnvFile(
  fileName,
) {
  const path =
    resolve(
      process.cwd(),
      fileName,
    );

  if (
    !existsSync(path)
  ) {
    return;
  }

  const content =
    readFileSync(
      path,
      "utf8",
    );

  for (
    const rawLine of content.split(
      /\r?\n/,
    )
  ) {
    const line =
      rawLine.trim();

    if (
      !line ||
      line.startsWith(
        "#",
      )
    ) {
      continue;
    }

    const separator =
      line.indexOf(
        "=",
      );

    if (
      separator <= 0
    ) {
      continue;
    }

    const key =
      line
        .slice(
          0,
          separator,
        )
        .trim();

    let value =
      line
        .slice(
          separator + 1,
        )
        .trim();

    if (
      (
        value.startsWith(
          '"',
        ) &&
        value.endsWith(
          '"',
        )
      ) ||
      (
        value.startsWith(
          "'",
        ) &&
        value.endsWith(
          "'",
        )
      )
    ) {
      value =
        value.slice(
          1,
          -1,
        );
    }

    if (
      !process.env[key]
    ) {
      process.env[key] =
        value;
    }
  }
}

loadEnvFile(
  ".env.local",
);

loadEnvFile(
  ".env",
);

const baseUrl =
  (
    process.env
      .EXPO_PUBLIC_API_BASE_URL ??
    ""
  )
    .trim()
    .replace(
      /\/+$/,
      "",
    );

const healthPath =
  (
    process.env
      .EXPO_PUBLIC_API_HEALTH_PATH ??
    "/health"
  ).trim();

if (
  !baseUrl
) {
  console.error(
    "API DOCTOR FAILED",
  );

  console.error(
    "EXPO_PUBLIC_API_BASE_URL is not configured.",
  );

  process.exitCode =
    1;
} else {
  const normalizedHealthPath =
    healthPath.startsWith(
      "/",
    )
      ? healthPath
      : `/${healthPath}`;

  const healthUrl =
    `${baseUrl}${normalizedHealthPath}`;

  console.log(
    "",
  );

  console.log(
    "MATN QUIZ API DOCTOR",
  );

  console.log(
    "====================",
  );

  console.log(
    `Base URL:   ${baseUrl}`,
  );

  console.log(
    `Health URL: ${healthUrl}`,
  );

  console.log(
    "",
  );

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      10_000,
    );

  try {
    const response =
      await fetch(
        healthUrl,
        {
          signal:
            controller.signal,

          headers: {
            Accept:
              "application/json",
          },
        },
      );

    console.log(
      `HTTP Status: ${response.status}`,
    );

    const text =
      await response.text();

    if (text) {
      console.log(
        "",
      );

      console.log(
        "Response:",
      );

      console.log(
        text.slice(
          0,
          1000,
        ),
      );
    }

    console.log(
      "",
    );

    console.log(
      "API REACHABLE",
    );

    if (
      response.status ===
      404
    ) {
      console.log(
        "NOTE: The server is reachable, but /health was not found.",
      );

      console.log(
        "Update EXPO_PUBLIC_API_HEALTH_PATH if your API uses another health route.",
      );
    }
  } catch (error) {
    console.error(
      "",
    );

    console.error(
      "API NOT REACHABLE",
    );

    console.error(
      error instanceof Error
        ? error.message
        : String(error),
    );

    process.exitCode =
      1;
  } finally {
    clearTimeout(
      timeout,
    );
  }
}