import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { router } from "expo-router";
import {
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  ReviewAnswerCard,
  ReviewProgressCard,
  ReviewScoreCard,
  ReviewSummaryCard,
} from "../src/components/review";
import {
  AppHeader,
  AppScreen,
} from "../src/components/layout";
import {
  AppButton,
  AppText,
} from "../src/components/ui";
import { useQuizStore } from "../src/store/quizStore";
import type {
  ReviewGrade,
  ReviewResult,
} from "../src/types/review";
import {
  getMethodLabel,
} from "../src/utils/quizSetup";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../src/theme";

type GradeMap =
  Record<
    string,
    ReviewGrade | undefined
  >;

export default function ReviewScreen() {
  const generatedQuiz =
    useQuizStore(
      (state) =>
        state.generatedQuiz,
    );

  const saveReviewResult =
    useQuizStore(
      (state) =>
        state.saveReviewResult,
    );

  const clearReviewResult =
    useQuizStore(
      (state) =>
        state.clearReviewResult,
    );

  const [
    grades,
    setGrades,
  ] = useState<GradeMap>({});

  useEffect(() => {
    setGrades({});
    clearReviewResult();
  }, [
    generatedQuiz?.id,
    clearReviewResult,
  ]);

  const hiddenItems =
    useMemo(
      () =>
        generatedQuiz?.items.filter(
          (item) =>
            item.hidden,
        ) ?? [],
      [generatedQuiz],
    );

  const total =
    hiddenItems.length;

  const gradedCount =
    hiddenItems.filter(
      (item) =>
        Boolean(
          grades[item.id],
        ),
    ).length;

  const correctCount =
    hiddenItems.filter(
      (item) =>
        grades[item.id] ===
        "CORRECT",
    ).length;

  const incorrectCount =
    hiddenItems.filter(
      (item) =>
        grades[item.id] ===
        "INCORRECT",
    ).length;

  const allGraded =
    total > 0 &&
    gradedCount === total;

  const percentage =
    total <= 0
      ? 0
      : Math.round(
          (correctCount / total) *
            100,
        );

  function gradeAnswer(
    itemId: string,
    grade: ReviewGrade,
  ) {
    setGrades(
      (current) => ({
        ...current,
        [itemId]: grade,
      }),
    );
  }

  function reviewAgain() {
    clearReviewResult();
    setGrades({});
  }

  function studyAgain() {
    clearReviewResult();

    router.replace(
      "/study",
    );
  }

  function finishQuiz() {
    if (
      !generatedQuiz ||
      !allGraded
    ) {
      return;
    }

    const answers =
      hiddenItems.flatMap(
        (item) => {
          const grade =
            grades[item.id];

          if (!grade) {
            return [];
          }

          return [
            {
              itemId: item.id,
              grade,
            },
          ];
        },
      );

    const result: ReviewResult = {
      quizId:
        generatedQuiz.id,
      method:
        generatedQuiz.method,
      total,
      correct:
        correctCount,
      incorrect:
        incorrectCount,
      percentage,
      answers,
      completedAt:
        new Date().toISOString(),
    };

    saveReviewResult(
      result,
    );

    router.replace("/");
  }

  if (!generatedQuiz) {
    return (
      <AppScreen>
        <View style={styles.page}>
          <AppHeader
            title="Review"
            showBack
            onBack={() =>
              router.back()
            }
          />

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="clipboard-outline"
                size={iconSize.xl}
                color={colors.primary}
              />
            </View>

            <AppText
              variant="title"
              align="center"
            >
              Nothing to Review
            </AppText>

            <AppText
              muted
              align="center"
            >
              Generate and study a quiz first.
              Your hidden answers will appear
              here for self-grading.
            </AppText>

            <AppButton
              label="Create Quiz"
              onPress={() =>
                router.replace(
                  "/create",
                )
              }
            />
          </View>
        </View>
      </AppScreen>
    );
  }

  if (total === 0) {
    return (
      <AppScreen>
        <View style={styles.page}>
          <AppHeader
            title="Review"
            showBack
            onBack={() =>
              router.back()
            }
          />

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="warning-outline"
                size={iconSize.xl}
                color={colors.warning}
              />
            </View>

            <AppText
              variant="title"
              align="center"
            >
              No Hidden Answers
            </AppText>

            <AppText
              muted
              align="center"
            >
              This quiz does not contain
              reviewable hidden items.
            </AppText>

            <AppButton
              label="Create Another Quiz"
              onPress={() =>
                router.replace(
                  "/create",
                )
              }
            />
          </View>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Review Answers"
          subtitle={
            getMethodLabel(
              generatedQuiz.method,
            )
          }
          showBack
          onBack={() =>
            router.back()
          }
        />

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="checkbox-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">
              Grade Your Recall
            </AppText>

            <AppText muted>
              Review each hidden answer and
              mark whether you remembered it
              correctly.
            </AppText>
          </View>
        </View>

        <ReviewProgressCard
          graded={gradedCount}
          total={total}
        />

        <View style={styles.answers}>
          {hiddenItems.map(
            (item, index) => (
              <ReviewAnswerCard
                key={item.id}
                item={item}
                index={index}
                grade={
                  grades[item.id]
                }
                onGrade={(grade) =>
                  gradeAnswer(
                    item.id,
                    grade,
                  )
                }
              />
            ),
          )}
        </View>

        <ReviewSummaryCard
          method={
            generatedQuiz.method
          }
          total={total}
          correct={
            correctCount
          }
          incorrect={
            incorrectCount
          }
        />

        {!allGraded ? (
          <View style={styles.waitingCard}>
            <Ionicons
              name="information-circle-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText
              variant="bodySmall"
              style={styles.waitingText}
            >
              Grade all {total} hidden{" "}
              {total === 1
                ? "answer"
                : "answers"}{" "}
              to unlock your final score.
            </AppText>
          </View>
        ) : (
          <>
            <ReviewScoreCard
              correct={
                correctCount
              }
              incorrect={
                incorrectCount
              }
              total={total}
              percentage={
                percentage
              }
            />

            <View style={styles.resultActions}>
              <AppButton
                label="Review Again"
                variant="secondary"
                onPress={
                  reviewAgain
                }
              />

              <AppButton
                label="Study Again"
                variant="ghost"
                onPress={
                  studyAgain
                }
              />

              <AppButton
                label="Finish Quiz"
                size="lg"
                onPress={
                  finishQuiz
                }
              />
            </View>
          </>
        )}

        <View style={styles.footer}>
          <AppText
            variant="caption"
            muted
            align="center"
          >
            This phase uses self-grading.
            Later phases can use the saved
            result for History and progress.
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

  answers: {
    gap: spacing.lg,
  },

  waitingCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  waitingText: {
    flex: 1,
    color: colors.primaryDark,
    fontWeight: "600",
  },

  resultActions: {
    gap: spacing.md,
  },

  footer: {
    paddingTop: spacing.sm,
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