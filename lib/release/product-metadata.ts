export const PRODUCT_NAME = "Matn Quiz";

export const PRODUCT_SHORT_NAME = "Matn Quiz";

export const PRODUCT_TAGLINE =
  "Generate, review, save, import, export, and resume Quran and matn study quizzes.";

export const PRODUCT_DESCRIPTION =
  "Matn Quiz is a mobile-friendly Quran and Islamic matn quiz workspace for hiding words or lines, reviewing answers, saving history, sharing JSON, and resuming unfinished study sessions.";

export const PRODUCT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://matn-quiz.local";

export const PRODUCT_THEME_COLOR = "#047857";

export const PRODUCT_BACKGROUND_COLOR = "#f8fafc";

export const PRODUCT_KEYWORDS = [
  "Matn Quiz",
  "Quran quiz",
  "Arabic study",
  "Islamic matn",
  "memorization",
  "hide words",
  "hide lines",
  "study session",
  "review progress",
];

export const PRODUCT_FEATURES = [
  "Paste Quran or Islamic matn text",
  "Generate Hide Words quizzes",
  "Generate Hide Lines quizzes",
  "Reveal answers during study",
  "Mark answers correct or incorrect",
  "Save quiz history locally",
  "Import and export shareable JSON",
  "Resume unfinished study sessions",
  "Mobile-first responsive layout",
  "Accessible keyboard-friendly UI",
];

export const RELEASE_CHECKLIST_ITEMS = [
  "Metadata configured",
  "Manifest configured",
  "Robots route configured",
  "Sitemap route configured",
  "PWA icons available",
  "Not found page available",
  "Error boundary available",
  "README updated",
  "Release checklist available",
  "Production smoke script available",
  "Tests passing",
  "Lint passing",
  "Build passing",
];

export interface ReleaseChecklistItem {
  label: string;
  complete: boolean;
}

export function getCanonicalUrl(path = "/"): string {
  const cleanBase = PRODUCT_SITE_URL.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${cleanBase}${cleanPath === "/" ? "/" : cleanPath}`;
}

export function getProductTitle(pageTitle?: string): string {
  if (!pageTitle || pageTitle.trim().length === 0) {
    return PRODUCT_NAME;
  }

  return `${pageTitle} · ${PRODUCT_NAME}`;
}

export function getProductKeywordText(): string {
  return PRODUCT_KEYWORDS.join(", ");
}

export function createReleaseChecklist(
  completedLabels: string[] = RELEASE_CHECKLIST_ITEMS,
): ReleaseChecklistItem[] {
  const completed = new Set(completedLabels);

  return RELEASE_CHECKLIST_ITEMS.map((label) => ({
    label,
    complete: completed.has(label),
  }));
}

export function isReleaseChecklistComplete(
  items: ReleaseChecklistItem[],
): boolean {
  return items.length > 0 && items.every((item) => item.complete);
}

export function getReleaseReadinessSummary(
  items: ReleaseChecklistItem[],
): string {
  const complete = items.filter((item) => item.complete).length;

  return `${complete}/${items.length} release checks complete`;
}
