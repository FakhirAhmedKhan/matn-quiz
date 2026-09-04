import { AccessibilityStatusCard } from "../../src/components/accessibility";
import { PersistenceStatusCard } from "../../src/components/persistence";
import { useAppHydration } from "../../src/hooks/useAppHydration";
import {
  Alert,
  StyleSheet,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  SettingsChoiceChips,
  SettingsLabel,
  SettingsSection,
  SettingsStepper,
} from "../../src/components/settings";

import {
  AppHeader,
  AppScreen,
} from "../../src/components/layout";

import {
  AppButton,
  AppCard,
  AppText,
} from "../../src/components/ui";

import {
  useAudioStore,
} from "../../src/store/audioStore";

import {
  useBookStore,
} from "../../src/store/bookStore";

import {
  usePoemStore,
} from "../../src/store/poemStore";

import {
  useQuizStore,
} from "../../src/store/quizStore";

import {
  DEFAULT_APP_SETTINGS,
  useSettingsStore,
} from "../../src/store/settingsStore";

import type {
  AudioRepeatMode,
  AudioSpeed,
} from "../../src/types/audio";

import type {
  QuizMethod,
} from "../../src/types/quiz";

import type {
  BookReaderModePreference,
  PoemReaderModePreference,
  ReaderFontSizePreference,
} from "../../src/types/settings";

import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../src/theme";

const QUIZ_METHOD_OPTIONS = [
  {
    value:
      "HIDE_WORD",
    label:
      "Hide Words",
  },
  {
    value:
      "HIDE_LINE",
    label:
      "Hide Lines",
  },
] as const satisfies readonly {
  value: QuizMethod;
  label: string;
}[];

const FONT_OPTIONS = [
  {
    value:
      "SMALL",
    label:
      "Small",
  },
  {
    value:
      "MEDIUM",
    label:
      "Medium",
  },
  {
    value:
      "LARGE",
    label:
      "Large",
  },
] as const satisfies readonly {
  value: ReaderFontSizePreference;
  label: string;
}[];

const POEM_MODE_OPTIONS = [
  {
    value:
      "FOCUS",
    label:
      "Focus",
  },
  {
    value:
      "ALL",
    label:
      "Show All",
  },
] as const satisfies readonly {
  value: PoemReaderModePreference;
  label: string;
}[];

const BOOK_MODE_OPTIONS = [
  {
    value:
      "READING",
    label:
      "Reading",
  },
  {
    value:
      "FOCUS",
    label:
      "Focus",
  },
] as const satisfies readonly {
  value: BookReaderModePreference;
  label: string;
}[];

const AUDIO_SPEED_OPTIONS = [
  {
    value:
      0.75,
    label:
      "0.75×",
  },
  {
    value:
      1,
    label:
      "1×",
  },
  {
    value:
      1.25,
    label:
      "1.25×",
  },
  {
    value:
      1.5,
    label:
      "1.5×",
  },
] as const satisfies readonly {
  value: AudioSpeed;
  label: string;
}[];

const AUDIO_REPEAT_OPTIONS = [
  {
    value:
      "ONE",
    label:
      "1×",
  },
  {
    value:
      "TWO",
    label:
      "2×",
  },
  {
    value:
      "THREE",
    label:
      "3×",
  },
  {
    value:
      "INFINITE",
    label:
      "∞",
  },
] as const satisfies readonly {
  value: AudioRepeatMode;
  label: string;
}[];

export default function SettingsScreen() {
  const appHydrated =
    useAppHydration();
  const defaultQuizMethod =
    useSettingsStore(
      (state) =>
        state.defaultQuizMethod,
    );

  const defaultHideCount =
    useSettingsStore(
      (state) =>
        state.defaultHideCount,
    );

  const readerFontSize =
    useSettingsStore(
      (state) =>
        state.readerFontSize,
    );

  const defaultPoemReaderMode =
    useSettingsStore(
      (state) =>
        state.defaultPoemReaderMode,
    );

  const defaultBookReaderMode =
    useSettingsStore(
      (state) =>
        state.defaultBookReaderMode,
    );

  const defaultAudioSpeed =
    useSettingsStore(
      (state) =>
        state.defaultAudioSpeed,
    );

  const defaultAudioRepeat =
    useSettingsStore(
      (state) =>
        state.defaultAudioRepeat,
    );

  const setDefaultQuizMethod =
    useSettingsStore(
      (state) =>
        state.setDefaultQuizMethod,
    );

  const setDefaultHideCount =
    useSettingsStore(
      (state) =>
        state.setDefaultHideCount,
    );

  const setReaderFontSize =
    useSettingsStore(
      (state) =>
        state.setReaderFontSize,
    );

  const setDefaultPoemReaderMode =
    useSettingsStore(
      (state) =>
        state.setDefaultPoemReaderMode,
    );

  const setDefaultBookReaderMode =
    useSettingsStore(
      (state) =>
        state.setDefaultBookReaderMode,
    );

  const setDefaultAudioSpeed =
    useSettingsStore(
      (state) =>
        state.setDefaultAudioSpeed,
    );

  const setDefaultAudioRepeat =
    useSettingsStore(
      (state) =>
        state.setDefaultAudioRepeat,
    );

  const resetSettings =
    useSettingsStore(
      (state) =>
        state.resetSettings,
    );

  const quizHistoryCount =
    useQuizStore(
      (state) =>
        state.historySessions.length,
    );

  const bookCount =
    useBookStore(
      (state) =>
        state.books.length,
    );

  const importedBookCount =
    useBookStore(
      (state) =>
        state.books.filter(
          (book) =>
            book.sourceType ===
            "IMPORTED",
        ).length,
    );

  function changeAudioSpeed(
    value: AudioSpeed,
  ) {
    setDefaultAudioSpeed(
      value,
    );

    useAudioStore
      .getState()
      .setSpeed(value);
  }

  function changeAudioRepeat(
    value: AudioRepeatMode,
  ) {
    setDefaultAudioRepeat(
      value,
    );

    useAudioStore
      .getState()
      .setRepeatMode(value);
  }

  function applyQuizDefaultsNow() {
    const quiz =
      useQuizStore.getState();

    quiz.setMethod(
      defaultQuizMethod,
    );

    quiz.setHideCount(
      defaultHideCount,
    );
  }

  function resetPreferenceDefaults() {
    resetSettings();

    useAudioStore
      .getState()
      .resetAudioSettings();
  }

  function clearQuizDraft() {
    useQuizStore
      .getState()
      .resetDraft();
  }

  function clearQuizHistory() {
    useQuizStore
      .getState()
      .clearHistory();
  }

  function clearPoemDraft() {
    usePoemStore
      .getState()
      .clearPoem();
  }

  function resetBookLibrary() {
    useBookStore
      .getState()
      .resetLibraryDemo();
  }

  function resetAudioSession() {
    useAudioStore
      .getState()
      .resetAudioSettings();
  }

  function resetAllDemoData() {
    Alert.alert(
      "Reset Demo Data",
      "This will clear quiz drafts, history, poem data, imported books and current audio settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset All",
          style: "destructive",
          onPress: () => {
            useSettingsStore
              .getState()
              .resetSettings();

            useQuizStore
              .getState()
              .resetDraft();

            useQuizStore
              .getState()
              .clearHistory();

            usePoemStore
              .getState()
              .clearPoem();

            useBookStore
              .getState()
              .resetLibraryDemo();

            useAudioStore
              .getState()
              .resetAudioSettings();
          },
        },
      ],
    );
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Settings"
          subtitle="App defaults & demo controls"
        />

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="settings-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">
              Personalize Matn Quiz
            </AppText>

            <AppText muted>
              Configure quiz, reader and audio
              defaults for your study workflow.
            </AppText>
          </View>
        </View>

        <PersistenceStatusCard
          hydrated={appHydrated}
        />

        <View style={styles.memoryNotice}>
          <Ionicons
            name="save-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <AppText
            variant="bodySmall"
            style={styles.memoryNoticeText}
          >
            Settings, quiz progress, history,
            poem drafts and library state are
            stored locally on this device using
            AsyncStorage.
          </AppText>
        </View>

        <SettingsSection
          title="Quiz Defaults"
          description="Defaults for a new quiz draft"
          icon="school-outline"
        >
          <SettingsLabel
            title="Quiz Method"
            description="Choose the preferred memorization method."
          />

          <SettingsChoiceChips
            value={
              defaultQuizMethod
            }
            options={
              QUIZ_METHOD_OPTIONS
            }
            onChange={
              setDefaultQuizMethod
            }
          />

          <View style={styles.separator} />

          <SettingsLabel
            title="Default Hide Count"
            description="Starting difficulty for a new quiz."
          />

          <SettingsStepper
            value={
              defaultHideCount
            }
            minimum={1}
            maximum={10}
            onChange={
              setDefaultHideCount
            }
          />

          <AppButton
            label="Apply Defaults to Current Quiz"
            variant="secondary"
            onPress={
              applyQuizDefaultsNow
            }
          />

          <AppText
            variant="caption"
            muted
            align="center"
          >
            Applying now changes the current quiz
            method/count and clears any generated
            study session for that draft.
          </AppText>
        </SettingsSection>

        <SettingsSection
          title="Arabic Reader"
          description="Default reading presentation"
          icon="reader-outline"
        >
          <SettingsLabel
            title="Arabic Text Size"
            description="Used when opening Poem and Book readers."
          />

          <SettingsChoiceChips
            value={
              readerFontSize
            }
            options={
              FONT_OPTIONS
            }
            onChange={
              setReaderFontSize
            }
          />

          <View style={styles.separator} />

          <SettingsLabel
            title="Poem Reader Mode"
            description="Choose how a poem opens by default."
          />

          <SettingsChoiceChips
            value={
              defaultPoemReaderMode
            }
            options={
              POEM_MODE_OPTIONS
            }
            onChange={
              setDefaultPoemReaderMode
            }
          />

          <View style={styles.separator} />

          <SettingsLabel
            title="Book Reader Mode"
            description="Choose the initial book-reader experience."
          />

          <SettingsChoiceChips
            value={
              defaultBookReaderMode
            }
            options={
              BOOK_MODE_OPTIONS
            }
            onChange={
              setDefaultBookReaderMode
            }
          />
        </SettingsSection>

        <SettingsSection
          title="Audio Defaults"
          description="Defaults for Arabic listening practice"
          icon="headset-outline"
        >
          <SettingsLabel
            title="Playback Speed"
            description="Used when audio settings are reset."
          />

          <SettingsChoiceChips
            value={
              String(
                defaultAudioSpeed,
              )
            }
            options={
              AUDIO_SPEED_OPTIONS.map(
                (option) => ({
                  value:
                    String(
                      option.value,
                    ),
                  label:
                    option.label,
                }),
              )
            }
            onChange={(value) =>
              changeAudioSpeed(
                Number(
                  value,
                ) as AudioSpeed,
              )
            }
          />

          <View style={styles.separator} />

          <SettingsLabel
            title="Repeat Count"
            description="Default repetition for a selected Arabic segment."
          />

          <SettingsChoiceChips
            value={
              defaultAudioRepeat
            }
            options={
              AUDIO_REPEAT_OPTIONS
            }
            onChange={
              changeAudioRepeat
            }
          />

          <AppButton
            label="Reset Current Audio to Defaults"
            variant="secondary"
            onPress={
              resetAudioSession
            }
          />
        </SettingsSection>

        <SettingsSection
          title="Demo Data"
          description="Manage local prototype data"
          icon="flask-outline"
        >
          <View style={styles.dataStats}>
            <View style={styles.dataStat}>
              <AppText
                variant="title"
                align="center"
                style={styles.dataValue}
              >
                {quizHistoryCount}
              </AppText>

              <AppText
                variant="caption"
                muted
                align="center"
              >
                Quiz Results
              </AppText>
            </View>

            <View style={styles.dataDivider} />

            <View style={styles.dataStat}>
              <AppText
                variant="title"
                align="center"
                style={styles.dataValue}
              >
                {bookCount}
              </AppText>

              <AppText
                variant="caption"
                muted
                align="center"
              >
                Books
              </AppText>
            </View>

            <View style={styles.dataDivider} />

            <View style={styles.dataStat}>
              <AppText
                variant="title"
                align="center"
                style={styles.dataValue}
              >
                {importedBookCount}
              </AppText>

              <AppText
                variant="caption"
                muted
                align="center"
              >
                Imported
              </AppText>
            </View>
          </View>

          <AppButton
            label="Clear Current Quiz Draft"
            variant="ghost"
            onPress={
              clearQuizDraft
            }
          />

          <AppButton
            label="Clear Quiz History"
            variant="ghost"
            onPress={
              clearQuizHistory
            }
          />

          <AppButton
            label="Clear Poem Draft"
            variant="ghost"
            onPress={
              clearPoemDraft
            }
          />

          <AppButton
            label="Reset Demo Book Library"
            variant="ghost"
            onPress={
              resetBookLibrary
            }
          />

          <AppButton
            label="Reset All Demo Data"
            variant="secondary"
            onPress={
              resetAllDemoData
            }
          />
        </SettingsSection>

        <SettingsSection
          title="Preference Reset"
          description="Restore the original app defaults"
          icon="refresh-outline"
        >
          <AppButton
            label="Restore Default Preferences"
            variant="secondary"
            onPress={
              resetPreferenceDefaults
            }
          />

          <View style={styles.defaultSummary}>
            <AppText
              variant="bodySmall"
              muted
            >
              Factory defaults
            </AppText>

            <AppText
              variant="caption"
              muted
            >
              Quiz: Hide Words · Count{" "}
              {DEFAULT_APP_SETTINGS.defaultHideCount}
            </AppText>

            <AppText
              variant="caption"
              muted
            >
              Readers: Medium Arabic text
            </AppText>

            <AppText
              variant="caption"
              muted
            >
              Audio:{" "}
              {DEFAULT_APP_SETTINGS.defaultAudioSpeed}× ·
              Repeat 1×
            </AppText>
          </View>
        </SettingsSection>

        <AccessibilityStatusCard />

        <AppCard style={styles.aboutCard}>
          <View style={styles.aboutIcon}>
            <Ionicons
              name="layers-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <AppText
            variant="title"
            align="center"
          >
            Matn Quiz
          </AppText>

          <AppText
            variant="bodySmall"
            muted
            align="center"
          >
            Mobile Arabic memorization, poem,
            reading and study prototype.
          </AppText>

          <View style={styles.aboutRows}>
            <View style={styles.aboutRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Mobile
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.aboutValue}
              >
                Expo + React Native
              </AppText>
            </View>

            <View style={styles.aboutRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Current milestone
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.aboutValue}
              >
                M21 Persistence
              </AppText>
            </View>

            <View style={styles.aboutRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Storage
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.aboutValue}
              >
                AsyncStorage local
              </AppText>
            </View>

            <View style={styles.aboutRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                TTS
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.aboutValue}
              >
                Local mock
              </AppText>
            </View>
          </View>
        </AppCard>
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
    backgroundColor:
      colors.primarySoft,
  },

  introText: {
    flex: 1,
    gap: spacing.xs,
  },

  memoryNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor:
      colors.primary,
    borderRadius:
      radius.lg,
    backgroundColor:
      colors.primarySoft,
  },

  memoryNoticeText: {
    flex: 1,
    color:
      colors.primaryDark,
    fontWeight: "600",
  },

  separator: {
    height: 1,
    backgroundColor:
      colors.border,
  },

  dataStats: {
    flexDirection: "row",
    alignItems: "stretch",
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius:
      radius.lg,
    backgroundColor:
      colors.backgroundSoft,
  },

  dataStat: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical:
      spacing.md,
  },

  dataDivider: {
    width: 1,
    marginVertical:
      spacing.sm,
    backgroundColor:
      colors.border,
  },

  dataValue: {
    color:
      colors.primaryDark,
    fontWeight: "900",
  },

  defaultSummary: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius:
      radius.lg,
    backgroundColor:
      colors.backgroundSoft,
  },

  aboutCard: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical:
      spacing.xxl,
  },

  aboutIcon: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius:
      radius.xxl,
    backgroundColor:
      colors.primarySoft,
  },

  aboutRows: {
    width: "100%",
    gap: spacing.md,
    paddingTop: spacing.md,
  },

  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  aboutValue: {
    flex: 1,
    color:
      colors.primaryDark,
    fontWeight: "800",
    textAlign: "right",
  },
});