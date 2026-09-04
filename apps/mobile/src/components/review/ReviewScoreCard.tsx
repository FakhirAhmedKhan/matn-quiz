import {
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  AppCard,
  AppText,
  ProgressBar,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type ReviewScoreCardProps = {
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
};

function getMessage(
  percentage: number,
): string {
  if (percentage >= 90) {
    return "Excellent recall. Your memorization is very strong.";
  }

  if (percentage >= 75) {
    return "Great work. Review the missed items once more.";
  }

  if (percentage >= 50) {
    return "Good progress. Another study round will strengthen recall.";
  }

  return "Keep practicing. Focus on the items marked Needs Work.";
}

export function ReviewScoreCard({
  correct,
  incorrect,
  total,
  percentage,
}: ReviewScoreCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.trophy}>
        <Ionicons
          name="trophy-outline"
          size={iconSize.xl}
          color={colors.primary}
        />
      </View>

      <AppText
        variant="title"
        align="center"
      >
        Review Complete
      </AppText>

      <AppText
        style={styles.percentage}
        align="center"
      >
        {percentage}%
      </AppText>

      <AppText
        variant="bodySmall"
        muted
        align="center"
      >
        Final recall score
      </AppText>

      <ProgressBar
        value={
          total <= 0
            ? 0
            : correct / total
        }
      />

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons
            name="checkmark-circle"
            size={iconSize.md}
            color={colors.success}
          />

          <AppText
            variant="subheading"
            style={styles.correct}
          >
            {correct}
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            Correct
          </AppText>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Ionicons
            name="refresh-circle"
            size={iconSize.md}
            color={colors.warning}
          />

          <AppText
            variant="subheading"
            style={styles.incorrect}
          >
            {incorrect}
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            Needs Work
          </AppText>
        </View>
      </View>

      <View style={styles.message}>
        <AppText
          variant="bodySmall"
          align="center"
        >
          {getMessage(percentage)}
        </AppText>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: spacing.lg,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },

  trophy: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },

  percentage: {
    color: colors.primaryDark,
    fontSize: 46,
    lineHeight: 54,
    fontWeight: "900",
  },

  stats: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  stat: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.lg,
  },

  divider: {
    width: 1,
    marginVertical: spacing.md,
    backgroundColor: colors.border,
  },

  correct: {
    color: colors.success,
  },

  incorrect: {
    color: colors.warning,
  },

  message: {
    width: "100%",
    paddingHorizontal: spacing.md,
  },
});