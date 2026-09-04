import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  GeneratedQuiz,
  GeneratedQuizItem,
} from "../../types/quiz";
import {
  AppCard,
  AppText,
  ArabicText,
} from "../ui";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "../../theme";

type StudyQuizContentProps = {
  quiz: GeneratedQuiz;
  revealedIds: ReadonlySet<string>;
  onReveal: (
    itemId: string,
  ) => void;
};

function groupWordsByLine(
  items: GeneratedQuizItem[],
): GeneratedQuizItem[][] {
  const groups =
    new Map<
      number,
      GeneratedQuizItem[]
    >();

  items.forEach((item) => {
    const current =
      groups.get(
        item.lineIndex,
      ) ?? [];

    current.push(item);

    groups.set(
      item.lineIndex,
      current,
    );
  });

  return Array.from(
    groups.entries(),
  )
    .sort(
      ([a], [b]) => a - b,
    )
    .map(
      ([, words]) =>
        words.sort(
          (a, b) =>
            a.position -
            b.position,
        ),
    );
}

function HiddenWord({
  item,
  revealed,
  onReveal,
}: {
  item: GeneratedQuizItem;
  revealed: boolean;
  onReveal: () => void;
}) {
  if (!item.hidden) {
    return (
      <Text style={styles.word}>
        {item.text}
      </Text>
    );
  }

  if (revealed) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Revealed word"
        onPress={onReveal}
        style={styles.revealedWord}
      >
        <Text style={styles.revealedWordText}>
          {item.text}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Hidden word. Tap to reveal."
      onPress={onReveal}
      style={styles.hiddenWord}
    >
      <Text style={styles.hiddenWordText}>
        ــــــ
      </Text>
    </Pressable>
  );
}

export function StudyQuizContent({
  quiz,
  revealedIds,
  onReveal,
}: StudyQuizContentProps) {
  if (
    quiz.method ===
    "HIDE_LINE"
  ) {
    return (
      <View style={styles.lines}>
        {quiz.items.map(
          (item, index) => {
            const revealed =
              revealedIds.has(
                item.id,
              );

            const hidden =
              item.hidden &&
              !revealed;

            if (hidden) {
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Hidden line ${index + 1}. Tap to reveal.`}
                  onPress={() =>
                    onReveal(
                      item.id,
                    )
                  }
                  style={styles.hiddenLine}
                >
                  <AppText
                    align="center"
                    style={styles.hiddenLineText}
                  >
                    ـــــــــــــــــــــــــــــــ
                  </AppText>

                  <AppText
                    variant="caption"
                    muted
                    align="center"
                  >
                    Tap to reveal line{" "}
                    {index + 1}
                  </AppText>
                </Pressable>
              );
            }

            return (
              <Pressable
                key={item.id}
                disabled={!item.hidden}
                onPress={() =>
                  onReveal(
                    item.id,
                  )
                }
              >
                <AppCard
                  style={[
                    styles.lineCard,
                    item.hidden &&
                      styles.revealedLineCard,
                  ]}
                >
                  <ArabicText>
                    {item.text}
                  </ArabicText>
                </AppCard>
              </Pressable>
            );
          },
        )}
      </View>
    );
  }

  const lines =
    groupWordsByLine(
      quiz.items,
    );

  return (
    <AppCard style={styles.wordQuizCard}>
      <View style={styles.wordLines}>
        {lines.map(
          (line, lineIndex) => (
            <View
              key={`line-${lineIndex}`}
              style={styles.wordLine}
            >
              {line.map((item) => (
                <HiddenWord
                  key={item.id}
                  item={item}
                  revealed={
                    revealedIds.has(
                      item.id,
                    )
                  }
                  onReveal={() =>
                    onReveal(
                      item.id,
                    )
                  }
                />
              ))}
            </View>
          ),
        )}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  lines: {
    gap: spacing.md,
  },

  hiddenLine: {
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.xl,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: radius.card,
    backgroundColor: colors.primarySoft,
  },

  hiddenLineText: {
    color: colors.primary,
    fontSize: typography.heading,
    fontWeight: "800",
  },

  lineCard: {
    minHeight: 90,
    justifyContent: "center",
  },

  revealedLineCard: {
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
  },

  wordQuizCard: {
    paddingVertical: spacing.xxl,
  },

  wordLines: {
    gap: spacing.xl,
  },

  wordLine: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: spacing.sm,
  },

  word: {
    color: colors.text,
    fontSize: typography.arabic,
    lineHeight: 40,
    textAlign: "right",
    writingDirection: "rtl",
  },

  hiddenWord: {
    minWidth: 66,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },

  hiddenWordText: {
    color: colors.primary,
    fontSize: typography.arabicSmall,
    fontWeight: "800",
  },

  revealedWord: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
    ...shadows.card,
  },

  revealedWordText: {
    color: colors.success,
    fontSize: typography.arabic,
    lineHeight: 40,
    textAlign: "right",
    writingDirection: "rtl",
  },
});