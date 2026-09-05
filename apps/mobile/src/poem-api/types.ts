export type PoemReaderMode =
  | "FOCUS"
  | "ALL";

export type RemotePoem = {
  id:
    string;

  title:
    string;

  text:
    string;

  author:
    string | null;

  language:
    string | null;

  lineCount:
    number;

  readerMode:
    PoemReaderMode;

  currentLineIndex:
    number;

  progressPercentage:
    number;

  createdAt:
    string | null;

  updatedAt:
    string | null;

  lastReadAt:
    string | null;
};

export type CreateRemotePoemInput = {
  title:
    string;

  text:
    string;

  author?:
    string;

  language?:
    string;
};

export type UpdateRemotePoemInput = {
  title?:
    string;

  text?:
    string;

  author?:
    string | null;

  language?:
    string | null;
};

export type SavePoemProgressInput = {
  currentLineIndex:
    number;

  readerMode:
    PoemReaderMode;

  progressPercentage:
    number;
};

export type PoemPage = {
  items:
    RemotePoem[];

  total:
    number;

  page:
    number;

  pageSize:
    number;

  hasMore:
    boolean;
};

export type PoemQuery = {
  page?:
    number;

  pageSize?:
    number;

  search?:
    string;
};

export type PoemCloudStatus =
  | "idle"
  | "loading"
  | "refreshing"
  | "loading-more"
  | "loading-detail"
  | "creating"
  | "updating"
  | "saving-progress"
  | "deleting"
  | "ready"
  | "error";