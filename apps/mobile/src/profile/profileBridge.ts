import {
  useAuthStore,
} from "../store/authStore";

import {
  useProfileStore,
} from "../store/profileStore";

let previousStatus =
  useAuthStore
    .getState()
    .status;

useAuthStore.subscribe(
  (
    state,
  ) => {
    const currentStatus =
      state.status;

    if (
      currentStatus ===
        "authenticated" &&
      previousStatus !==
        "authenticated"
    ) {
      void useProfileStore
        .getState()
        .refreshProfile();
    }

    if (
      currentStatus ===
        "anonymous" &&
      previousStatus !==
        "anonymous"
    ) {
      useProfileStore
        .getState()
        .reset();
    }

    previousStatus =
      currentStatus;
  },
);

if (
  previousStatus ===
  "authenticated"
) {
  void useProfileStore
    .getState()
    .refreshProfile();
}