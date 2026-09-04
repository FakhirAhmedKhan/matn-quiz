import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppScreen } from "../../src/components/layout";
import {
  AppCard,
  AppText,
  ArabicText,
  ProgressBar,
  SectionHeader,
} from "../../src/components/ui";
import { NavigationCard } from "../../src/components/navigation";
import {
  colors,
  radius,
  spacing,
} from "../../src/theme";

export default function HomeScreen() {
  return (
    <AppScreen>
      <View style={styles.page}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <ArabicText
              center
              style={styles.logoText}
            >
              م
            </ArabicText>
          </View>

          <AppText
            variant="title"
            align="center"
          >
            Matn Quiz
          </AppText>

          <AppText
            muted
            align="center"
          >
            Quran & Matn Memorization
          </AppText>

          <AppText
            variant="subheading"
            align="center"
            style={styles.tagline}
          >
            Memorize. Practice. Master.
          </AppText>
        </View>

        <SectionHeader
          title="Start Learning"
          description="M3 navigation is now connected."
        />

        <View style={styles.stack}>
          <NavigationCard
            title="Create New Quiz"
            description="Start the three-step quiz workflow."
            icon="create-outline"
            onPress={() => router.push("/create")}
          />

          <NavigationCard
            title="Resume Study"
            description="Continue an unfinished study session."
            icon="play-circle-outline"
            onPress={() => router.push("/resume")}
          />

          <NavigationCard
            title="Poem Reader"
            description="Read and memorize Arabic poetry."
            icon="reader-outline"
            onPress={() => router.push("/poem")}
          />

          <NavigationCard
            title="Audio Learning"
            description="Open the visible-text audio experience."
            icon="headset-outline"
            onPress={() => router.push("/audio")}
          />

          <NavigationCard
            title="Import / Export"
            description="Open the shareable quiz workflow."
            icon="swap-horizontal-outline"
            onPress={() => router.push("/import-export")}
          />
        </View>

        <SectionHeader
          title="Demo Progress"
          description="Real progress logic comes later."
        />

        <AppCard>
          <View style={styles.progressContent}>
            <View style={styles.progressRow}>
              <AppText variant="subheading">
                Weekly Progress
              </AppText>

              <AppText
                variant="caption"
                style={styles.progressValue}
              >
                68%
              </AppText>
            </View>

            <ProgressBar value={0.68} />
          </View>
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
    paddingBottom: spacing.md,
  },

  logo: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
  },

  logoText: {
    color: colors.textInverse,
  },

  tagline: {
    marginTop: spacing.lg,
    color: colors.primaryDark,
  },

  stack: {
    gap: spacing.md,
  },

  progressContent: {
    gap: spacing.md,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressValue: {
    color: colors.primary,
  },
});