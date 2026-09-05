import {
  useAuthStore,
} from "../store/authStore";

import {
  useTtsCloudStore,
} from "../store/ttsCloudStore";

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
      useTtsCloudStore
        .getState()
        .reset();
    }

    previousStatus =
      currentStatus;
  },
);