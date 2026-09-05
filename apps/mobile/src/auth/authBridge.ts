import {
  setApiAccessTokenProvider,
  setApiRefreshHandler,
  setApiUnauthorizedHandler,
} from "../api/apiClient";

import {
  useAuthStore,
} from "../store/authStore";

import {
  authTokenStorage,
} from "./authTokenStorage";

setApiAccessTokenProvider(
  () =>
    authTokenStorage.getAccessToken(),
);

setApiRefreshHandler(
  () =>
    useAuthStore
      .getState()
      .refreshSession(),
);

setApiUnauthorizedHandler(
  () =>
    useAuthStore
      .getState()
      .handleUnauthorized(),
);

void useAuthStore
  .getState()
  .bootstrap();