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

export default function HistoryTabScreen() {
  return (
    <AppScreen>
      <View style={styles.page}>
        <AppText
          variant="caption"
          style={styles.eyebrow}
        >
          HISTORY
        </AppText>

        <AppText variant="title">
          Quiz History
        </AppText>

        <AppText muted>
          Saved and completed quiz cards will be implemented
          during the History phase.
        </AppText>

        <SectionHeader
          title="Demo"
          description="Navigation destination is ready."
        />

        <AppCard style={styles.card}>
          <AppText variant="subheading">
            الأربعون النووية
          </AppText>

          <AppText
            variant="bodySmall"
            muted
          >
            Hide Words · 10 hidden · 68%
          </AppText>
        </AppCard>
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

  card: {
    gap: spacing.sm,
  },
});