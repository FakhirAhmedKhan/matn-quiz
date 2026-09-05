import { existsSync, readFileSync } from "node:fs";

const checks = [
  {
    file: "src/book-api/bookApi.ts",

    pattern: "getBooks",

    label: "Book list API",
  },

  {
    file: "src/book-api/bookApi.ts",

    pattern: "getBook",

    label: "Book detail API",
  },

  {
    file: "src/book-api/bookApi.ts",

    pattern: "createBook",

    label: "Book create API",
  },

  {
    file: "src/book-api/bookApi.ts",

    pattern: "updateBook",

    label: "Book update API",
  },

  {
    file: "src/book-api/bookApi.ts",

    pattern: "setFavorite",

    label: "Book favorite API",
  },

  {
    file: "src/book-api/bookApi.ts",

    pattern: "saveProgress",

    label: "Book progress API",
  },

  {
    file: "src/book-api/bookApi.ts",

    pattern: "deleteBook",

    label: "Book delete API",
  },

  {
    file: "src/book-api/bookResponse.ts",

    pattern: "normalizeBookPage",

    label: "Book pagination normalization",
  },

  {
    file: "src/book-api/bookAdapter.ts",

    pattern: "createRemoteBookFromLocalStore",

    label: "Local book cloud adapter",
  },

  {
    file: "src/store/bookCloudStore.ts",

    pattern: "toggleFavorite",

    label: "Favorite synchronization",
  },

  {
    file: "src/store/bookCloudStore.ts",

    pattern: "saveSelectedProgress",

    label: "Reader progress synchronization",
  },

  {
    file: "src/store/bookCloudStore.ts",

    pattern: "loadMore",

    label: "Cloud book pagination",
  },

  {
    file: "src/book-api/bookBridge.ts",

    pattern: "useAuthStore.subscribe",

    label: "Logout book cleanup",
  },

  {
    file: "app/cloud-books.tsx",

    pattern: "<RequireAuth>",

    label: "Protected cloud books route",
  },

  {
    file: "../../packages/api-client/src/createApiClient.ts",

    pattern: "Authorization",

    label: "Authenticated book requests",
  },
];

let failed = false;

console.log("");
console.log("MATN QUIZ BOOK CLOUD AUDIT");

console.log("==========================");

for (const check of checks) {
  if (!existsSync(check.file)) {
    console.error(`MISS ${check.label}: ${check.file}`);

    failed = true;

    continue;
  }

  const content = readFileSync(check.file, "utf8");

  if (content.includes(check.pattern)) {
    console.log(`OK   ${check.label}`);
  } else {
    console.error(`MISS ${check.label}`);

    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("");
  console.log("P2-M7 BOOKS API + CLOUD LIBRARY SYNC AUDIT PASSED");
}
