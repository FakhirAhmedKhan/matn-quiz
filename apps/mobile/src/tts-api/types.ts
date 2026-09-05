export type TtsSpeed =
  | 0.75
  | 1
  | 1.25
  | 1.5;

export type TtsRepeat =
  | 1
  | 2
  | 3
  | "INFINITE";

export type TtsVoice = {
  id:
    string;

  name:
    string;

  language:
    string | null;

  gender:
    string | null;

  provider:
    string | null;
};

export type GenerateTtsInput = {
  text:
    string;

  language?:
    string;

  voiceId?:
    string;

  speed?:
    TtsSpeed;

  format?:
    string;
};

export type GeneratedTtsAudio = {
  id:
    string;

  audioUrl:
    string;

  text:
    string;

  language:
    string | null;

  voiceId:
    string | null;

  speed:
    TtsSpeed;

  format:
    string;

  durationSeconds:
    number | null;

  contentType:
    string | null;

  createdAt:
    string | null;

  expiresAt:
    string | null;

  serverCached:
    boolean;
};

export type TtsCloudStatus =
  | "idle"
  | "loading-voices"
  | "generating"
  | "ready"
  | "error";