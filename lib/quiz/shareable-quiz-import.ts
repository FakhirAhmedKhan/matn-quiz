import {
  isShareableQuizMetadata,
  SHAREABLE_QUIZ_APP_ID,
  SHAREABLE_QUIZ_VERSION,
  type ShareableQuizDocument,
} from "@/lib/quiz/shareable-quiz";
import type { GeneratedQuiz } from "@/types/quiz";

export type ImportShareableQuizIssueCode =
  | "EMPTY_INPUT"
  | "INVALID_JSON"
  | "INVALID_DOCUMENT"
  | "WRONG_APP"
  | "UNSUPPORTED_VERSION"
  | "INVALID_EXPORTED_AT"
  | "INVALID_METADATA"
  | "INVALID_QUIZ"
  | "INVALID_QUIZ_METHOD"
  | "INVALID_QUIZ_TEXT"
  | "INVALID_QUIZ_COUNTS"
  | "INVALID_SELECTED_TOKENS"
  | "INVALID_SELECTED_LINES"
  | "INVALID_ANSWERS"
  | "INVALID_ANSWER";

export interface ImportShareableQuizIssue {
  code: ImportShareableQuizIssueCode;
  message: string;
  path: string;
}

export interface ImportShareableQuizValidationSuccess {
  valid: true;
  document: ShareableQuizDocument;
  quiz: GeneratedQuiz;
  issues: [];
}

export interface ImportShareableQuizValidationFailure {
  valid: false;
  document: null;
  quiz: null;
  issues: ImportShareableQuizIssue[];
}

export type ImportShareableQuizValidationResult =
  | ImportShareableQuizValidationSuccess
  | ImportShareableQuizValidationFailure;

export class ImportShareableQuizValidationError extends Error {
  readonly issues: ImportShareableQuizIssue[];

  constructor(issues: ImportShareableQuizIssue[]) {
    super(
      issues[0]?.message ??
        "Imported quiz JSON is invalid and cannot be opened.",
    );

    this.name = "ImportShareableQuizValidationError";
    this.issues = issues;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function createIssue(
  code: ImportShareableQuizIssueCode,
  message: string,
  path: string,
): ImportShareableQuizIssue {
  return {
    code,
    message,
    path,
  };
}

function validateImportedQuizAnswer(
  value: unknown,
  method: unknown,
  path: string,
): ImportShareableQuizIssue[] {
  const issues: ImportShareableQuizIssue[] = [];

  if (!isObject(value)) {
    return [
      createIssue(
        "INVALID_ANSWER",
        "Each imported answer must be an object.",
        path,
      ),
    ];
  }

  if (!isFiniteNumber(value.index) || value.index < 1) {
    issues.push(
      createIssue(
        "INVALID_ANSWER",
        "Each imported answer must have a valid index.",
        `${path}.index`,
      ),
    );
  }

  if (!isFiniteNumber(value.tokenIndex) || value.tokenIndex < 0) {
    issues.push(
      createIssue(
        "INVALID_ANSWER",
        "Each imported answer must have a valid token index.",
        `${path}.tokenIndex`,
      ),
    );
  }

  if (typeof value.answer !== "string" || value.answer.trim().length === 0) {
    issues.push(
      createIssue(
        "INVALID_ANSWER",
        "Each imported answer must contain answer text.",
        `${path}.answer`,
      ),
    );
  }

  if (method === "HIDE_WORD") {
    if (value.kind !== "word") {
      issues.push(
        createIssue(
          "INVALID_ANSWER",
          "Hide Words imports must contain word answers.",
          `${path}.kind`,
        ),
      );
    }

    if (!isFiniteNumber(value.wordIndex) || value.wordIndex < 0) {
      issues.push(
        createIssue(
          "INVALID_ANSWER",
          "Word answers must contain a valid word index.",
          `${path}.wordIndex`,
        ),
      );
    }
  }

  if (method === "HIDE_LINE") {
    if (value.kind !== "line") {
      issues.push(
        createIssue(
          "INVALID_ANSWER",
          "Hide Lines imports must contain line answers.",
          `${path}.kind`,
        ),
      );
    }

    if (!isFiniteNumber(value.lineIndex) || value.lineIndex < 0) {
      issues.push(
        createIssue(
          "INVALID_ANSWER",
          "Line answers must contain a valid line index.",
          `${path}.lineIndex`,
        ),
      );
    }
  }

  return issues;
}

export function validateImportedGeneratedQuiz(
  value: unknown,
  path = "quiz",
): ImportShareableQuizIssue[] {
  const issues: ImportShareableQuizIssue[] = [];

  if (!isObject(value)) {
    return [
      createIssue(
        "INVALID_QUIZ",
        "Imported quiz payload is missing or invalid.",
        path,
      ),
    ];
  }

  if (value.method !== "HIDE_WORD" && value.method !== "HIDE_LINE") {
    issues.push(
      createIssue(
        "INVALID_QUIZ_METHOD",
        "Imported quiz method must be Hide Words or Hide Lines.",
        `${path}.method`,
      ),
    );
  }

  if (
    typeof value.originalText !== "string" ||
    value.originalText.trim().length === 0
  ) {
    issues.push(
      createIssue(
        "INVALID_QUIZ_TEXT",
        "Imported quiz must contain original Arabic text.",
        `${path}.originalText`,
      ),
    );
  }

  if (typeof value.quizText !== "string" || value.quizText.trim().length === 0) {
    issues.push(
      createIssue(
        "INVALID_QUIZ_TEXT",
        "Imported quiz must contain generated quiz text.",
        `${path}.quizText`,
      ),
    );
  }

  if (
    !isFiniteNumber(value.requestedCount) ||
    value.requestedCount < 1 ||
    !isFiniteNumber(value.hiddenCount) ||
    value.hiddenCount < 1
  ) {
    issues.push(
      createIssue(
        "INVALID_QUIZ_COUNTS",
        "Imported quiz must contain valid requested and hidden counts.",
        `${path}.hiddenCount`,
      ),
    );
  }

  if (
    !Array.isArray(value.selectedTokenIndexes) ||
    !value.selectedTokenIndexes.every(
      (tokenIndex) => isFiniteNumber(tokenIndex) && tokenIndex >= 0,
    )
  ) {
    issues.push(
      createIssue(
        "INVALID_SELECTED_TOKENS",
        "Imported quiz must contain valid selected token indexes.",
        `${path}.selectedTokenIndexes`,
      ),
    );
  }

  if (value.method === "HIDE_LINE") {
    if (
      !Array.isArray(value.selectedLineIndexes) ||
      !value.selectedLineIndexes.every(
        (lineIndex) => isFiniteNumber(lineIndex) && lineIndex >= 0,
      )
    ) {
      issues.push(
        createIssue(
          "INVALID_SELECTED_LINES",
          "Hide Lines imports must contain valid selected line indexes.",
          `${path}.selectedLineIndexes`,
        ),
      );
    }
  }

  if (!Array.isArray(value.answers) || value.answers.length === 0) {
    issues.push(
      createIssue(
        "INVALID_ANSWERS",
        "Imported quiz must contain at least one answer.",
        `${path}.answers`,
      ),
    );
  } else {
    value.answers.forEach((answer, index) => {
      issues.push(
        ...validateImportedQuizAnswer(
          answer,
          value.method,
          `${path}.answers.${index}`,
        ),
      );
    });

    if (
      isFiniteNumber(value.hiddenCount) &&
      value.hiddenCount >= 1 &&
      value.answers.length !== value.hiddenCount
    ) {
      issues.push(
        createIssue(
          "INVALID_ANSWERS",
          "Imported quiz answer count must match hidden count.",
          `${path}.answers`,
        ),
      );
    }
  }

  return issues;
}

export function validateImportedShareableQuizValue(
  value: unknown,
): ImportShareableQuizValidationResult {
  const issues: ImportShareableQuizIssue[] = [];

  if (!isObject(value)) {
    return {
      valid: false,
      document: null,
      quiz: null,
      issues: [
        createIssue(
          "INVALID_DOCUMENT",
          "Imported JSON must be a Matn Quiz export object.",
          "root",
        ),
      ],
    };
  }

  if (value.appId !== SHAREABLE_QUIZ_APP_ID) {
    issues.push(
      createIssue(
        "WRONG_APP",
        "Imported JSON was not exported from Matn Quiz.",
        "appId",
      ),
    );
  }

  if (value.version !== SHAREABLE_QUIZ_VERSION) {
    issues.push(
      createIssue(
        "UNSUPPORTED_VERSION",
        "Imported quiz version is not supported.",
        "version",
      ),
    );
  }

  if (typeof value.exportedAt !== "string" || value.exportedAt.length === 0) {
    issues.push(
      createIssue(
        "INVALID_EXPORTED_AT",
        "Imported quiz must contain an export date.",
        "exportedAt",
      ),
    );
  }

  if (!isShareableQuizMetadata(value.metadata)) {
    issues.push(
      createIssue(
        "INVALID_METADATA",
        "Imported quiz metadata is invalid.",
        "metadata",
      ),
    );
  }

  issues.push(...validateImportedGeneratedQuiz(value.quiz, "quiz"));

  if (issues.length > 0) {
    return {
      valid: false,
      document: null,
      quiz: null,
      issues,
    };
  }

  const document = value as ShareableQuizDocument;

  return {
    valid: true,
    document,
    quiz: document.quiz,
    issues: [],
  };
}

export function validateImportedShareableQuizText(
  value: string | null | undefined,
): ImportShareableQuizValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      valid: false,
      document: null,
      quiz: null,
      issues: [
        createIssue(
          "EMPTY_INPUT",
          "Paste or choose a Matn Quiz JSON file before importing.",
          "root",
        ),
      ],
    };
  }

  try {
    const parsed: unknown = JSON.parse(value);

    return validateImportedShareableQuizValue(parsed);
  } catch {
    return {
      valid: false,
      document: null,
      quiz: null,
      issues: [
        createIssue(
          "INVALID_JSON",
          "Imported file is not valid JSON.",
          "root",
        ),
      ],
    };
  }
}

export function getImportShareableQuizErrorMessage(
  result: ImportShareableQuizValidationResult,
): string | undefined {
  return result.valid ? undefined : result.issues[0]?.message;
}

export function getImportShareableQuizIssueSummary(
  issues: ImportShareableQuizIssue[],
): string {
  if (issues.length === 0) {
    return "No import issues found.";
  }

  if (issues.length === 1) {
    return issues[0]?.message ?? "Imported quiz is invalid.";
  }

  return `${issues[0]?.message ?? "Imported quiz is invalid."} + ${
    issues.length - 1
  } more issue${issues.length === 2 ? "" : "s"}.`;
}

export function assertValidImportedShareableQuizText(
  value: string | null | undefined,
): ShareableQuizDocument {
  const result = validateImportedShareableQuizText(value);

  if (!result.valid) {
    throw new ImportShareableQuizValidationError(result.issues);
  }

  return result.document;
}

export function extractImportedQuizFromText(
  value: string | null | undefined,
): GeneratedQuiz | null {
  const result = validateImportedShareableQuizText(value);

  return result.valid ? result.quiz : null;
}
