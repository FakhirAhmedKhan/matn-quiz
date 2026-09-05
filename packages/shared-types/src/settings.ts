import type {
  QuizMethod,
} from "./quiz";

import type {
  AudioRepeatMode,
  AudioSpeed,
} from "./audio";

export type ReaderFontSizePreference =
  | "SMALL"
  | "MEDIUM"
  | "LARGE";

export type PoemReaderModePreference =
  | "FOCUS"
  | "ALL";

export type BookReaderModePreference =
  | "READING"
  | "FOCUS";

export type AppSettings = {
  defaultQuizMethod: QuizMethod;

  defaultHideCount: number;

  readerFontSize:
    ReaderFontSizePreference;

  defaultPoemReaderMode:
    PoemReaderModePreference;

  defaultBookReaderMode:
    BookReaderModePreference;

  defaultAudioSpeed:
    AudioSpeed;

  defaultAudioRepeat:
    AudioRepeatMode;
};