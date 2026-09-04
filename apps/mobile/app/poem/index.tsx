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
  PoemInputStats,
  PoemPreviewCard,
  PoemTipsCard,
  PoemValidationCard,
} from "../../src/components/poem";
import {
  AppHeader,
  AppScreen,
} from "../../src/components/layout";
import {
  AppButton,
  AppCard,
  AppInput,
  AppText,
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

export default function PoemInputScreen() {
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

  const setTitle =
    usePoemStore(
      (state) =>
        state.setTitle,
    );

  const setText =
    usePoemStore(
      (state) =>
        state.setText,
    );

  const loadDemoPoem =
    usePoemStore(
      (state) =>
        state.loadDemoPoem,
    );

  const clearPoem =
    usePoemStore(
      (state) =>
        state.clearPoem,
    );

  const stats =
    getPoemStats(
      text,
    );

  const validation =
    validatePoemDraft(
      title,
      text,
    );

  const hasDraft =
    Boolean(
      title.trim() ||
      text.trim(),
    );

  function openReader() {
    if (
      !validation.valid
    ) {
      return;
    }

    router.push(
      "/poem/read",
    );
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Arabic Poem"
          subtitle="Create a poem reader draft"
          showBack
          onBack={() =>
            router.back()
          }
        />

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="book-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">
              Add Your Poem
            </AppText>

            <AppText muted>
              Enter an Arabic poem and prepare it
              for focused reading and memorization.
            </AppText>
          </View>
        </View>

        <AppCard style={styles.editorCard}>
          <View style={styles.editorHeader}>
            <Ionicons
              name="create-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText variant="subheading">
              Poem Details
            </AppText>
          </View>

          <AppInput
            value={title}
            onChangeText={
              setTitle
            }
            arabic
            maxLength={120}
            label="Poem Title"
            placeholder="أدخل عنوان القصيدة"
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Arabic poem title"
          />

          <AppInput
            value={text}
            onChangeText={
              setText
            }
            arabic
            multiline
            maxLength={12000}
            label="Poem Text"
            placeholder={`أدخل أبيات القصيدة هنا

ضع كل بيت أو سطر في سطر مستقل`}
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Arabic poem text"
          />
        </AppCard>

        <View style={styles.helperActions}>
          {!hasDraft ? (
            <AppButton
              label="Load Demo Poem"
              variant="secondary"
              onPress={
                loadDemoPoem
              }
            />
          ) : (
            <>
              <AppButton
                label="Replace with Demo Poem"
                variant="secondary"
                onPress={
                  loadDemoPoem
                }
              />

              <AppButton
                label="Clear Poem"
                variant="ghost"
                onPress={
                  clearPoem
                }
              />
            </>
          )}
        </View>

        <PoemInputStats
          stats={stats}
        />

        <PoemValidationCard
          valid={
            validation.valid
          }
          message={
            validation.message
          }
        />

        <AppCard style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Ionicons
              name="analytics-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText variant="subheading">
              Text Details
            </AppText>
          </View>

          <View style={styles.detailsRows}>
            <View style={styles.detailsRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Characters
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.detailsValue}
              >
                {stats.characters}
              </AppText>
            </View>

            <View style={styles.detailsRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Arabic characters
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.detailsValue}
              >
                {stats.arabicCharacters}
              </AppText>
            </View>

            <View style={styles.detailsRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Non-empty verses
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.detailsValue}
              >
                {stats.verses}
              </AppText>
            </View>

            <View style={styles.detailsRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Stanzas
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.detailsValue}
              >
                {stats.stanzas}
              </AppText>
            </View>
          </View>
        </AppCard>

        <PoemPreviewCard
          title={title}
          text={text}
        />

        <PoemTipsCard />

        <View style={styles.footer}>
          <AppButton
            label="Open Poem Reader"
            size="lg"
            disabled={
              !validation.valid
            }
            onPress={
              openReader
            }
          />

          <AppText
            variant="caption"
            muted
            align="center"
          >
            Your poem draft stays available while
            moving to reader mode.
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

  editorCard: {
    gap: spacing.lg,
  },

  editorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  helperActions: {
    gap: spacing.sm,
  },

  detailsCard: {
    gap: spacing.lg,
  },

  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  detailsRows: {
    gap: spacing.md,
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  detailsValue: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  footer: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
});