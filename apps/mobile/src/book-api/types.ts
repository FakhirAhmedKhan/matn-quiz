export type BookReaderMode =
  | "READING"
  | "FOCUS";

export type RemoteBook = {
  id:
    string;

  title:
    string;

  author:
    string | null;

  description:
    string | null;

  language:
    string | null;

  pageCount:
    number;

  favorite:
    boolean;

  readerMode:
    BookReaderMode;

  currentPage:
    number;

  progressPercentage:
    number;

  coverUrl:
    string | null;

  fileUrl:
    string | null;

  sourceFileName:
    string | null;

  createdAt:
    string | null;

  updatedAt:
    string | null;

  lastReadAt:
    string | null;
};

export type CreateRemoteBookInput = {
  title:
    string;

  author?:
    string;

  description?:
    string;

  language?:
    string;

  pageCount?:
    number;

  sourceFileName?:
    string;
};

export type UpdateRemoteBookInput = {
  title?:
    string;

  author?:
    string | null;

  description?:
    string | null;

  language?:
    string | null;

  pageCount?:
    number;
};

export type SaveBookProgressInput = {
  currentPage:
    number;

  readerMode:
    BookReaderMode;

  progressPercentage:
    number;
};

export type SetFavoriteInput = {
  favorite:
    boolean;
};

export type BookPage = {
  items:
    RemoteBook[];

  total:
    number;

  page:
    number;

  pageSize:
    number;

  hasMore:
    boolean;
};

export type BookQuery = {
  page?:
    number;

  pageSize?:
    number;

  search?:
    string;

  favorite?:
    boolean;
};

export type BookCloudStatus =
  | "idle"
  | "loading"
  | "refreshing"
  | "loading-more"
  | "loading-detail"
  | "creating"
  | "updating"
  | "saving-progress"
  | "saving-favorite"
  | "deleting"
  | "ready"
  | "error";