import {
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type {
  QuizMethod,
} from "../../types/quiz";
import {
  AppCard,
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  spacing,
} from "../../theme";
import {
  getItemLabel,
  getMethodLabel,
} from "../../utils/quizSetup";

type QuizSetupSummaryProps = {
  method: QuizMethod;
  hideCount: number;
  availableItems: number;
  words: number;
  lines: number;
};

export function QuizSetupSummary({
  method,
  hideCount,
  availableItems,
  words,
  lines,
}: QuizSetupSummaryProps) {
  const rows = [
    {
      label: "Method",
      value:
        getMethodLabel(method),
    },
    {
      label: "Hidden items",
      value:
        `${hideCount} ${getItemLabel(
          method,
          hideCount,
        )}`,
    },
    {
      label: "Available",
      value:
        `${availableItems} ${getItemLabel(
          method,
          availableItems,
        )}`,
    },
    {
      label: "Source",
      value:
        `${words} words · ${lines} lines`,
    },
  ];

  return (
    <AppCard style={styles.card}>
      <View style={styles.heading}>
        <Ionicons
          name="clipboard-outline"
          size={iconSize.md}
          color={colors.primary}
        />

        <AppText variant="subheading">
          Quiz Setup Summary
        </AppText>
      </View>

      <View style={styles.rows}>
        {rows.map((row) => (
          <View
            key={row.label}
            style={styles.row}
          >
            <AppText
              variant="bodySmall"
              muted
            >
              {row.label}
            </AppText>

            <AppText
              variant="bodySmall"
              style={styles.value}
            >
              {row.value}
            </AppText>
          </View>
        ))}
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
    flexShrink: 1,
    color: colors.primaryDark,
    fontWeight: "800",
    textAlign: "right",
  },
});