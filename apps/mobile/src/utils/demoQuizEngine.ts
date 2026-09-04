import type {
  GeneratedQuiz,
  GeneratedQuizItem,
  QuizMethod,
} from "../types/quiz";

function normalizeText(
  text: string,
): string {
  return text
    .replace(/\r\n/g, "\n")
    .trim();
}

function chooseDistributedIndexes(
  total: number,
  requestedCount: number,
): Set<number> {
  const count = Math.max(
    0,
    Math.min(
      total,
      Math.floor(requestedCount),
    ),
  );

  if (count === 0 || total === 0) {
    return new Set<number>();
  }

  if (count === total) {
    return new Set(
      Array.from(
        { length: total },
        (_, index) => index,
      ),
    );
  }

  const result =
    new Set<number>();

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const candidate =
      Math.min(
        total - 1,
        Math.floor(
          ((index + 0.5) * total) /
            count,
        ),
      );

    result.add(candidate);
  }

  if (result.size < count) {
    for (
      let index = 0;
      index < total &&
      result.size < count;
      index += 1
    ) {
      result.add(index);
    }
  }

  return result;
}

function buildWordQuiz(
  originalText: string,
  hideCount: number,
): GeneratedQuizItem[] {
  const lines =
    originalText.split("\n");

  const rawItems: GeneratedQuizItem[] = [];

  let position = 0;

  lines.forEach(
    (line, lineIndex) => {
      const words =
        line
          .trim()
          .split(/\s+/u)
          .filter(Boolean);

      words.forEach((word) => {
        rawItems.push({
          id: `word-${position}`,
          kind: "word",
          text: word,
          hidden: false,
          lineIndex,
          position,
        });

        position += 1;
      });
    },
  );

  const hiddenIndexes =
    chooseDistributedIndexes(
      rawItems.length,
      hideCount,
    );

  return rawItems.map(
    (item, index) => ({
      ...item,
      hidden:
        hiddenIndexes.has(index),
    }),
  );
}

function buildLineQuiz(
  originalText: string,
  hideCount: number,
): GeneratedQuizItem[] {
  const lines =
    originalText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const hiddenIndexes =
    chooseDistributedIndexes(
      lines.length,
      hideCount,
    );

  return lines.map(
    (line, index) => ({
      id: `line-${index}`,
      kind: "line",
      text: line,
      hidden:
        hiddenIndexes.has(index),
      lineIndex: index,
      position: index,
    }),
  );
}

export function generateDemoQuiz(
  text: string,
  method: QuizMethod,
  requestedCount: number,
): GeneratedQuiz | null {
  const originalText =
    normalizeText(text);

  if (!originalText) {
    return null;
  }

  const items =
    method === "HIDE_WORD"
      ? buildWordQuiz(
          originalText,
          requestedCount,
        )
      : buildLineQuiz(
          originalText,
          requestedCount,
        );

  if (items.length === 0) {
    return null;
  }

  const hiddenCount =
    items.filter(
      (item) => item.hidden,
    ).length;

  return {
    id: `demo-${Date.now()}`,
    originalText,
    method,
    requestedCount,
    hiddenCount,
    items,
    createdAt:
      new Date().toISOString(),
  };
}