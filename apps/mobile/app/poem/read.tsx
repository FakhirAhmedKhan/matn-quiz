import {
  useEffect,
  useMemo,
  useState,
} from "react";
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
  AllVersesReader,
  FocusedVerseCard,
  PoemFontControls,
  PoemNavigationControls,
  PoemReaderModeToggle,
  type PoemFontSize,
  type PoemReaderMode,
} from "../../src/components/poem-reader";
import {
  AppHeader,
  AppScreen,
} from "../../src/components/layout";
import {
  AppButton,
  AppCard,
  AppText,
  ArabicText,
  ProgressBar,
} from "../../src/components/ui";
import {
  usePoemStore,
} from "../../src/store/poemStore";
import {
  getPoemStats,
  getPoemVerses,
  validatePoemDraft,
} from "../../src/utils/poem";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../src/theme";

export default function PoemReaderScreen() {
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

  const verses =
    useMemo(
      () =>
        getPoemVerses(
          text,
        ),
      [text],
    );

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    mode,
    setMode,
  ] = useState<PoemReaderMode>(
    "FOCUS",
  );

  const [
    fontSize,
    setFontSize,
  ] = useState<PoemFontSize>(
    "MEDIUM",
  );

  useEffect(() => {
    setCurrentIndex(
      (current) => {
        if (
          verses.length === 0
        ) {
          return 0;
        }

        return Math.min(
          current,
          verses.length - 1,
        );
      },
    );
  }, [verses.length]);

  const currentVerse =
    verses[
      currentIndex
    ] ?? "";

  const progress =
    verses.length <= 0
      ? 0
      : (currentIndex + 1) /
        verses.length;

  const percentage =
    Math.round(
      progress * 100,
    );

  function previousVerse() {
    setCurrentIndex(
      (current) =>
        Math.max(
          0,
          current - 1,
        ),
    );
  }

  function nextVerse() {
    setCurrentIndex(
      (current) =>
        Math.min(
          verses.length - 1,
          current + 1,
        ),
    );
  }

  function firstVerse() {
    setCurrentIndex(0);
  }

  function lastVerse() {
    setCurrentIndex(
      Math.max(
        0,
        verses.length - 1,
      ),
    );
  }

  function resetReader() {
    setCurrentIndex(0);
    setMode("FOCUS");
    setFontSize("MEDIUM");
  }

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
              Create a valid Arabic poem before
              opening focused reader mode.
            </AppText>

            <AppButton
              label="Open Poem Editor"
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
          subtitle={`${verses.length} verses`}
          showBack
          onBack={() =>
            router.back()
          }
        />

        <AppCard style={styles.poemHeader}>
          <View style={styles.poemIcon}>
            <Ionicons
              name="book-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.poemTitle}>
            <ArabicText
              size="large"
              center
            >
              {title}
            </ArabicText>

            <AppText
              variant="caption"
              muted
              align="center"
            >
              {stats.words} words · {stats.stanzas} stanzas
            </AppText>
          </View>
        </AppCard>

        <AppCard style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressTitle}>
              <Ionicons
                name="footsteps-outline"
                size={iconSize.md}
                color={colors.primary}
              />

              <AppText variant="subheading">
                Reading Progress
              </AppText>
            </View>

            <AppText
              variant="subheading"
              style={styles.progressValue}
            >
              {percentage}%
            </AppText>
          </View>

          <ProgressBar
            value={progress}
          />

          <View style={styles.progressFooter}>
            <AppText
              variant="caption"
              muted
            >
              Verse {currentIndex + 1}
            </AppText>

            <AppText
              variant="caption"
              muted
            >
              {verses.length} total
            </AppText>
          </View>
        </AppCard>

        <PoemReaderModeToggle
          mode={mode}
          onChange={setMode}
        />

        <PoemFontControls
          value={fontSize}
          onChange={setFontSize}
        />

        {mode === "FOCUS" ? (
          <>
            <FocusedVerseCard
              verse={currentVerse}
              verseNumber={
                currentIndex + 1
              }
              totalVerses={
                verses.length
              }
              fontSize={
                fontSize
              }
            />

            <PoemNavigationControls
              currentIndex={
                currentIndex
              }
              total={
                verses.length
              }
              onPrevious={
                previousVerse
              }
              onNext={
                nextVerse
              }
              onFirst={
                firstVerse
              }
              onLast={
                lastVerse
              }
            />
          </>
        ) : (
          <>
            <View style={styles.allHeading}>
              <View style={styles.allTitle}>
                <Ionicons
                  name="reader-outline"
                  size={iconSize.md}
                  color={colors.primary}
                />

                <AppText variant="subheading">
                  Full Poem
                </AppText>
              </View>

              <AppText
                variant="caption"
                muted
              >
                Current verse highlighted
              </AppText>
            </View>

            <AllVersesReader
              verses={verses}
              activeIndex={
                currentIndex
              }
              fontSize={
                fontSize
              }
            />

            <PoemNavigationControls
              currentIndex={
                currentIndex
              }
              total={
                verses.length
              }
              onPrevious={
                previousVerse
              }
              onNext={
                nextVerse
              }
              onFirst={
                firstVerse
              }
              onLast={
                lastVerse
              }
            />
          </>
        )}

        <View style={styles.memorizationTip}>
          <Ionicons
            name="school-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <View style={styles.tipText}>
            <AppText variant="subheading">
              Memorization Tip
            </AppText>

            <AppText
              variant="bodySmall"
              muted
            >
              Read the current verse several times,
              look away, recite it from memory, then
              move to the next verse.
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <AppButton
            label="Edit Poem"
            variant="secondary"
            onPress={() =>
              router.push(
                "/poem",
              )
            }
          />

          <AppButton
            label="Reset Reader"
            variant="ghost"
            onPress={
              resetReader
            }
          />
        </View>

        <AppText
          variant="caption"
          muted
          align="center"
        >
          Reader controls affect only this reading
          session and do not modify your poem text.
        </AppText>
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

  poemHeader: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },

  poemIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  poemTitle: {
    width: "100%",
    gap: spacing.sm,
  },

  progressCard: {
    gap: spacing.md,
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  progressTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  progressValue: {
    color: colors.primary,
    fontWeight: "900",
  },

  progressFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  allHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  allTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  memorizationTip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  tipText: {
    flex: 1,
    gap: spacing.xs,
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