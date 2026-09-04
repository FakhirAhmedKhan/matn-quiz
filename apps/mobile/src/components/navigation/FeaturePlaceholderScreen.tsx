import type { Href } from "expo-router";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppHeader, AppScreen } from "../layout";
import {
  AppButton,
  AppCard,
  AppText,
} from "../ui";
import {
  colors,
  spacing,
} from "../../theme";

type FeaturePlaceholderScreenProps = {
  title: string;
  eyebrow: string;
  description: string;
  nextLabel?: string;
  nextHref?: Href;
};

export function FeaturePlaceholderScreen({
  title,
  eyebrow,
  description,
  nextLabel,
  nextHref,
}: FeaturePlaceholderScreenProps) {
  return (
    <AppScreen>
      <AppHeader
        title={title}
        showBack
        onBack={() => router.back()}
      />

      <View style={styles.page}>
        <AppText
          variant="caption"
          style={styles.eyebrow}
        >
          {eyebrow}
        </AppText>

        <AppText variant="title">
          {title}
        </AppText>

        <AppText muted>
          {description}
        </AppText>

        <AppCard style={styles.card}>
          <AppText variant="subheading">
            Navigation Ready
          </AppText>

          <AppText
            variant="bodySmall"
            muted
          >
            This screen is part of the M3 navigation architecture.
            Real UI and demo logic will be implemented in the next
            mobile phases.
          </AppText>
        </AppCard>

        {nextLabel && nextHref ? (
          <AppButton
            label={nextLabel}
            onPress={() => router.push(nextHref)}
          />
        ) : null}
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

  card: {
    gap: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
});