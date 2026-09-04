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
  getMethodLabel,
} from "../../utils/quizSetup";

type ReviewSummaryCardProps = {
  method: QuizMethod;
  total: number;
  correct: number;
  incorrect: number;
};

export function ReviewSummaryCard({
  method,
  total,
  correct,
  incorrect,
}: ReviewSummaryCardProps) {
  const rows = [
    {
      label: "Quiz method",
      value:
        getMethodLabel(method),
    },
    {
      label: "Reviewed answers",
      value:
        `${correct + incorrect}/${total}`,
    },
    {
      label: "Correct",
      value:
        String(correct),
    },
    {
      label: "Needs work",
      value:
        String(incorrect),
    },
  ];

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="analytics-outline"
          size={iconSize.md}
          color={colors.primary}
        />

        <AppText variant="subheading">
          Result Summary
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

  header: {
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