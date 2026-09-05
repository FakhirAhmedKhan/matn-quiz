import {
  existsSync,
  readFileSync,
} from "node:fs";

const checks = [
  {
    file:
      "src/auth/authTokenStorage.ts",

    pattern:
      "expo-secure-store",

    label:
      "SecureStore",
  },

  {
    file:
      "src/auth/authTokenStorage.ts",

    pattern:
      "ACCESS_TOKEN_KEY",

    label:
      "Access token secure key",
  },

  {
    file:
      "src/auth/authTokenStorage.ts",

    pattern:
      "REFRESH_TOKEN_KEY",

    label:
      "Refresh token secure key",
  },

  {
    file:
      "src/api/apiClient.ts",

    pattern:
      "setApiRefreshHandler",

    label:
      "Automatic refresh hook",
  },

  {
    file:
      "../../packages/api-client/src/createApiClient.ts",

    pattern:
      /response\.status\s*===\s*401/,

    label:
      "401 handling",
  },

  {
    file:
      "src/store/authStore.ts",

    pattern:
      "refreshPromise",

    label:
      "Refresh concurrency lock",
  },

  {
    file:
      "src/auth/authBridge.ts",

    pattern:
      "setApiAccessTokenProvider",

    label:
      "Bearer token bridge",
  },

  {
    file:
      "app/auth/login.tsx",

    pattern:
      "secureTextEntry",

    label:
      "Secure password input",
  },
];

let failed =
  false;

console.log("");

console.log(
  "MATN QUIZ AUTH AUDIT",
);

console.log(
  "====================",
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

  const matched =
    check.pattern instanceof RegExp
      ? check.pattern.test(
          content,
        )
      : content.includes(
          check.pattern,
        );

  if (
    !matched
  ) {
    console.error(
      `MISS ${check.label}`,
    );

    failed =
      true;
  }
  else {
    console.log(
      `OK   ${check.label}`,
    );
  }
}

const tokenStorage =
  readFileSync(
    "src/auth/authTokenStorage.ts",
    "utf8",
  );

if (
  tokenStorage.includes(
    "@react-native-async-storage/async-storage",
  )
) {
  console.error(
    "FAIL Auth token storage uses AsyncStorage.",
  );

  failed =
    true;
}
else {
  console.log(
    "OK   Tokens are not stored in AsyncStorage",
  );
}

if (
  failed
) {
  process.exitCode =
    1;
}
else {
  console.log("");

  console.log(
    "P2-M2 AUTH SECURITY AUDIT PASSED",
  );
}
