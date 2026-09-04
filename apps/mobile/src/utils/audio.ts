import type {
  AudioRepeatMode,
  AudioSegment,
  AudioSegmentMode,
  AudioSource,
  AudioSpeed,
} from "../types/audio";

export const AUDIO_SPEEDS: AudioSpeed[] = [
  0.75,
  1,
  1.25,
  1.5,
];

export const AUDIO_REPEAT_OPTIONS: {
  value: AudioRepeatMode;
  label: string;
}[] = [
  {
    value: "ONE",
    label: "1×",
  },
  {
    value: "TWO",
    label: "2×",
  },
  {
    value: "THREE",
    label: "3×",
  },
  {
    value: "INFINITE",
    label: "∞",
  },
];

export function normalizeAudioText(
  text: string,
): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

export function splitAudioSegments(
  text: string,
  mode: AudioSegmentMode,
): AudioSegment[] {
  const normalized =
    normalizeAudioText(text);

  if (!normalized) {
    return [];
  }

  const parts =
    mode === "VERSE"
      ? normalized
          .split("\n")
          .map((value) =>
            value.trim(),
          )
          .filter(Boolean)
      : normalized
          .replace(
            /\n+/g,
            " ",
          )
          .split(
            /(?<=[.!?؟؛])\s+/u,
          )
          .map((value) =>
            value.trim(),
          )
          .filter(Boolean);

  if (
    mode === "SENTENCE" &&
    parts.length === 1
  ) {
    const fallback =
      normalized
        .split("\n")
        .map((value) =>
          value.trim(),
        )
        .filter(Boolean);

    if (
      fallback.length > 1
    ) {
      return fallback.map(
        (value, index) => ({
          id:
            `sentence-${index}`,
          index,
          text:
            value,
        }),
      );
    }
  }

  return parts.map(
    (value, index) => ({
      id:
        `${
          mode === "VERSE"
            ? "verse"
            : "sentence"
        }-${index}`,

      index,

      text:
        value,
    }),
  );
}

export function getRepeatLimit(
  mode: AudioRepeatMode,
): number | null {
  switch (mode) {
    case "TWO":
      return 2;

    case "THREE":
      return 3;

    case "INFINITE":
      return null;

    default:
      return 1;
  }
}

export function formatAudioTime(
  milliseconds: number,
): string {
  const totalSeconds =
    Math.max(
      0,
      Math.floor(
        milliseconds /
          1000,
      ),
    );

  const minutes =
    Math.floor(
      totalSeconds / 60,
    );

  const seconds =
    String(
      totalSeconds % 60,
    ).padStart(
      2,
      "0",
    );

  return `${minutes}:${seconds}`;
}

export function estimateMockDurationMs(
  text: string,
  speed: AudioSpeed,
): number {
  const words =
    text
      .trim()
      .split(/\s+/u)
      .filter(Boolean)
      .length;

  const base =
    Math.max(
      2400,
      words * 650,
    );

  return Math.round(
    base / speed,
  );
}

export function buildAudioSources(
  quizText: string,
  poemText: string,
  poemTitle: string,
): AudioSource[] {
  return [
    {
      kind:
        "DEMO",

      title:
        "Demo Arabic",

      text:
        `إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.
العلم نور في القلوب، وبالمراجعة يثبت الحفظ.
اقرأ النص بهدوء ثم حاول استرجاعه من الذاكرة.`,

      available:
        true,
    },
    {
      kind:
        "QUIZ",

      title:
        "Current Quiz",

      text:
        quizText,

      available:
        Boolean(
          quizText.trim(),
        ),
    },
    {
      kind:
        "POEM",

      title:
        poemTitle.trim() ||
        "Current Poem",

      text:
        poemText,

      available:
        Boolean(
          poemText.trim(),
        ),
    },
  ];
}