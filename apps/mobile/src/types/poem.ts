export type PoemDraft = {
  title: string;
  text: string;
  updatedAt: string | null;
};

export type PoemStats = {
  characters: number;
  arabicCharacters: number;
  words: number;
  verses: number;
  lines: number;
  stanzas: number;
};

export type PoemValidation = {
  valid: boolean;
  titleValid: boolean;
  textValid: boolean;
  message: string;
};