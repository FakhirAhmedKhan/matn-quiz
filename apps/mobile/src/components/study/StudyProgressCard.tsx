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

type StudyProgressCardProps = {
  revealed: number;
  total: number;
};

export function StudyProgressCard({
  revealed,
  total,
}: StudyProgressCardProps) {
  const progress =
    total <= 0
      ? 0
      : revealed / total;

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Ionicons
            name="school-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <AppText variant="subheading">
            Study Progress
          </AppText>
        </View>

        <AppText
          variant="subheading"
          style={styles.value}
        >
          {revealed}/{total}
        </AppText>
      </View>

      <ProgressBar
        value={progress}
      />

      <AppText
        variant="caption"
        muted
      >
        {Math.round(
          progress * 100,
        )}
        % of hidden items revealed
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