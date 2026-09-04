import {
  router,
} from "expo-router";
import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import {
  AppHeader,
  AppScreen,
} from "../../src/components/layout";
import {
  AppButton,
  AppCard,
  AppText,
  ArabicText,
} from "../../src/components/ui";
import {
  usePoemStore,
} from "../../src/store/poemStore";
import {
  getPoemStats,
  validatePoemDraft,
} from "../../src/utils/poem";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../src/theme";

export default function PoemReaderHandoffScreen() {
  const title =
    usePoemStore(
      (state) =>
        state.title,
    );

  const text =
    usePoemStore(
      (state) =>
        state.text,
    );

  const validation =
    validatePoemDraft(
      title,
      text,
    );

  const stats =
    getPoemStats(
      text,
    );

  if (!validation.valid) {
    return (
      <AppScreen>
        <View style={styles.page}>
          <AppHeader
            title="Poem Reader"
            showBack
            onBack={() =>
              router.back()
            }
          />

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="document-text-outline"
                size={iconSize.xl}
                color={colors.primary}
              />
            </View>

            <AppText
              variant="title"
              align="center"
            >
              Add a Poem First
            </AppText>

            <AppText
              muted
              align="center"
            >
              Create a valid Arabic poem draft
              before opening reader mode.
            </AppText>

            <AppButton
              label="Go to Poem Editor"
              onPress={() =>
                router.replace(
                  "/poem",
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
          title="Poem Reader"
          subtitle={`${stats.verses} verses`}
          showBack
          onBack={() =>
            router.back()
          }
        />

        <View style={styles.ready}>
          <Ionicons
            name="checkmark-circle-outline"
            size={iconSize.md}
            color={colors.success}
          />

          <AppText
            variant="bodySmall"
            style={styles.readyText}
          >
            Poem draft loaded successfully.
          </AppText>
        </View>

        <AppCard style={styles.readerCard}>
          <View style={styles.title}>
            <ArabicText
              size="large"
              center
            >
              {title}
            </ArabicText>
          </View>

          <View style={styles.divider} />

          <ArabicText
            size="medium"
          >
            {text}
          </ArabicText>
        </AppCard>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <AppText
              variant="caption"
              muted
            >
              Verses
            </AppText>

            <AppText
              variant="subheading"
              style={styles.summaryValue}
            >
              {stats.verses}
            </AppText>
          </View>

          <View style={styles.summaryItem}>
            <AppText
              variant="caption"
              muted
            >
              Words
            </AppText>

            <AppText
              variant="subheading"
              style={styles.summaryValue}
            >
              {stats.words}
            </AppText>
          </View>

          <View style={styles.summaryItem}>
            <AppText
              variant="caption"
              muted
            >
              Stanzas
            </AppText>

            <AppText
              variant="subheading"
              style={styles.summaryValue}
            >
              {stats.stanzas}
            </AppText>
          </View>
        </View>

        <AppButton
          label="Edit Poem"
          variant="secondary"
          onPress={() =>
            router.back()
          }
        />

        <View style={styles.nextPhase}>
          <Ionicons
            name="information-circle-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <AppText
            variant="bodySmall"
            style={styles.nextPhaseText}
          >
            The poem draft and reader handoff are
            complete. M14 will add the full focused
            reader experience and reading controls.
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

  ready: {
    flexDirection: "row",
    alignItems: "center",
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

  readerCard: {
    gap: spacing.xl,
    paddingVertical: spacing.xxl,
  },

  title: {
    paddingHorizontal: spacing.md,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  summary: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  summaryValue: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  nextPhase: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  nextPhaseText: {
    flex: 1,
    color: colors.primaryDark,
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