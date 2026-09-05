import {
  existsSync,
  readFileSync,
} from "node:fs";

const checks = [
  {
    file:
      "src/profile/profileApi.ts",

    pattern:
      "getProfile",

    label:
      "Profile fetch",
  },

  {
    file:
      "src/profile/profileApi.ts",

    pattern:
      "updateProfile",

    label:
      "Profile update",
  },

  {
    file:
      "src/profile/profileApi.ts",

    pattern:
      "getPreferences",

    label:
      "Preferences download",
  },

  {
    file:
      "src/profile/profileApi.ts",

    pattern:
      "updatePreferences",

    label:
      "Preferences upload",
  },

  {
    file:
      "src/store/profileStore.ts",

    pattern:
      "syncAuthUser",

    label:
      "Auth/profile synchronization",
  },

  {
    file:
      "src/profile/accountPreferences.ts",

    pattern:
      "useSettingsStore.setState",

    label:
      "Remote settings application",
  },

  {
    file:
      "src/profile/profileBridge.ts",

    pattern:
      "useAuthStore.subscribe",

    label:
      "Authentication lifecycle bridge",
  },

  {
    file:
      "app/profile.tsx",

    pattern:
      "<RequireAuth>",

    label:
      "Protected profile route",
  },

  {
    file:
      "src/auth/authTokenStorage.ts",

    pattern:
      "expo-secure-store",

    label:
      "Secure token storage",
  },
];

let failed =
  false;

console.log("");
console.log(
  "MATN QUIZ PROFILE AUDIT",
);

console.log(
  "=======================",
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

if (
  existsSync(
    "src/auth/authTokenStorage.ts",
  )
) {
  const authStorage =
    readFileSync(
      "src/auth/authTokenStorage.ts",
      "utf8",
    );

  if (
    authStorage.includes(
      "@react-native-async-storage/async-storage",
    )
  ) {
    console.error(
      "FAIL Auth tokens must not use AsyncStorage.",
    );

    failed =
      true;
  } else {
    console.log(
      "OK   Auth tokens remain outside AsyncStorage",
    );
  }
}

if (failed) {
  process.exitCode =
    1;
} else {
  console.log("");
  console.log(
    "P2-M3 PROFILE + ACCOUNT SYNC AUDIT PASSED",
  );
}