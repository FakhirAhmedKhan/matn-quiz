import {
  useAuthStore,
} from "../store/authStore";

import {
  usePoemCloudStore,
} from "../store/poemCloudStore";

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
        "anonymous" &&
      previousStatus !==
        "anonymous"
    ) {
      usePoemCloudStore
        .getState()
        .reset();
    }

    previousStatus =
      currentStatus;
  },
);