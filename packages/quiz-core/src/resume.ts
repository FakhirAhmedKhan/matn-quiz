import type {
  ActiveStudySession,
  ResumeProgress,
} from "@matn-quiz/shared-types/resume";

export function calculateResumeProgress(
  session: ActiveStudySession,
): ResumeProgress {
  const total =
    Math.max(
      0,
      session.hiddenCount,
    );

  const revealed =
    Math.min(
      total,
      new Set(
        session.revealedItemIds,
      ).size,
    );

  const remaining =
    Math.max(
      0,
      total - revealed,
    );

  const percentage =
    total <= 0
      ? 0
      : Math.round(
          (revealed / total) *
            100,
        );

  return {
    revealed,
    remaining,
    total,
    percentage,
  };
}

export function formatResumeTime(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Unknown";
  }

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0");

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0");

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

  return `${day}/${month}/${year} · ${displayHour}:${minute} ${period}`;
}
