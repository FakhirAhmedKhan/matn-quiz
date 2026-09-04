import {
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type {
  QuizHistorySession,
} from "../../types/history";
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
import {
  formatHistoryDate,
} from "../../utils/history";
import {
  getMethodLabel,
} from "../../utils/quizSetup";

type HistorySessionCardProps = {
  session: QuizHistorySession;
};

function getScoreMessage(
  score: number,
): string {
  if (score >= 90) {
    return "Excellent";
  }

  if (score >= 75) {
    return "Great";
  }

  if (score >= 50) {
    return "Keep going";
  }

  return "Practice again";
}

export function HistorySessionCard({
  session,
}: HistorySessionCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.methodIcon}>
          <Ionicons
            name={
              session.method ===
              "HIDE_WORD"
                ? "text-outline"
                : "reorder-three-outline"
            }
            size={iconSize.md}
            color={colors.primary}
          />
        </View>

        <View style={styles.headerText}>
          <AppText variant="subheading">
            {getMethodLabel(
              session.method,
            )}
          </AppText>

          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={iconSize.sm}
              color={colors.textMuted}
            />

            <AppText
              variant="caption"
              muted
            >
              {formatHistoryDate(
                session.completedAt,
              )}
            </AppText>
          </View>
        </View>

        <View style={styles.scoreBadge}>
          <AppText
            variant="subheading"
            style={styles.score}
          >
            {session.percentage}%
          </AppText>
        </View>
      </View>

      <View style={styles.preview}>
        <ArabicText
          size="small"
          numberOfLines={2}
        >
          {session.textPreview}
        </ArabicText>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <AppText
            variant="caption"
            muted
          >
            Hidden
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.metricValue}
          >
            {session.hiddenCount}
          </AppText>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metric}>
          <AppText
            variant="caption"
            muted
          >
            Correct
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.correct}
          >
            {session.correct}
          </AppText>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metric}>
          <AppText
            variant="caption"
            muted
          >
            Needs Work
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.incorrect}
          >
            {session.incorrect}
          </AppText>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.resultText}>
          <Ionicons
            name={
              session.percentage >= 75
                ? "checkmark-circle-outline"
                : "refresh-circle-outline"
            }
            size={iconSize.sm}
            color={
              session.percentage >= 75
                ? colors.success
                : colors.warning
            }
          />

          <AppText
            variant="bodySmall"
            style={styles.resultLabel}
          >
            {getScoreMessage(
              session.percentage,
            )}
          </AppText>
        </View>

        <AppText
          variant="caption"
          muted
        >
          {session.correct}/{session.total} recalled
        </AppText>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  methodIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },

  headerText: {
    flex: 1,
    gap: spacing.xs,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  scoreBadge: {
    minWidth: 64,
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  score: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  preview: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSoft,
  },

  metrics: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },

  metric: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },

  metricDivider: {
    width: 1,
    marginVertical: spacing.sm,
    backgroundColor: colors.border,
  },

  metricValue: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  correct: {
    color: colors.success,
    fontWeight: "900",
  },

  incorrect: {
    color: colors.warning,
    fontWeight: "900",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  resultText: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  resultLabel: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
});