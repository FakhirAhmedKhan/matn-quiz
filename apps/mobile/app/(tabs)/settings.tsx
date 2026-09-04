import { StyleSheet, View } from "react-native";

import { AppScreen } from "../../src/components/layout";
import {
  AppCard,
  AppText,
  SectionHeader,
} from "../../src/components/ui";
import {
  colors,
  spacing,
} from "../../src/theme";

const sections = [
  "Reading",
  "Theme",
  "Audio",
  "Study",
  "Storage & Data",
  "Accessibility",
  "About Matn Quiz",
];

export default function SettingsTabScreen() {
  return (
    <AppScreen>
      <View style={styles.page}>
        <AppText
          variant="caption"
          style={styles.eyebrow}
        >
          SETTINGS
        </AppText>

        <AppText variant="title">
          Settings
        </AppText>

        <AppText muted>
          Preferences will become interactive in the Settings phase.
        </AppText>

        <SectionHeader title="Preferences" />

        <View style={styles.stack}>
          {sections.map((section) => (
            <AppCard
              key={section}
              style={styles.row}
            >
              <AppText variant="body">
                {section}
              </AppText>

              <AppText
                variant="caption"
                muted
              >
                Coming later
              </AppText>
            </AppCard>
          ))}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.section,
  },

  eyebrow: {
    color: colors.primary,
    fontWeight: "800",
  },

  stack: {
    gap: spacing.md,
  },

  row: {
    gap: spacing.xs,
  },
});