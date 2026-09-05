import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { MethodSummaryCard, QuizMethodCard } from "../../src/components/create";
import { AppHeader, AppScreen } from "../../src/components/layout";
import {
  AppButton,
  AppCard,
  AppText,
  ArabicText,
  StepIndicator,
} from "../../src/components/ui";
import { useQuizStore } from "../../src/store/quizStore";
import type { QuizMethod } from "../../src/types/quiz";
import {
  getArabicInputStats,
  validateArabicInput,
} from "../../src/utils/arabicInput";
import { colors, iconSize, radius, spacing } from "../../src/theme";

export default function CreateMethodScreen() {
  const text = useQuizStore((state) => state.text);

  const method = useQuizStore((state) => state.method);

  const setMethod = useQuizStore((state) => state.setMethod);

  const stats = getArabicInputStats(text);

  const validation = validateArabicInput(text);

  const canUseHideWords = stats.words >= 2;

  const canUseHideLines = stats.lines >= 2;

  const selectedAvailable =
    method === "HIDE_WORD" ? canUseHideWords : canUseHideLines;

  function selectMethod(nextMethod: QuizMethod) {
    if (nextMethod === "HIDE_WORD" && !canUseHideWords) {
      return;
    }

    if (nextMethod === "HIDE_LINE" && !canUseHideLines) {
      return;
    }

    setMethod(nextMethod);
  }

  function continueToCount() {
    if (!validation.valid || !selectedAvailable) {
      return;
    }

    router.push("/create/count");
  }

  if (!validation.valid) {
    return (
      <AppScreen>
        <View style={styles.page}>
          <AppHeader
            title="Choose Method"
            subtitle="Step 2 of 3"
            showBack
            onBack={() => router.back()}
          />

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="document-text-outline"
                size={iconSize.xl}
                color={colors.primary}
              />
            </View>

            <AppText variant="title" align="center">
              Add Arabic Text First
            </AppText>

            <AppText muted align="center">
              Quiz method selection needs valid Arabic Quran or matn text.
            </AppText>

            <AppButton
              label="Go to Arabic Input"
              onPress={() => router.replace("/create")}
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
          title="Choose Method"
          subtitle="Step 2 of 3"
          showBack
          onBack={() => router.back()}
        />

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="options-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">How should we hide the text?</AppText>

            <AppText muted>
              Choose the practice style that matches your memorization goal.
            </AppText>
          </View>
        </View>

        <StepIndicator current={2} total={3} />

        <AppCard style={styles.previewCard}>
          <View style={styles.previewHeading}>
            <Ionicons
              name="reader-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <View style={styles.previewHeadingText}>
              <AppText variant="subheading">Source Text</AppText>

              <AppText variant="caption" muted>
                {stats.words} words · {stats.lines} lines
              </AppText>
            </View>
          </View>

          <View style={styles.arabicPreview}>
            <ArabicText size="small" numberOfLines={4}>
              {text}
            </ArabicText>
          </View>
        </AppCard>

        <View style={styles.methods}>
          <QuizMethodCard
            method="HIDE_WORD"
            title="Hide Words"
            description="Hide individual Arabic words and reveal them during study."
            detail="Best for exact wording, vocabulary, short phrases and detailed recall."
            availableCount={stats.words}
            availableLabel="words available"
            icon="text-outline"
            selected={method === "HIDE_WORD"}
            disabled={!canUseHideWords}
            onPress={() => selectMethod("HIDE_WORD")}
          />

          <QuizMethodCard
            method="HIDE_LINE"
            title="Hide Lines"
            description="Hide complete lines and recall the whole passage from memory."
            detail={
              canUseHideLines
                ? "Best for longer passages, poetry and complete-line memorization."
                : "Add at least two non-empty lines to enable Hide Lines."
            }
            availableCount={stats.lines}
            availableLabel="lines available"
            icon="reorder-three-outline"
            selected={method === "HIDE_LINE"}
            disabled={!canUseHideLines}
            onPress={() => selectMethod("HIDE_LINE")}
          />
        </View>

        {!canUseHideLines ? (
          <View style={styles.warning}>
            <Ionicons
              name="information-circle-outline"
              size={iconSize.md}
              color={colors.warning}
            />

            <AppText variant="bodySmall" style={styles.warningText}>
              Hide Lines requires at least two non-empty lines. Hide Words
              remains available.
            </AppText>
          </View>
        ) : null}

        <MethodSummaryCard
          method={method}
          words={stats.words}
          lines={stats.lines}
        />

        <View style={styles.footer}>
          <AppButton
            label="Continue to Hide Count"
            size="lg"
            disabled={!selectedAvailable}
            onPress={continueToCount}
          />

          <AppButton
            label="Edit Arabic Text"
            variant="ghost"
            onPress={() => router.back()}
          />

          <AppText variant="caption" muted align="center">
            Your selected method stays in the current quiz draft.
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

  previewCard: {
    gap: spacing.lg,
  },

  previewHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  previewHeadingText: {
    flex: 1,
    gap: spacing.xs,
  },

  arabicPreview: {
    maxHeight: 180,
    overflow: "hidden",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSoft,
  },

  methods: {
    gap: spacing.lg,
  },

  warning: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: radius.lg,
    backgroundColor: colors.warningSoft,
  },

  warningText: {
    flex: 1,
    color: colors.warning,
    fontWeight: "600",
  },

  footer: {
    gap: spacing.md,
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
