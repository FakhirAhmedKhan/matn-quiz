import type {
  QuizHistorySession,
  QuizHistoryStats,
} from "../types/history";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatHistoryDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Unknown date";
  }

  const day =
    date.getDate();

  const month =
    MONTHS[
      date.getMonth()
    ];

  const year =
    date.getFullYear();

  const hour =
    date.getHours();

  const minute =
    String(
      date.getMinutes(),
    ).padStart(2, "0");

  const displayHour =
    hour % 12 || 12;

  const period =
    hour >= 12
      ? "PM"
      : "AM";

  return `${day} ${month} ${year} · ${displayHour}:${minute} ${period}`;
}

export function calculateHistoryStats(
  sessions: QuizHistorySession[],
): QuizHistoryStats {
  if (
    sessions.length === 0
  ) {
    return {
      totalSessions: 0,
      averageScore: 0,
      bestScore: 0,
      totalAnswers: 0,
      correctAnswers: 0,
    };
  }

  const totalScore =
    sessions.reduce(
      (sum, session) =>
        sum +
        session.percentage,
      0,
    );

  const bestScore =
    sessions.reduce(
      (best, session) =>
        Math.max(
          best,
          session.percentage,
        ),
      0,
    );

  const totalAnswers =
    sessions.reduce(
      (sum, session) =>
        sum +
        session.total,
      0,
    );

  const correctAnswers =
    sessions.reduce(
      (sum, session) =>
        sum +
        session.correct,
      0,
    );

  return {
    totalSessions:
      sessions.length,

    averageScore:
      Math.round(
        totalScore /
          sessions.length,
      ),

    bestScore,

    totalAnswers,

    correctAnswers,
  };
}

export function buildTextPreview(
  text: string,
  maximumLength = 120,
): string {
  const normalized =
    text
      .replace(/\s+/gu, " ")
      .trim();

  if (
    normalized.length <=
    maximumLength
  ) {
    return normalized;
  }

  return `${normalized.slice(
    0,
    maximumLength,
  )}…`;
}