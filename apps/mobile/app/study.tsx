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
  StudyControls,
  StudyProgressCard,
  StudyQuizContent,
} from "../src/components/study";
import {
  AppHeader,
  AppScreen,
} from "../src/components/layout";
import {
  AppButton,
  AppCard,
  AppText,
} from "../src/components/ui";
import { useQuizStore } from "../src/store/quizStore";
import {
  getMethodLabel,
} from "../src/utils/quizSetup";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../src/theme";

export default function StudyScreen() {
  const generatedQuiz =
    useQuizStore(
      (state) =>
        state.generatedQuiz,
    );

  const [
    revealedIds,
    setRevealedIds,
  ] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    setRevealedIds(
      new Set(),
    );
  }, [generatedQuiz?.id]);

  const hiddenItems =
    useMemo(
      () =>
        generatedQuiz?.items.filter(
          (item) =>
            item.hidden,
        ) ?? [],
      [generatedQuiz],
    );

  const revealedCount =
    hiddenItems.filter(
      (item) =>
        revealedIds.has(
          item.id,
        ),
    ).length;

  const allRevealed =
    hiddenItems.length > 0 &&
    revealedCount ===
      hiddenItems.length;

  function toggleReveal(
    itemId: string,
  ) {
    setRevealedIds(
      (current) => {
        const next =
          new Set(current);

        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }

        return next;
      },
    );
  }

  function revealNext() {
    const nextItem =
      hiddenItems.find(
        (item) =>
          !revealedIds.has(
            item.id,
          ),
      );

    if (!nextItem) {
      return;
    }

    setRevealedIds(
      (current) => {
        const next =
          new Set(current);

        next.add(
          nextItem.id,
        );

        return next;
      },
    );
  }

  function revealAll() {
    setRevealedIds(
      new Set(
        hiddenItems.map(
          (item) =>
            item.id,
        ),
      ),
    );
  }

  function hideAll() {
    setRevealedIds(
      new Set(),
    );
  }

  if (!generatedQuiz) {
    return (
      <AppScreen>
        <View style={styles.page}>
          <AppHeader
            title="Study Mode"
            showBack
            onBack={() =>
              router.back()
            }
          />

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="school-outline"
                size={iconSize.xl}
                color={colors.primary}
              />
            </View>

            <AppText
              variant="title"
              align="center"
            >
              No Quiz Generated
            </AppText>

            <AppText
              muted
              align="center"
            >
              Create a quiz first, choose your
              method and hide count, then return
              here to study.
            </AppText>

            <AppButton
              label="Create New Quiz"
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
          title="Study Mode"
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
              name="school-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">
              Practice Your Recall
            </AppText>

            <AppText muted>
              Tap a hidden item when you are
              ready to reveal the answer.
            </AppText>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <AppText
              variant="caption"
              style={styles.badgeText}
            >
              {getMethodLabel(
                generatedQuiz.method,
              )}
            </AppText>
          </View>

          <AppText
            variant="caption"
            muted
          >
            {generatedQuiz.hiddenCount} hidden
          </AppText>
        </View>

        <StudyProgressCard
          revealed={
            revealedCount
          }
          total={
            generatedQuiz.hiddenCount
          }
        />

        <View style={styles.section}>
          <AppText variant="subheading">
            Quiz
          </AppText>

          <StudyQuizContent
            quiz={generatedQuiz}
            revealedIds={
              revealedIds
            }
            onReveal={
              toggleReveal
            }
          />
        </View>

        <StudyControls
          hasHidden={
            hiddenItems.length > 0
          }
          allRevealed={
            allRevealed
          }
          onRevealNext={
            revealNext
          }
          onRevealAll={
            revealAll
          }
          onHideAll={
            hideAll
          }
        />

        {allRevealed ? (
          <AppCard
            style={styles.completeCard}
          >
            <View style={styles.completeHeader}>
              <Ionicons
                name="checkmark-circle"
                size={iconSize.lg}
                color={colors.success}
              />

              <View style={styles.completeText}>
                <AppText variant="subheading">
                  All Answers Revealed
                </AppText>

                <AppText
                  variant="bodySmall"
                  muted
                >
                  You can hide them again or
                  continue to review.
                </AppText>
              </View>
            </View>

            <AppButton
              label="Continue to Review"
              onPress={() =>
                router.push(
                  "/review",
                )
              }
            />
          </AppCard>
        ) : null}

        <View style={styles.footer}>
          <AppText
            variant="caption"
            muted
            align="center"
          >
            Hidden answers remain concealed until
            you explicitly reveal them.
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

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  badgeText: {
    color: colors.primaryDark,
    fontWeight: "800",
  },

  section: {
    gap: spacing.lg,
  },

  completeCard: {
    gap: spacing.lg,
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
  },

  completeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  completeText: {
    flex: 1,
    gap: spacing.xs,
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