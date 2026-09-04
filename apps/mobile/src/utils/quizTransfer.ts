import type {
  QuizMethod,
} from "../types/quiz";
import {
  QUIZ_TRANSFER_SCHEMA,
  QUIZ_TRANSFER_VERSION,
  type QuizTransferDocument,
  type QuizTransferParseResult,
} from "../types/transfer";
import {
  getArabicInputStats,
  validateArabicInput,
} from "./arabicInput";
import {
  getMaximumHideCount,
} from "./quizSetup";

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isQuizMethod(
  value: unknown,
): value is QuizMethod {
  return (
    value === "HIDE_WORD" ||
    value === "HIDE_LINE"
  );
}

export function buildQuizTransferDocument(
  text: string,
  method: QuizMethod,
  hideCount: number,
): QuizTransferDocument {
  return {
    schema:
      QUIZ_TRANSFER_SCHEMA,

    version:
      QUIZ_TRANSFER_VERSION,

    exportedAt:
      new Date().toISOString(),

    draft: {
      text,
      method,
      hideCount,
    },
  };
}

export function serializeQuizTransfer(
  document: QuizTransferDocument,
): string {
  return JSON.stringify(
    document,
    null,
    2,
  );
}

export function parseQuizTransferJson(
  raw: string,
): QuizTransferParseResult {
  const trimmed =
    raw.trim();

  if (!trimmed) {
    return {
      valid: false,
      document: null,
      message:
        "Paste exported Matn Quiz JSON to preview it.",
    };
  }

  let parsed: unknown;

  try {
    parsed =
      JSON.parse(trimmed);
  } catch {
    return {
      valid: false,
      document: null,
      message:
        "This is not valid JSON.",
    };
  }

  if (!isRecord(parsed)) {
    return {
      valid: false,
      document: null,
      message:
        "The imported JSON must be an object.",
    };
  }

  if (
    parsed.schema !==
    QUIZ_TRANSFER_SCHEMA
  ) {
    return {
      valid: false,
      document: null,
      message:
        "This file is not a Matn Quiz draft export.",
    };
  }

  if (
    parsed.version !==
    QUIZ_TRANSFER_VERSION
  ) {
    return {
      valid: false,
      document: null,
      message:
        `Unsupported export version. Expected version ${QUIZ_TRANSFER_VERSION}.`,
    };
  }

  if (
    typeof parsed.exportedAt !==
    "string"
  ) {
    return {
      valid: false,
      document: null,
      message:
        "Export timestamp is missing.",
    };
  }

  if (!isRecord(parsed.draft)) {
    return {
      valid: false,
      document: null,
      message:
        "Quiz draft data is missing.",
    };
  }

  const text =
    parsed.draft.text;

  const method =
    parsed.draft.method;

  const hideCount =
    parsed.draft.hideCount;

  if (typeof text !== "string") {
    return {
      valid: false,
      document: null,
      message:
        "Imported quiz text must be a string.",
    };
  }

  if (!isQuizMethod(method)) {
    return {
      valid: false,
      document: null,
      message:
        "Imported quiz method must be HIDE_WORD or HIDE_LINE.",
    };
  }

  if (
    typeof hideCount !== "number" ||
    !Number.isInteger(hideCount) ||
    hideCount < 1
  ) {
    return {
      valid: false,
      document: null,
      message:
        "Imported hide count must be a positive whole number.",
    };
  }

  const validation =
    validateArabicInput(text);

  if (!validation.valid) {
    return {
      valid: false,
      document: null,
      message:
        `Imported Arabic text is invalid: ${validation.message}`,
    };
  }

  const stats =
    getArabicInputStats(text);

  const maximum =
    getMaximumHideCount(
      method,
      stats.words,
      stats.lines,
    );

  if (maximum < 1) {
    return {
      valid: false,
      document: null,
      message:
        "The selected method cannot be used with this imported text.",
    };
  }

  if (hideCount > maximum) {
    return {
      valid: false,
      document: null,
      message:
        `Hide count ${hideCount} exceeds the available maximum of ${maximum}.`,
    };
  }

  const document: QuizTransferDocument = {
    schema:
      QUIZ_TRANSFER_SCHEMA,

    version:
      QUIZ_TRANSFER_VERSION,

    exportedAt:
      parsed.exportedAt,

    draft: {
      text,
      method,
      hideCount,
    },
  };

  return {
    valid: true,
    document,
    message:
      "Valid Matn Quiz draft. Ready to import.",
  };
}

export function createDemoImportJson(): string {
  const document =
    buildQuizTransferDocument(
      `إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى
فمن كانت هجرته إلى الله ورسوله
فهجرته إلى الله ورسوله`,
      "HIDE_LINE",
      2,
    );

  return serializeQuizTransfer(
    document,
  );
}