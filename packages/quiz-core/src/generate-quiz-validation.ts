import {
  HIDE_COUNT_MIN,
  isQuizMethod,
} from "./constants";
import { getAvailableHideCount } from "./hide-count";
import { containsArabicText } from "./arabic";
import type { GenerateQuizInput, QuizMethod } from "./types";

export type GenerateQuizValidationCode =
  | "EMPTY_TEXT"
  | "NO_ARABIC_TEXT"
  | "INVALID_METHOD"
  | "INVALID_HIDE_COUNT"
  | "HIDE_COUNT_TOO_LOW"
  | "HIDE_COUNT_TOO_HIGH"
  | "NO_HIDEABLE_CONTENT";

export type GenerateQuizValidationPath =
  | "text"
  | "method"
  | "hideCount"
  | "form";

export interface GenerateQuizValidationIssue {
  code: GenerateQuizValidationCode;
  path: GenerateQuizValidationPath;
  message: string;
}

export interface GenerateQuizValidationResult {
  valid: boolean;
  errors: GenerateQuizValidationIssue[];
  availableCount: number;
  method?: QuizMethod;
}

export type UnknownGenerateQuizInput = Partial<
  Record<keyof GenerateQuizInput, unknown>
>;

function createIssue(
  code: GenerateQuizValidationCode,
  path: GenerateQuizValidationPath,
  message: string,
): GenerateQuizValidationIssue {
  return {
    code,
    path,
    message,
  };
}

export function validateGenerateQuizInput(
  input: UnknownGenerateQuizInput,
): GenerateQuizValidationResult {
  const errors: GenerateQuizValidationIssue[] = [];

  const text = typeof input.text === "string" ? input.text : "";
  const method = isQuizMethod(input.method) ? input.method : undefined;
  const hideCount = input.hideCount;

  const hasUsableText = text.trim().length > 0;
  const hasArabicText = containsArabicText(text);

  if (!hasUsableText) {
    errors.push(
      createIssue(
        "EMPTY_TEXT",
        "text",
        "Paste Arabic Quran or matn text before generating a quiz.",
      ),
    );
  } else if (!hasArabicText) {
    errors.push(
      createIssue(
        "NO_ARABIC_TEXT",
        "text",
        "The text must contain Arabic content.",
      ),
    );
  }

  if (!method) {
    errors.push(
      createIssue(
        "INVALID_METHOD",
        "method",
        "Choose a valid quiz method.",
      ),
    );
  }

  if (typeof hideCount !== "number" || !Number.isFinite(hideCount)) {
    errors.push(
      createIssue(
        "INVALID_HIDE_COUNT",
        "hideCount",
        "Hide count must be a valid number.",
      ),
    );
  } else if (!Number.isInteger(hideCount)) {
    errors.push(
      createIssue(
        "INVALID_HIDE_COUNT",
        "hideCount",
        "Hide count must be a whole number.",
      ),
    );
  } else if (hideCount < HIDE_COUNT_MIN) {
    errors.push(
      createIssue(
        "HIDE_COUNT_TOO_LOW",
        "hideCount",
        `Hide count must be at least ${HIDE_COUNT_MIN}.`,
      ),
    );
  }

  let availableCount = 0;

  if (method && hasUsableText && hasArabicText) {
    availableCount = getAvailableHideCount(text, method);

    if (availableCount < HIDE_COUNT_MIN) {
      errors.push(
        createIssue(
          "NO_HIDEABLE_CONTENT",
          "form",
          "There is no content available to hide for the selected method.",
        ),
      );
    }

    if (
      typeof hideCount === "number" &&
      Number.isInteger(hideCount) &&
      Number.isFinite(hideCount) &&
      hideCount >= HIDE_COUNT_MIN &&
      hideCount > availableCount
    ) {
      errors.push(
        createIssue(
          "HIDE_COUNT_TOO_HIGH",
          "hideCount",
          `Hide count cannot be greater than ${availableCount}.`,
        ),
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    availableCount,
    method,
  };
}

export function getGenerateQuizInputError(
  input: UnknownGenerateQuizInput,
): string | undefined {
  return validateGenerateQuizInput(input).errors[0]?.message;
}

export class GenerateQuizValidationError extends Error {
  readonly issues: GenerateQuizValidationIssue[];

  constructor(issues: GenerateQuizValidationIssue[]) {
    super(issues[0]?.message ?? "Invalid quiz generation input.");

    this.name = "GenerateQuizValidationError";
    this.issues = issues;
  }
}

export function assertValidGenerateQuizInput(
  input: UnknownGenerateQuizInput,
): asserts input is GenerateQuizInput {
  const validation = validateGenerateQuizInput(input);

  if (!validation.valid) {
    throw new GenerateQuizValidationError(validation.errors);
  }
}
