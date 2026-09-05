import {
  existsSync,
  readFileSync,
} from "node:fs";

const checks = [
  {
    file:
      "src/poem-api/poemApi.ts",

    pattern:
      "getPoems",

    label:
      "Poem list API",
  },

  {
    file:
      "src/poem-api/poemApi.ts",

    pattern:
      "getPoem",

    label:
      "Poem detail API",
  },

  {
    file:
      "src/poem-api/poemApi.ts",

    pattern:
      "createPoem",

    label:
      "Poem create API",
  },

  {
    file:
      "src/poem-api/poemApi.ts",

    pattern:
      "updatePoem",

    label:
      "Poem update API",
  },

  {
    file:
      "src/poem-api/poemApi.ts",

    pattern:
      "saveProgress",

    label:
      "Reader progress API",
  },

  {
    file:
      "src/poem-api/poemApi.ts",

    pattern:
      "deletePoem",

    label:
      "Poem delete API",
  },

  {
    file:
      "src/poem-api/poemAdapter.ts",

    pattern:
      "createRemotePoemFromLocalStore",

    label:
      "Local poem cloud adapter",
  },

  {
    file:
      "src/poem-api/poemResponse.ts",

    pattern:
      "normalizePoemPage",

    label:
      "Paginated response normalizer",
  },

  {
    file:
      "src/store/poemCloudStore.ts",

    pattern:
      "loadMore",

    label:
      "Poem pagination state",
  },

  {
    file:
      "src/store/poemCloudStore.ts",

    pattern:
      "saveSelectedProgress",

    label:
      "Cloud progress sync",
  },

  {
    file:
      "src/poem-api/poemBridge.ts",

    pattern:
      "useAuthStore.subscribe",

    label:
      "Logout poem cleanup",
  },

  {
    file:
      "app/cloud-poems.tsx",

    pattern:
      "<RequireAuth>",

    label:
      "Protected cloud poems route",
  },

  {
    file:
        "../../packages/api-client/src/createApiClient.ts",

      pattern:
        "Authorization",

    label:
      "Authenticated poem requests",
  },
];

let failed =
  false;

console.log("");
console.log(
  "MATN QUIZ POEM CLOUD AUDIT",
);

console.log(
  "==========================",
);

for (
  const check of checks
) {
  if (
    !existsSync(
      check.file,
    )
  ) {
    console.error(
      `MISS ${check.label}: ${check.file}`,
    );

    failed =
      true;

    continue;
  }

  const content =
    readFileSync(
      check.file,
      "utf8",
    );

  if (
    content.includes(
      check.pattern,
    )
  ) {
    console.log(
      `OK   ${check.label}`,
    );
  } else {
    console.error(
      `MISS ${check.label}`,
    );

    failed =
      true;
  }
}

if (failed) {
  process.exitCode =
    1;
} else {
  console.log("");
  console.log(
    "P2-M6 POEM API + CLOUD SYNC AUDIT PASSED",
  );
}
