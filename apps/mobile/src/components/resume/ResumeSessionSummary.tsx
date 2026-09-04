import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  ActiveStudySession,
} from "../../types/resume";
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
  formatResumeTime,
} from "../../utils/resume";
import {
  getMethodLabel,
} from "../../utils/quizSetup";

type ResumeSessionSummaryProps = {
  session: ActiveStudySession;
};

export function ResumeSessionSummary({
  session,
}: ResumeSessionSummaryProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
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

          <AppText
            variant="caption"
            muted
          >
            In-progress session
          </AppText>
        </View>
      </View>

      <View style={styles.preview}>
        <ArabicText
          size="small"
          numberOfLines={3}
        >
          {session.textPreview}
        </ArabicText>
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Hidden items
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {session.hiddenCount}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Started
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {formatResumeTime(
              session.startedAt,
            )}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Last activity
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {formatResumeTime(
              session.updatedAt,
            )}
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
    gap: spacing.md,
  },

  icon: {
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