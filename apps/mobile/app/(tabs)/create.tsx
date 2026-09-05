import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  ArabicInputStats,
  InputTipsCard,
  InputValidationCard,
} from "../../src/components/create";
import { AppHeader, AppScreen } from "../../src/components/layout";
import {
  AppButton,
  AppCard,
  AppInput,
  AppText,
  StepIndicator,
} from "../../src/components/ui";
import { useQuizStore } from "../../src/store/quizStore";
import {
  getArabicInputStats,
  validateArabicInput,
} from "../../src/utils/arabicInput";
import { colors, iconSize, radius, spacing } from "../../src/theme";

const DEMO_TEXT = `إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى
فمن كانت هجرته إلى الله ورسوله
فهجرته إلى الله ورسوله`;

export default function CreateScreen() {
  const text = useQuizStore((state) => state.text);

  const setText = useQuizStore((state) => state.setText);

  const clearText = useQuizStore((state) => state.clearText);

  const stats = getArabicInputStats(text);

  const validation = validateArabicInput(text);

  function handleContinue() {
    if (!validation.valid) {
      return;
    }

    router.push("/create/method");
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Create Quiz"
          subtitle="Step 1 of 3"
          rightIcon="help-circle-outline"
          onRightPress={() => undefined}
        />

        <View style={styles.intro}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="create-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">Add Arabic Text</AppText>

            <AppText muted>
              Paste Quran or matn text that you want to memorize.
            </AppText>
          </View>
        </View>

        <StepIndicator current={1} total={3} />

        <View style={styles.section}>
          <AppInput
            value={text}
            onChangeText={setText}
            arabic
            multiline
            maxLength={5000}
            label="Quran or Matn Text"
            placeholder="أدخل النص"
            accessibilityLabel="Arabic Quran or matn text"
            autoCorrect={false}
            autoCapitalize="none"
          />

          {text.length === 0 ? (
            <AppButton
              label="Load Demo Text"
              variant="secondary"
              onPress={() => setText(DEMO_TEXT)}
            />
          ) : (
            <AppButton label="Clear Text" variant="ghost" onPress={clearText} />
          )}
        </View>

        <ArabicInputStats stats={stats} />

        <InputValidationCard
          valid={validation.valid}
          message={validation.message}
        />

        <AppCard style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Ionicons
              name="eye-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText variant="subheading">Quiz Preview Status</AppText>
          </View>

          <View style={styles.previewRows}>
            <View style={styles.previewRow}>
              <AppText variant="bodySmall" muted>
                Arabic characters
              </AppText>

              <AppText variant="bodySmall" style={styles.previewValue}>
                {stats.arabicCharacters}
              </AppText>
            </View>

            <View style={styles.previewRow}>
              <AppText variant="bodySmall" muted>
                Available words
              </AppText>

              <AppText variant="bodySmall" style={styles.previewValue}>
                {stats.words}
              </AppText>
            </View>

            <View style={styles.previewRow}>
              <AppText variant="bodySmall" muted>
                Available lines
              </AppText>

              <AppText variant="bodySmall" style={styles.previewValue}>
                {stats.lines}
              </AppText>
            </View>
          </View>
        </AppCard>

        <InputTipsCard />

        <View style={styles.footer}>
          <AppButton
            label="Continue to Quiz Method"
            size="lg"
            disabled={!validation.valid}
            onPress={handleContinue}
          />

          <AppText variant="caption" muted align="center">
            Your text stays available while moving through quiz setup.
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

  iconContainer: {
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

  section: {
    gap: spacing.md,
  },

  previewCard: {
    gap: spacing.lg,
  },

  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  previewRows: {
    gap: spacing.md,
  },

  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  previewValue: {
    color: colors.primary,
    fontWeight: "800",
  },

  footer: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
});
