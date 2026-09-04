import { StyleSheet, View } from "react-native";

import { AppScreen } from "../src/components/layout";
import {
  AppButton,
  AppCard,
  AppInput,
  AppText,
  ArabicText,
  ProgressBar,
  SectionHeader,
  StepIndicator,
} from "../src/components/ui";
import { colors, radius, spacing } from "../src/theme";

export default function DesignSystemScreen() {
  return (
    <AppScreen>
      <View style={styles.page}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <ArabicText size="medium" center style={styles.logoText}>
              م
            </ArabicText>
          </View>

          <AppText variant="title" align="center">
            Matn Quiz
          </AppText>

          <AppText muted align="center">
            Quran & Matn Memorization
          </AppText>

          <View style={styles.badge}>
            <AppText variant="caption" style={styles.badgeText}>
              M2 DESIGN SYSTEM
            </AppText>
          </View>
        </View>

        <SectionHeader
          title="Quiz Progress"
          description="Reusable visual components are ready."
        />

        <AppCard>
          <View style={styles.stack}>
            <StepIndicator current={2} total={3} />

            <ProgressBar value={0.68} />

            <AppText variant="caption" muted>
              68% complete
            </AppText>
          </View>
        </AppCard>

        <SectionHeader
          title="Arabic Reading"
          description="RTL-first typography for Quran and matn content."
        />

        <AppCard>
          <ArabicText>
            إنما الأعمال بالنيات وإنما لكل امرئ ما نوى
          </ArabicText>
        </AppCard>

        <SectionHeader
          title="Arabic Input"
          description="Reusable Arabic-aware form field."
        />

        <AppInput
          arabic
          multiline
          label="Arabic Text"
          placeholder="أدخل النص"
        />

        <View style={styles.stack}>
          <AppButton
            label="Primary Action"
            onPress={() => undefined}
          />

          <AppButton
            label="Secondary Action"
            variant="secondary"
            onPress={() => undefined}
          />
        </View>

        <AppCard style={styles.successCard}>
          <AppText variant="subheading">
            M2 foundation ready
          </AppText>

          <AppText variant="bodySmall" muted>
            Typography, Arabic text, buttons, cards, forms, progress and
            step indicators are ready for the real Matn Quiz screens.
          </AppText>
        </AppCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: spacing.xl,
    paddingBottom: spacing.section,
  },

  hero: {
    alignItems: "center",
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },

  logo: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
  },

  logoText: {
    color: colors.textInverse,
  },

  badge: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  badgeText: {
    color: colors.primaryDark,
  },

  stack: {
    gap: spacing.md,
  },

  successCard: {
    gap: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
});