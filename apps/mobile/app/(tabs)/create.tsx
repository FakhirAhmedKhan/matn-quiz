import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppScreen } from "../../src/components/layout";
import {
  AppButton,
  AppCard,
  AppText,
  ArabicText,
  StepIndicator,
} from "../../src/components/ui";
import {
  colors,
  spacing,
} from "../../src/theme";

export default function CreateTabScreen() {
  return (
    <AppScreen>
      <View style={styles.page}>
        <AppText
          variant="caption"
          style={styles.eyebrow}
        >
          CREATE QUIZ
        </AppText>

        <AppText variant="title">
          Paste Arabic Text
        </AppText>

        <AppText muted>
          This is the M3 navigation placeholder for Step 1.
          The real Arabic input screen will be implemented next.
        </AppText>

        <StepIndicator
          current={1}
          total={3}
        />

        <AppCard>
          <ArabicText>
            إنما الأعمال بالنيات وإنما لكل امرئ ما نوى
          </ArabicText>
        </AppCard>

        <AppButton
          label="Continue to Method"
          onPress={() =>
            router.push("/create/method")
          }
        />
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
});