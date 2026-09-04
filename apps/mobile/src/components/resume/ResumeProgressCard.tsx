import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  ResumeProgress,
} from "../../types/resume";
import {
  AppCard,
  AppText,
  ProgressBar,
} from "../ui";
import {
  colors,
  iconSize,
  spacing,
} from "../../theme";

type ResumeProgressCardProps = {
  progress: ResumeProgress;
};

export function ResumeProgressCard({
  progress,
}: ResumeProgressCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Ionicons
            name="hourglass-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <AppText variant="subheading">
            Study Progress
          </AppText>
        </View>

        <AppText
          variant="subheading"
          style={styles.percentage}
        >
          {progress.percentage}%
        </AppText>
      </View>

      <ProgressBar
        value={
          progress.total <= 0
            ? 0
            : progress.revealed /
              progress.total
        }
      />

      <View style={styles.stats}>
        <View style={styles.stat}>
          <AppText
            variant="subheading"
            style={styles.value}
          >
            {progress.revealed}
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            Revealed
          </AppText>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <AppText
            variant="subheading"
            style={styles.value}
          >
            {progress.remaining}
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            Remaining
          </AppText>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <AppText
            variant="subheading"
            style={styles.value}
          >
            {progress.total}
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            Hidden
          </AppText>
        </View>
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
    justifyContent: "space-between",
    gap: spacing.md,
  },

  heading: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  percentage: {
    color: colors.primary,
    fontWeight: "900",
  },

  stats: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  stat: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },

  divider: {
    width: 1,
    marginVertical: spacing.sm,
    backgroundColor: colors.border,
  },

  value: {
    color: colors.primaryDark,
    fontWeight: "900",
  },
});