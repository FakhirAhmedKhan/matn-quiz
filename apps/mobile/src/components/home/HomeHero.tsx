import { StyleSheet, View } from "react-native";

import {
  AppButton,
  AppText,
} from "../ui";
import {
  colors,
  radius,
  spacing,
} from "../../theme";

type HomeHeroProps = {
  tagline: string;
  onCreatePress: () => void;
  onResumePress: () => void;
};

export function HomeHero({
  tagline,
  onCreatePress,
  onResumePress,
}: HomeHeroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <AppText
          variant="caption"
          style={styles.badgeText}
        >
          YOUR MEMORIZATION COMPANION
        </AppText>
      </View>

      <AppText
        variant="display"
        align="center"
        style={styles.title}
      >
        {tagline}
      </AppText>

      <AppText
        muted
        align="center"
        style={styles.description}
      >
        Create focused quizzes from Quran and matn text,
        practice recall, and build stronger memorization habits.
      </AppText>

      <View style={styles.actions}>
        <AppButton
          label="Create New Quiz"
          size="lg"
          onPress={onCreatePress}
        />

        <AppButton
          label="Resume Study"
          variant="secondary"
          size="lg"
          onPress={onResumePress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxl,
    borderRadius: radius.xxl,
    backgroundColor: colors.primarySoft,
  },

  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },

  badgeText: {
    color: colors.primary,
    fontWeight: "800",
  },

  title: {
    color: colors.primaryDark,
  },

  description: {
    maxWidth: 360,
  },

  actions: {
    width: "100%",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});