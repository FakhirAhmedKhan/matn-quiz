import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  QuizTransferDocument,
} from "../../types/transfer";
import {
  AppCard,
  AppText,
  ArabicText,
} from "../ui";
import {
  getArabicInputStats,
} from "../../utils/arabicInput";
import {
  getItemLabel,
  getMethodLabel,
} from "../../utils/quizSetup";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type TransferPreviewCardProps = {
  document: QuizTransferDocument;
  title?: string;
};

export function TransferPreviewCard({
  document,
  title = "Draft Preview",
}: TransferPreviewCardProps) {
  const stats =
    getArabicInputStats(
      document.draft.text,
    );

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="document-text-outline"
          size={iconSize.md}
          color={colors.primary}
        />

        <AppText variant="subheading">
          {title}
        </AppText>
      </View>

      <View style={styles.preview}>
        <ArabicText
          size="small"
          numberOfLines={4}
        >
          {document.draft.text}
        </ArabicText>
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
            {getMethodLabel(
              document.draft.method,
            )}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Hide count
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {document.draft.hideCount}{" "}
            {getItemLabel(
              document.draft.method,
              document.draft.hideCount,
            )}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Words
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {stats.words}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Lines
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {stats.lines}
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
    gap: spacing.sm,
  },

  preview: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSoft,
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