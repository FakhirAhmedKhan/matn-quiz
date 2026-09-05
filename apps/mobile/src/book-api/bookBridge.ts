import {
  useAuthStore,
} from "../store/authStore";

import {
  useBookCloudStore,
} from "../store/bookCloudStore";

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
      useBookCloudStore
        .getState()
        .reset();
    }

    previousStatus =
      currentStatus;
  },
);