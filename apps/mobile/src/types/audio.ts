export type AudioSourceKind =
  | "DEMO"
  | "QUIZ"
  | "POEM";

export type AudioSegmentMode =
  | "SENTENCE"
  | "VERSE";

export type AudioSpeed =
  | 0.75
  | 1
  | 1.25
  | 1.5;

export type AudioRepeatMode =
  | "ONE"
  | "TWO"
  | "THREE"
  | "INFINITE";

export type AudioSegment = {
  id: string;
  index: number;
  text: string;
};

export type AudioSource = {
  kind: AudioSourceKind;
  title: string;
  text: string;
  available: boolean;
};