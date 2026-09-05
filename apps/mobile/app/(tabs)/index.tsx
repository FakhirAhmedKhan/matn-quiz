import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import {
  HomeHeader,
  HomeHero,
  HomeQuickActions,
  HomeStats,
  RecentQuizCard,
  ResumeStudyCard,
} from "../../src/components/home";
import { AppScreen } from "../../src/components/layout";
import {
  AppCard,
  AppText,
  ProgressBar,
  SectionHeader,
} from "../../src/components/ui";
import { demoHome } from "../../src/mocks/demoHome";
import type { HomeQuickAction } from "../../src/types/home";
import { colors, spacing } from "../../src/theme";

export default function HomeScreen() {
  function handleQuickAction(id: HomeQuickAction["id"]) {
    if (id === "books") {
      router.push("/books");
      return;
    }

    if (id === "poem") {
      router.push("/poem");
      return;
    }

    if (id === "audio") {
      router.push("/audio");
      return;
    }

    router.push("/import-export");
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <HomeHeader
          title={demoHome.title}
          subtitle={demoHome.subtitle}
          eyebrow={demoHome.eyebrow}
          onHelpPress={() => router.push("/settings")}
        />

        <HomeHero
          tagline={demoHome.tagline}
          onCreatePress={() => router.push("/create")}
          onResumePress={() => router.push("/resume")}
        />

        <HomeStats stats={demoHome.stats} />

        <View style={styles.section}>
          <SectionHeader
            title="Resume Study"
            description="Continue where you left off."
          />

          <ResumeStudyCard
            session={demoHome.resumeSession}
            onPress={() => router.push("/study")}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Recent Activity"
            description="Jump back into your latest quiz."
          />

          <RecentQuizCard
            quiz={demoHome.recentQuiz}
            onContinue={() => router.push("/study")}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Weekly Progress"
            description="Your demo activity for this week."
          />

          <AppCard>
            <View style={styles.progressContent}>
              <View style={styles.progressRow}>
                <View style={styles.progressText}>
                  <AppText variant="subheading">This Week</AppText>

                  <AppText variant="bodySmall" muted>
                    Keep building your memorization habit.
                  </AppText>
                </View>

                <AppText variant="heading" style={styles.progressValue}>
                  {Math.round(demoHome.weeklyProgress * 100)}%
                </AppText>
              </View>

              <ProgressBar value={demoHome.weeklyProgress} />
            </View>
          </AppCard>
        </View>

        <HomeQuickActions
          actions={demoHome.quickActions}
          onActionPress={handleQuickAction}
        />

        <View style={styles.footer}>
          <AppText variant="caption" muted align="center">
            Matn Quiz · Mobile Demo
          </AppText>

          <AppText variant="caption" style={styles.footerAccent} align="center">
            Memorize with intention.
          </AppText>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    gap: spacing.xxxl,
    paddingBottom: spacing.section,
  },

  section: {
    gap: spacing.lg,
  },

  progressContent: {
    gap: spacing.lg,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  progressText: {
    flex: 1,
    gap: spacing.xs,
  },

  progressValue: {
    color: colors.primary,
  },

  footer: {
    gap: spacing.xs,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  footerAccent: {
    color: colors.primary,
  },
});
