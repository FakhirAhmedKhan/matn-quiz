import type {
  QuizMethod,
} from "./quiz";

export const QUIZ_TRANSFER_SCHEMA =
  "matn-quiz-draft" as const;

export const QUIZ_TRANSFER_VERSION =
  1 as const;

export type QuizTransferDraft = {
  text: string;
  method: QuizMethod;
  hideCount: number;
};

export type QuizTransferDocument = {
  schema: typeof QUIZ_TRANSFER_SCHEMA;
  version: typeof QUIZ_TRANSFER_VERSION;
  exportedAt: string;
  draft: QuizTransferDraft;
};

export type QuizTransferParseSuccess = {
  valid: true;
  document: QuizTransferDocument;
  message: string;
};

export type QuizTransferParseFailure = {
  valid: false;
  document: null;
  message: string;
};

export type QuizTransferParseResult =
  | QuizTransferParseSuccess
  | QuizTransferParseFailure;