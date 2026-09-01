export const ARABIC_UNICODE_REGEX = /[\u0600-\u06FF]/;

export function containsArabicText(value: string): boolean {
  return ARABIC_UNICODE_REGEX.test(value);
}

export function isEmptyText(value: string): boolean {
  return value.trim().length === 0;
}
