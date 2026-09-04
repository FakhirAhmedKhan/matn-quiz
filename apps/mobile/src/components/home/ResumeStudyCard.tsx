import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { HomeResumeSession } from "../../types/home";
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

type ResumeStudyCardProps = {
  session: HomeResumeSession;
  onPress: () => void;
};

export function ResumeStudyCard({
  session,
  onPress,
}: ResumeStudyCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.labelRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="play-circle-outline"
              size={iconSize.md}
              color={colors.primary}
            />
          </View>

          <View>
            <AppText variant="subheading">
              Continue Studying
            </AppText>

            <AppText
              variant="caption"
              muted
            >
              Last activity: {session.lastActivity}
            </AppText>
          </View>
        </View>

        <View style={styles.methodBadge}>
          <AppText
            variant="caption"
            style={styles.methodText}
          >
            {session.methodLabel}
          </AppText>
        </View>
      </View>

      <View style={styles.arabicSection}>
        <ArabicText size="medium">
          {session.title}
        </ArabicText>
      </View>

      <View style={styles.progressHeader}>
        <AppText
          variant="bodySmall"
          muted
        >
          {session.revealed} of {session.total} revealed
        </AppText>

        <AppText
          variant="caption"
          style={styles.accuracy}
        >
          {session.accuracy}% accuracy
        </AppText>
      </View>

      <ProgressBar
        value={session.progress}
      />

      <AppButton
        label="Resume Quiz"
        onPress={onPress}
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  labelRow: {
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

  arabicSection: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSoft,
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  accuracy: {
    color: colors.primary,
    fontWeight: "800",
  },
});