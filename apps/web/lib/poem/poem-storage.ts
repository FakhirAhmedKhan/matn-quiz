import {
  getPoemDisplayTitle as getSharedPoemDisplayTitle,
  hasPoemText as hasSharedPoemText,
  splitPoemIntoColumns as splitSharedPoemIntoColumns,
  splitPoemLines as splitSharedPoemLines,
} from "@matn-quiz/content-core/poem";
export type PoemLayout = "SINGLE_COLUMN" | "TWO_COLUMN";
export type PoemDirection = "rtl" | "ltr";

export interface PoemDraft {
  title: string;
  text: string;
  layout: PoemLayout;
  direction: PoemDirection;
  fontSize: number;
  updatedAt: string;
}

export interface PoemColumns {
  rightColumn: string[];
  leftColumn: string[];
}

export const POEM_STORAGE_KEY = "matn-quiz:poem-draft";

export const DEFAULT_POEM_DRAFT: PoemDraft = {
  title: "",
  text: "",
  layout: "TWO_COLUMN",
  direction: "rtl",
  fontSize: 28,
  updatedAt: "",
};

const MIN_FONT_SIZE = 18;
const MAX_FONT_SIZE = 48;

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function clampFontSize(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_POEM_DRAFT.fontSize;
  }

  return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Math.round(parsed)));
}

function normalizePoemDraft(value: Partial<PoemDraft> | null | undefined): PoemDraft {
  const layout =
    value?.layout === "SINGLE_COLUMN" || value?.layout === "TWO_COLUMN"
      ? value.layout
      : DEFAULT_POEM_DRAFT.layout;

  const direction =
    value?.direction === "ltr" || value?.direction === "rtl"
      ? value.direction
      : DEFAULT_POEM_DRAFT.direction;

  return {
    title: typeof value?.title === "string" ? value.title : "",
    text: typeof value?.text === "string" ? value.text : "",
    layout,
    direction,
    fontSize: clampFontSize(value?.fontSize),
    updatedAt:
      typeof value?.updatedAt === "string" && value.updatedAt.length > 0
        ? value.updatedAt
        : new Date(0).toISOString(),
  };
}

export function createPoemDraft(value: Partial<PoemDraft> = {}): PoemDraft {
  return normalizePoemDraft({
    ...DEFAULT_POEM_DRAFT,
    ...value,
    updatedAt: value.updatedAt ?? new Date().toISOString(),
  });
}

export function loadPoemDraft(): PoemDraft {
  if (!canUseBrowserStorage()) {
    return createPoemDraft(DEFAULT_POEM_DRAFT);
  }

  const raw = window.localStorage.getItem(POEM_STORAGE_KEY);

  if (!raw) {
    return createPoemDraft(DEFAULT_POEM_DRAFT);
  }

  try {
    return normalizePoemDraft(JSON.parse(raw) as Partial<PoemDraft>);
  } catch {
    window.localStorage.removeItem(POEM_STORAGE_KEY);
    return createPoemDraft(DEFAULT_POEM_DRAFT);
  }
}

export function savePoemDraft(draft: Partial<PoemDraft>): PoemDraft {
  const normalized = createPoemDraft({
    ...loadPoemDraft(),
    ...draft,
    updatedAt: new Date().toISOString(),
  });

  if (canUseBrowserStorage()) {
    window.localStorage.setItem(POEM_STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

export function updatePoemTitle(title: string): PoemDraft {
  return savePoemDraft({ title });
}

export function updatePoemText(text: string): PoemDraft {
  return savePoemDraft({ text });
}

export function updatePoemLayout(layout: PoemLayout): PoemDraft {
  return savePoemDraft({ layout });
}

export function updatePoemFontSize(fontSize: number): PoemDraft {
  return savePoemDraft({ fontSize });
}

export function clearPoemDraft(): PoemDraft {
  if (canUseBrowserStorage()) {
    window.localStorage.removeItem(POEM_STORAGE_KEY);
  }

  return createPoemDraft(DEFAULT_POEM_DRAFT);
}

export function hasPoemText(
  draft: PoemDraft,
): boolean {
  return hasSharedPoemText(
    draft,
  );
}

export function getPoemDisplayTitle(
  draft: PoemDraft,
): string {
  return getSharedPoemDisplayTitle(
    draft,
  );
}

export function splitPoemLines(
  text: string,
): string[] {
  return splitSharedPoemLines(
    text,
  );
}

export function splitPoemIntoColumns(
  text: string,
): PoemColumns {
  return splitSharedPoemIntoColumns(
    text,
  );
}
