import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  ResumeProgressCard,
  ResumeSessionSummary,
} from "../src/components/resume";
import { AppHeader, AppScreen } from "../src/components/layout";
import { AppButton, AppText } from "../src/components/ui";
import { useQuizStore } from "../src/store/quizStore";
import { calculateResumeProgress } from "../src/utils/resume";
import { colors, iconSize, radius, spacing } from "../src/theme";

export default function ResumeScreen() {
  const generatedQuiz = useQuizStore((state) => state.generatedQuiz);

  const activeStudySession = useQuizStore((state) => state.activeStudySession);

  const restartStudySession = useQuizStore(
    (state) => state.restartStudySession,
  );

  const clearGeneratedQuiz = useQuizStore((state) => state.clearGeneratedQuiz);

  const validSession = Boolean(
    generatedQuiz &&
    activeStudySession &&
    generatedQuiz.id === activeStudySession.quizId,
  );

  if (!validSession || !activeStudySession || !generatedQuiz) {
    return (
      <AppScreen>
        <View style={styles.page}>
          <AppHeader
            title="Resume Study"
            subtitle="In-progress quiz"
            showBack
            onBack={() => router.back()}
          />

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="play-circle-outline"
                size={iconSize.xl}
                color={colors.primary}
              />
            </View>

            <AppText variant="title" align="center">
              No Study Session to Resume
            </AppText>

            <AppText muted align="center">
              Start a quiz and your study progress will appear here until the
              quiz is completed or discarded.
            </AppText>

            <AppButton
              label="Create New Quiz"
              onPress={() => router.replace("/create")}
            />
          </View>
        </View>
      </AppScreen>
    );
  }

  const progress = calculateResumeProgress(activeStudySession);

  function continueStudy() {
    router.replace("/study");
  }

  function restartSession() {
    const session = restartStudySession();

    if (!session) {
      return;
    }

    router.replace("/study");
  }

  function discardSession() {
    clearGeneratedQuiz();

    router.replace("/create");
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Resume Study"
          subtitle="Continue where you left off"
          showBack
          onBack={() => router.back()}
        />

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="play-forward-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">Continue Your Session</AppText>

            <AppText muted>
              Your revealed-answer progress is still available in this app
              session.
            </AppText>
          </View>
        </View>

        <ResumeProgressCard progress={progress} />

        <ResumeSessionSummary session={activeStudySession} />

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <AppText variant="bodySmall" style={styles.noticeText}>
            Resume currently works while the app remains running. Device-restart
            persistence will be added in the local persistence phase.
          </AppText>
        </View>

        <View style={styles.actions}>
          <AppButton
            label={
              progress.revealed > 0
                ? `Continue Study · ${progress.percentage}%`
                : "Start Study"
            }
            size="lg"
            onPress={continueStudy}
          />

          <AppButton
            label="Restart This Session"
            variant="secondary"
            onPress={restartSession}
          />

          <AppButton
            label="Discard and Create New"
            variant="ghost"
            onPress={discardSession}
          />
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

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  noticeText: {
    flex: 1,
    color: colors.primaryDark,
  },

  actions: {
    gap: spacing.md,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.section,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xxl,
    backgroundColor: colors.primarySoft,
  },
});
