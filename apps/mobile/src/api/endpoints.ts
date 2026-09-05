import {
  API_ENV,
} from "../config/env";

export const apiEndpoints = {
  health:
    API_ENV.healthPath,

  auth: {
    login:
      "/auth/login",

    register:
      "/auth/register",

    refresh:
      "/auth/refresh",

    logout:
      "/auth/logout",

    me:
      "/auth/me",
  },

  quizzes:
    "/quizzes",

  history:
    "/history",

  poems:
    "/poems",

  books:
    "/books",

  uploads:
    "/uploads",

  tts:
    "/tts",
} as const;