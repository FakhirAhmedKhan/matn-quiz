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
  spacing,
} from "../../theme";

type ReviewProgressCardProps = {
  graded: number;
  total: number;
};

export function ReviewProgressCard({
  graded,
  total,
}: ReviewProgressCardProps) {
  const progress =
    total <= 0
      ? 0
      : graded / total;

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Ionicons
            name="checkmark-done-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <AppText variant="subheading">
            Review Progress
          </AppText>
        </View>

        <AppText
          variant="subheading"
          style={styles.value}
        >
          {graded}/{total}
        </AppText>
      </View>

      <ProgressBar value={progress} />

      <AppText
        variant="caption"
        muted
      >
        Grade every hidden answer to calculate
        your final score.
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  title: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  value: {
    color: colors.primary,
  },
});