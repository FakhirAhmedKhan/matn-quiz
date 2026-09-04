import {
  router,
} from "expo-router";
import {
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  HistoryEmptyState,
  HistorySessionCard,
  HistoryStats,
} from "../../src/components/history";
import {
  AppHeader,
  AppScreen,
} from "../../src/components/layout";
import {
  AppButton,
  AppCard,
  AppText,
} from "../../src/components/ui";
import {
  useQuizStore,
} from "../../src/store/quizStore";
import {
  calculateHistoryStats,
} from "../../src/utils/history";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../src/theme";

export default function HistoryScreen() {
  const historySessions =
    useQuizStore(
      (state) =>
        state.historySessions,
    );

  const clearHistory =
    useQuizStore(
      (state) =>
        state.clearHistory,
    );

  const stats =
    calculateHistoryStats(
      historySessions,
    );

  if (
    historySessions.length === 0
  ) {
    return (
      <AppScreen>
        <View style={styles.page}>
          <AppHeader
            title="Quiz History"
            subtitle="Completed sessions"
          />

          <HistoryEmptyState
            onCreateQuiz={() =>
              router.push(
                "/create",
              )
            }
          />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Quiz History"
          subtitle={`${historySessions.length} completed ${
            historySessions.length === 1
              ? "session"
              : "sessions"
          }`}
        />

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="analytics-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">
              Your Progress
            </AppText>

            <AppText muted>
              Track completed quizzes,
              recall scores and improvement
              over time.
            </AppText>
          </View>
        </View>

        <HistoryStats
          stats={stats}
        />

        <AppCard style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Ionicons
              name="checkmark-done-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText variant="subheading">
              Overall Recall
            </AppText>
          </View>

          <View style={styles.overviewRows}>
            <View style={styles.overviewRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Answers reviewed
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.overviewValue}
              >
                {stats.totalAnswers}
              </AppText>
            </View>

            <View style={styles.overviewRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Correct recalls
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.successValue}
              >
                {stats.correctAnswers}
              </AppText>
            </View>

            <View style={styles.overviewRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Average score
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.overviewValue}
              >
                {stats.averageScore}%
              </AppText>
            </View>
          </View>
        </AppCard>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitle}>
            <Ionicons
              name="time-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText variant="subheading">
              Recent Sessions
            </AppText>
          </View>

          <AppText
            variant="caption"
            muted
          >
            Newest first
          </AppText>
        </View>

        <View style={styles.sessions}>
          {historySessions.map(
            (session) => (
              <HistorySessionCard
                key={session.id}
                session={session}
              />
            ),
          )}
        </View>

        <View style={styles.actions}>
          <AppButton
            label="Start New Quiz"
            size="lg"
            onPress={() =>
              router.push(
                "/create",
              )
            }
          />

          <AppButton
            label="Clear Demo History"
            variant="ghost"
            onPress={
              clearHistory
            }
          />
        </View>

        <View style={styles.demoNotice}>
          <Ionicons
            name="information-circle-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <AppText
            variant="bodySmall"
            style={styles.demoNoticeText}
          >
            History is currently stored in
            memory for the UI demo. Local
            persistence will be added in the
            persistence phase.
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
    gap: spacing.xxl,
    paddingBottom: spacing.section,
  },

  intro: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.md,
  },

  introIcon: {
    width: 52,
    height: 52,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  introText: {
    flex: 1,
    gap: spacing.xs,
  },

  overviewCard: {
    gap: spacing.lg,
  },

  overviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  overviewRows: {
    gap: spacing.md,
  },

  overviewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  overviewValue: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  successValue: {
    color: colors.success,
    fontWeight: "900",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  sectionTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  sessions: {
    gap: spacing.lg,
  },

  actions: {
    gap: spacing.md,
  },

  demoNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  demoNoticeText: {
    flex: 1,
    color: colors.primaryDark,
  },
});