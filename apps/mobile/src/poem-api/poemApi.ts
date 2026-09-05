import {
  apiClient,
} from "../api/apiClient";

import {
  POEM_API_CONFIG,
  poemDeletePath,
  poemDetailPath,
  poemProgressPath,
  poemUpdatePath,
} from "./poemApiConfig";

import {
  normalizePoemPage,
  normalizeRemotePoem,
} from "./poemResponse";

import type {
  CreateRemotePoemInput,
  PoemPage,
  PoemQuery,
  RemotePoem,
  SavePoemProgressInput,
  UpdateRemotePoemInput,
} from "./types";

const DEFAULT_PAGE_SIZE =
  20;

export const poemApi = {
  async getPoems(
    query: PoemQuery = {},
  ): Promise<PoemPage> {
    const page =
      Math.max(
        1,
        Math.floor(
          query.page ??
          1,
        ),
      );

    const pageSize =
      Math.max(
        1,
        Math.min(
          100,
          Math.floor(
            query.pageSize ??
            DEFAULT_PAGE_SIZE,
          ),
        ),
      );

    const response =
      await apiClient.get<unknown>(
        POEM_API_CONFIG.listPath,
        {
          query: {
            page,
            pageSize,
            search:
              query.search,
          },

          retries:
            0,
        },
      );

    return normalizePoemPage(
      response,
      page,
      pageSize,
    );
  },

  async getPoem(
    poemId: string,
  ): Promise<RemotePoem> {
    const response =
      await apiClient.get<unknown>(
        poemDetailPath(
          poemId,
        ),
        {
          retries:
            0,
        },
      );

    return normalizeRemotePoem(
      response,
    );
  },

  async createPoem(
    input: CreateRemotePoemInput,
  ): Promise<RemotePoem> {
    const response =
      await apiClient.post<
        unknown,
        CreateRemotePoemInput
      >(
        POEM_API_CONFIG.createPath,
        input,
        {
          retries:
            0,
        },
      );

    return normalizeRemotePoem(
      response,
    );
  },

  async updatePoem(
    poemId: string,
    input: UpdateRemotePoemInput,
  ): Promise<RemotePoem> {
    const response =
      await apiClient.patch<
        unknown,
        UpdateRemotePoemInput
      >(
        poemUpdatePath(
          poemId,
        ),
        input,
        {
          retries:
            0,
        },
      );

    return normalizeRemotePoem(
      response,
    );
  },

  async saveProgress(
    poemId: string,
    input: SavePoemProgressInput,
  ): Promise<void> {
    await apiClient.patch<
      unknown,
      SavePoemProgressInput
    >(
      poemProgressPath(
        poemId,
      ),
      input,
      {
        retries:
          0,
      },
    );
  },

  async deletePoem(
    poemId: string,
  ): Promise<void> {
    await apiClient.delete<unknown>(
      poemDeletePath(
        poemId,
      ),
      {
        retries:
          0,
      },
    );
  },
};