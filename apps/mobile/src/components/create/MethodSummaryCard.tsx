import {
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { QuizMethod } from "../../types/quiz";
import {
  AppCard,
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  spacing,
} from "../../theme";

type MethodSummaryCardProps = {
  method: QuizMethod;
  words: number;
  lines: number;
};

export function MethodSummaryCard({
  method,
  words,
  lines,
}: MethodSummaryCardProps) {
  const hideWords =
    method === "HIDE_WORD";

  return (
    <AppCard style={styles.card}>
      <View style={styles.heading}>
        <Ionicons
          name="information-circle-outline"
          size={iconSize.md}
          color={colors.primary}
        />

        <AppText variant="subheading">
          Selected Method
        </AppText>
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Method
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {hideWords
              ? "Hide Words"
              : "Hide Lines"}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Available items
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {hideWords
              ? `${words} words`
              : `${lines} lines`}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Practice style
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {hideWords
              ? "Exact word recall"
              : "Full passage recall"}
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

  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  rows: {
    gap: spacing.md,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  value: {
    color: colors.primaryDark,
    fontWeight: "800",
    textAlign: "right",
  },
});