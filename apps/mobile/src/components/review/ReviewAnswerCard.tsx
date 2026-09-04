import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type {
  GeneratedQuizItem,
} from "../../types/quiz";
import type {
  ReviewGrade,
} from "../../types/review";
import {
  AppCard,
  AppText,
  ArabicText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type ReviewAnswerCardProps = {
  item: GeneratedQuizItem;
  index: number;
  grade?: ReviewGrade;
  onGrade: (
    grade: ReviewGrade,
  ) => void;
};

export function ReviewAnswerCard({
  item,
  index,
  grade,
  onGrade,
}: ReviewAnswerCardProps) {
  const correct =
    grade === "CORRECT";

  const incorrect =
    grade === "INCORRECT";

  return (
    <AppCard
      style={[
        styles.card,
        correct &&
          styles.correctCard,
        incorrect &&
          styles.incorrectCard,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <AppText
            variant="caption"
            style={styles.numberText}
          >
            {index + 1}
          </AppText>
        </View>

        <View style={styles.headingText}>
          <AppText variant="subheading">
            {item.kind === "word"
              ? "Hidden Word"
              : "Hidden Line"}
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            Compare with what you recalled
          </AppText>
        </View>

        {grade ? (
          <Ionicons
            name={
              correct
                ? "checkmark-circle"
                : "close-circle"
            }
            size={iconSize.lg}
            color={
              correct
                ? colors.success
                : colors.warning
            }
          />
        ) : null}
      </View>

      <View style={styles.answerContainer}>
        <AppText
          variant="caption"
          muted
          align="right"
        >
          Correct answer
        </AppText>

        <ArabicText
          size={
            item.kind === "word"
              ? "large"
              : "medium"
          }
        >
          {item.text}
        </ArabicText>
      </View>

      <View style={styles.prompt}>
        <AppText
          variant="bodySmall"
          muted
          align="center"
        >
          Did you remember this correctly?
        </AppText>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Mark answer ${index + 1} correct`}
          accessibilityState={{
            selected: correct,
          }}
          onPress={() =>
            onGrade("CORRECT")
          }
          style={({ pressed }) => [
            styles.gradeButton,
            styles.correctButton,
            correct &&
              styles.correctSelected,
            pressed &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={iconSize.md}
            color={
              correct
                ? colors.textInverse
                : colors.success
            }
          />

          <AppText
            variant="bodySmall"
            style={[
              styles.gradeText,
              styles.correctText,
              correct &&
                styles.selectedText,
            ]}
          >
            Correct
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Mark answer ${index + 1} needs work`}
          accessibilityState={{
            selected: incorrect,
          }}
          onPress={() =>
            onGrade("INCORRECT")
          }
          style={({ pressed }) => [
            styles.gradeButton,
            styles.incorrectButton,
            incorrect &&
              styles.incorrectSelected,
            pressed &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name="refresh-circle-outline"
            size={iconSize.md}
            color={
              incorrect
                ? colors.textInverse
                : colors.warning
            }
          />

          <AppText
            variant="bodySmall"
            style={[
              styles.gradeText,
              styles.incorrectText,
              incorrect &&
                styles.selectedText,
            ]}
          >
            Needs Work
          </AppText>
        </Pressable>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },

  correctCard: {
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
  },

  incorrectCard: {
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  numberBadge: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  numberText: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  headingText: {
    flex: 1,
    gap: spacing.xs,
  },

  answerContainer: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  prompt: {
    paddingTop: spacing.xs,
  },

  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  gradeButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  correctButton: {
    borderColor: colors.success,
  },

  incorrectButton: {
    borderColor: colors.warning,
  },

  correctSelected: {
    backgroundColor: colors.success,
  },

  incorrectSelected: {
    backgroundColor: colors.warning,
  },

  gradeText: {
    fontWeight: "800",
  },

  correctText: {
    color: colors.success,
  },

  incorrectText: {
    color: colors.warning,
  },

  selectedText: {
    color: colors.textInverse,
  },

  pressed: {
    opacity: 0.75,
  },
});