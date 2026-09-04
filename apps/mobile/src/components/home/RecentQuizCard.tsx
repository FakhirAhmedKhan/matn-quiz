import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { HomeRecentQuiz } from "../../types/home";
import {
  AppButton,
  AppCard,
  AppText,
  ArabicText,
  ProgressBar,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type RecentQuizCardProps = {
  quiz: HomeRecentQuiz;
  onContinue: () => void;
};

export function RecentQuizCard({
  quiz,
  onContinue,
}: RecentQuizCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="document-text-outline"
              size={iconSize.md}
              color={colors.primary}
            />
          </View>

          <View>
            <AppText variant="subheading">
              Recent Quiz
            </AppText>

            <AppText
              variant="caption"
              muted
            >
              Continue your latest practice
            </AppText>
          </View>
        </View>

        <View style={styles.methodBadge}>
          <AppText
            variant="caption"
            style={styles.methodText}
          >
            {quiz.methodLabel}
          </AppText>
        </View>
      </View>

      <View style={styles.arabicBox}>
        <ArabicText size="medium">
          {quiz.title}
        </ArabicText>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons
            name="eye-off-outline"
            size={iconSize.sm}
            color={colors.textMuted}
          />

          <AppText
            variant="bodySmall"
            muted
          >
            {quiz.hiddenCount} hidden
          </AppText>
        </View>

        <AppText
          variant="caption"
          style={styles.progressLabel}
        >
          {Math.round(quiz.progress * 100)}%
        </AppText>
      </View>

      <ProgressBar value={quiz.progress} />

      <AppButton
        label="Continue Quiz"
        variant="secondary"
        onPress={onContinue}
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  iconContainer: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },

  methodBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
  },

  methodText: {
    color: colors.warning,
    fontWeight: "800",
  },

  arabicBox: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSoft,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  progressLabel: {
    color: colors.primary,
    fontWeight: "800",
  },
});