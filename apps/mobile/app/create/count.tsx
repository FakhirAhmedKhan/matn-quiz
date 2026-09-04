import {
  useEffect,
} from "react";
import { router } from "expo-router";
import {
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  HideCountPresets,
  HideCountSelector,
  QuizSetupSummary,
} from "../../src/components/create";
import {
  AppHeader,
  AppScreen,
} from "../../src/components/layout";
import {
  AppButton,
  AppCard,
  AppText,
  ArabicText,
  StepIndicator,
} from "../../src/components/ui";
import { useQuizStore } from "../../src/store/quizStore";
import {
  getArabicInputStats,
  validateArabicInput,
} from "../../src/utils/arabicInput";
import {
  clampHideCount,
  getHideCountPresets,
  getItemLabel,
  getMaximumHideCount,
  getMethodLabel,
} from "../../src/utils/quizSetup";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../src/theme";

export default function CreateCountScreen() {
  const text =
    useQuizStore(
      (state) => state.text,
    );

  const method =
    useQuizStore(
      (state) => state.method,
    );

  const hideCount =
    useQuizStore(
      (state) => state.hideCount,
    );

  const setHideCount =
    useQuizStore(
      (state) => state.setHideCount,
    );

  const stats =
    getArabicInputStats(text);

  const validation =
    validateArabicInput(text);

  const maximum =
    getMaximumHideCount(
      method,
      stats.words,
      stats.lines,
    );

  const presets =
    getHideCountPresets(
      maximum,
    );

  const safeCount =
    clampHideCount(
      hideCount,
      maximum,
    );

  const canGenerate =
    validation.valid &&
    maximum >= 1 &&
    safeCount >= 1 &&
    safeCount <= maximum;

  useEffect(() => {
    if (
      maximum > 0 &&
      hideCount !== safeCount
    ) {
      setHideCount(
        safeCount,
      );
    }
  }, [
    hideCount,
    maximum,
    safeCount,
    setHideCount,
  ]);

  function updateCount(
    value: number,
  ) {
    const next =
      clampHideCount(
        value,
        maximum,
      );

    if (next > 0) {
      setHideCount(next);
    }
  }

  function generateQuiz() {
    if (!canGenerate) {
      return;
    }

    if (
      hideCount !== safeCount
    ) {
      setHideCount(
        safeCount,
      );
    }

    router.push(
      "/study",
    );
  }

  if (
    !validation.valid ||
    maximum < 1
  ) {
    return (
      <AppScreen>
        <View style={styles.page}>
          <AppHeader
            title="Hide Count"
            subtitle="Step 3 of 3"
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
              Quiz Setup Needs Attention
            </AppText>

            <AppText
              muted
              align="center"
            >
              Your text or selected method does
              not currently have enough items to
              generate a quiz.
            </AppText>

            <AppButton
              label="Back to Quiz Method"
              onPress={() =>
                router.replace(
                  "/create/method",
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
          title="Hide Count"
          subtitle="Step 3 of 3"
          showBack
          onBack={() =>
            router.back()
          }
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
            <AppText variant="title">
              How many should we hide?
            </AppText>

            <AppText muted>
              Choose the difficulty for your
              {method === "HIDE_WORD"
                ? " word"
                : " line"}{" "}
              recall quiz.
            </AppText>
          </View>
        </View>

        <StepIndicator
          current={3}
          total={3}
        />

        <AppCard style={styles.methodCard}>
          <View style={styles.methodRow}>
            <View style={styles.methodIcon}>
              <Ionicons
                name={
                  method === "HIDE_WORD"
                    ? "text-outline"
                    : "reorder-three-outline"
                }
                size={iconSize.md}
                color={colors.primary}
              />
            </View>

            <View style={styles.methodContent}>
              <AppText variant="subheading">
                {getMethodLabel(method)}
              </AppText>

              <AppText
                variant="bodySmall"
                muted
              >
                {maximum}{" "}
                {getItemLabel(
                  method,
                  maximum,
                )}{" "}
                available
              </AppText>
            </View>

            <AppButton
              label="Change"
              variant="ghost"
              size="sm"
              onPress={() =>
                router.back()
              }
            />
          </View>
        </AppCard>

        <View style={styles.selectorSection}>
          <AppText
            variant="subheading"
            align="center"
          >
            Hidden Items
          </AppText>

          <HideCountSelector
            value={safeCount}
            maximum={maximum}
            onChange={updateCount}
          />

          <AppText
            variant="bodySmall"
            muted
            align="center"
          >
            Minimum 1 · Maximum {maximum}
          </AppText>
        </View>

        <View style={styles.presetsSection}>
          <AppText
            variant="bodySmall"
            muted
            align="center"
          >
            Quick presets
          </AppText>

          <HideCountPresets
            values={presets}
            selectedValue={safeCount}
            onSelect={updateCount}
          />
        </View>

        <AppCard style={styles.previewCard}>
          <View style={styles.previewHeading}>
            <Ionicons
              name="reader-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <View style={styles.previewHeadingText}>
              <AppText variant="subheading">
                Source Preview
              </AppText>

              <AppText
                variant="caption"
                muted
              >
                {stats.words} words · {stats.lines} lines
              </AppText>
            </View>
          </View>

          <View style={styles.arabicPreview}>
            <ArabicText
              size="small"
              numberOfLines={4}
            >
              {text}
            </ArabicText>
          </View>
        </AppCard>

        <QuizSetupSummary
          method={method}
          hideCount={safeCount}
          availableItems={maximum}
          words={stats.words}
          lines={stats.lines}
        />

        <View style={styles.readyCard}>
          <Ionicons
            name="checkmark-circle-outline"
            size={iconSize.md}
            color={colors.success}
          />

          <AppText
            variant="bodySmall"
            style={styles.readyText}
          >
            Ready to generate a{" "}
            {getMethodLabel(method)} quiz with{" "}
            {safeCount} hidden{" "}
            {getItemLabel(
              method,
              safeCount,
            )}.
          </AppText>
        </View>

        <View style={styles.footer}>
          <AppButton
            label="Generate Demo Quiz"
            size="lg"
            disabled={!canGenerate}
            onPress={generateQuiz}
          />

          <AppButton
            label="Back to Method"
            variant="ghost"
            onPress={() =>
              router.back()
            }
          />

          <AppText
            variant="caption"
            muted
            align="center"
          >
            M8 will replace the placeholder study
            destination with the real demo quiz engine.
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

  methodCard: {
    paddingVertical: spacing.md,
  },

  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  methodIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },

  methodContent: {
    flex: 1,
    gap: spacing.xs,
  },

  selectorSection: {
    gap: spacing.xl,
    paddingVertical: spacing.lg,
  },

  presetsSection: {
    gap: spacing.md,
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

  readyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.lg,
    backgroundColor: colors.successSoft,
  },

  readyText: {
    flex: 1,
    color: colors.success,
    fontWeight: "700",
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
    backgroundColor: colors.warningSoft,
  },
});