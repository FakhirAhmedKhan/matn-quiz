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
  AudioPlaybackCard,
  AudioRepeatSelector,
  AudioSegmentList,
  AudioSegmentModeToggle,
  AudioSourceSelector,
  AudioSpeedSelector,
} from "../src/components/audio";
import {
  AppHeader,
  AppScreen,
} from "../src/components/layout";
import {
  AppButton,
  AppCard,
  AppText,
} from "../src/components/ui";
import {
  mockTtsService,
} from "../src/services/tts/mockTtsService";
import {
  useAudioStore,
} from "../src/store/audioStore";
import {
  usePoemStore,
} from "../src/store/poemStore";
import {
  useQuizStore,
} from "../src/store/quizStore";
import type {
  TtsPreparedAudio,
} from "../src/types/tts";
import {
  buildAudioSources,
  getRepeatLimit,
  splitAudioSegments,
} from "../src/utils/audio";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../src/theme";

export default function AudioScreen() {
  const quizText =
    useQuizStore(
      (state) =>
        state.text,
    );

  const poemText =
    usePoemStore(
      (state) =>
        state.text,
    );

  const poemTitle =
    usePoemStore(
      (state) =>
        state.title,
    );

  const sourceKind =
    useAudioStore(
      (state) =>
        state.sourceKind,
    );

  const segmentMode =
    useAudioStore(
      (state) =>
        state.segmentMode,
    );

  const selectedSegmentIndex =
    useAudioStore(
      (state) =>
        state.selectedSegmentIndex,
    );

  const speed =
    useAudioStore(
      (state) =>
        state.speed,
    );

  const repeatMode =
    useAudioStore(
      (state) =>
        state.repeatMode,
    );

  const setSourceKind =
    useAudioStore(
      (state) =>
        state.setSourceKind,
    );

  const setSegmentMode =
    useAudioStore(
      (state) =>
        state.setSegmentMode,
    );

  const setSelectedSegmentIndex =
    useAudioStore(
      (state) =>
        state.setSelectedSegmentIndex,
    );

  const setSpeed =
    useAudioStore(
      (state) =>
        state.setSpeed,
    );

  const setRepeatMode =
    useAudioStore(
      (state) =>
        state.setRepeatMode,
    );

  const resetAudioSettings =
    useAudioStore(
      (state) =>
        state.resetAudioSettings,
    );

  const [
    preparedAudio,
    setPreparedAudio,
  ] =
    useState<TtsPreparedAudio | null>(
      null,
    );

  const [
    preparing,
    setPreparing,
  ] = useState(false);

  const [
    playing,
    setPlaying,
  ] = useState(false);

  const [
    positionMs,
    setPositionMs,
  ] = useState(0);

  const [
    repeatCompleted,
    setRepeatCompleted,
  ] = useState(0);

  const sources =
    useMemo(
      () =>
        buildAudioSources(
          quizText,
          poemText,
          poemTitle,
        ),
      [
        quizText,
        poemText,
        poemTitle,
      ],
    );

  const activeSource =
    sources.find(
      (source) =>
        source.kind ===
        sourceKind,
    ) ??
    sources[0];

  useEffect(() => {
    if (
      activeSource.available
    ) {
      return;
    }

    setSourceKind(
      "DEMO",
    );
  }, [
    activeSource.available,
    setSourceKind,
  ]);

  const segments =
    useMemo(
      () =>
        splitAudioSegments(
          activeSource.text,
          segmentMode,
        ),
      [
        activeSource.text,
        segmentMode,
      ],
    );

  const safeSelectedIndex =
    Math.min(
      Math.max(
        0,
        selectedSegmentIndex,
      ),
      Math.max(
        0,
        segments.length - 1,
      ),
    );

  const selectedSegment =
    segments[
      safeSelectedIndex
    ] ?? null;

  useEffect(() => {
    if (
      selectedSegmentIndex !==
      safeSelectedIndex
    ) {
      setSelectedSegmentIndex(
        safeSelectedIndex,
      );
    }
  }, [
    safeSelectedIndex,
    selectedSegmentIndex,
    setSelectedSegmentIndex,
  ]);

  function resetPlayback() {
    setPlaying(false);
    setPositionMs(0);
    setRepeatCompleted(0);
    setPreparedAudio(null);
    setPreparing(false);
  }

  useEffect(() => {
    resetPlayback();
  }, [
    sourceKind,
    segmentMode,
    safeSelectedIndex,
    speed,
  ]);

  useEffect(() => {
    if (
      !playing ||
      !preparedAudio
    ) {
      return;
    }

    const interval =
      setInterval(
        () => {
          setPositionMs(
            (current) =>
              Math.min(
                preparedAudio.durationMs,
                current + 100,
              ),
          );
        },
        100,
      );

    return () =>
      clearInterval(
        interval,
      );
  }, [
    playing,
    preparedAudio,
  ]);

  useEffect(() => {
    if (
      !playing ||
      !preparedAudio ||
      positionMs <
        preparedAudio.durationMs
    ) {
      return;
    }

    const limit =
      getRepeatLimit(
        repeatMode,
      );

    const completed =
      repeatCompleted + 1;

    if (
      limit === null ||
      completed < limit
    ) {
      setRepeatCompleted(
        completed,
      );

      setPositionMs(0);

      return;
    }

    setRepeatCompleted(
      completed,
    );

    setPlaying(false);

    setPositionMs(
      preparedAudio.durationMs,
    );
  }, [
    playing,
    positionMs,
    preparedAudio,
    repeatCompleted,
    repeatMode,
  ]);

  async function prepareAudio() {
    if (
      !selectedSegment
    ) {
      return;
    }

    setPlaying(false);
    setPositionMs(0);
    setRepeatCompleted(0);
    setPreparing(true);

    try {
      const result =
        await mockTtsService.prepare({
          text:
            selectedSegment.text,

          locale:
            "ar-SA",

          speed,
        });

      setPreparedAudio(
        result,
      );
    } finally {
      setPreparing(false);
    }
  }

  function togglePlayback() {
    if (
      !preparedAudio
    ) {
      return;
    }

    if (playing) {
      setPlaying(false);
      return;
    }

    if (
      positionMs >=
      preparedAudio.durationMs
    ) {
      setPositionMs(0);
      setRepeatCompleted(0);
    }

    setPlaying(true);
  }

  function restartPlayback() {
    if (
      !preparedAudio
    ) {
      return;
    }

    setPlaying(false);
    setPositionMs(0);
    setRepeatCompleted(0);
  }

  function changeSegment(
    index: number,
  ) {
    setSelectedSegmentIndex(
      index,
    );
  }

  function resetEverything() {
    resetAudioSettings();
    resetPlayback();
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Arabic Audio"
          subtitle="TTS practice"
          showBack
          onBack={() =>
            router.back()
          }
        />

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="headset-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">
              Listen & Repeat
            </AppText>

            <AppText muted>
              Select Arabic text, prepare mock
              speech and practice listening at
              different speeds and repeat counts.
            </AppText>
          </View>
        </View>

        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="folder-open-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <View style={styles.sectionHeading}>
              <AppText variant="subheading">
                1. Audio Source
              </AppText>

              <AppText
                variant="caption"
                muted
              >
                Choose text to practice
              </AppText>
            </View>
          </View>

          <AudioSourceSelector
            sources={sources}
            value={sourceKind}
            onChange={
              setSourceKind
            }
          />
        </AppCard>

        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="cut-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <View style={styles.sectionHeading}>
              <AppText variant="subheading">
                2. Split Text
              </AppText>

              <AppText
                variant="caption"
                muted
              >
                {segments.length} available
              </AppText>
            </View>
          </View>

          <AudioSegmentModeToggle
            value={
              segmentMode
            }
            onChange={
              setSegmentMode
            }
          />

          <AudioSegmentList
            segments={
              segments
            }
            selectedIndex={
              safeSelectedIndex
            }
            onSelect={
              changeSegment
            }
          />
        </AppCard>

        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="speedometer-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <View style={styles.sectionHeading}>
              <AppText variant="subheading">
                3. Playback Settings
              </AppText>

              <AppText
                variant="caption"
                muted
              >
                Speed and repetition
              </AppText>
            </View>
          </View>

          <View style={styles.settingBlock}>
            <AppText
              variant="bodySmall"
              style={styles.settingLabel}
            >
              Playback Speed
            </AppText>

            <AudioSpeedSelector
              value={speed}
              onChange={
                setSpeed
              }
            />
          </View>

          <View style={styles.settingBlock}>
            <AppText
              variant="bodySmall"
              style={styles.settingLabel}
            >
              Repeat
            </AppText>

            <AudioRepeatSelector
              value={
                repeatMode
              }
              onChange={
                setRepeatMode
              }
            />
          </View>
        </AppCard>

        <AudioPlaybackCard
          text={
            selectedSegment
              ?.text ?? ""
          }
          prepared={
            Boolean(
              preparedAudio,
            )
          }
          preparing={
            preparing
          }
          playing={
            playing
          }
          positionMs={
            positionMs
          }
          durationMs={
            preparedAudio
              ?.durationMs ?? 0
          }
          repeatCompleted={
            repeatCompleted
          }
          onPrepare={
            prepareAudio
          }
          onTogglePlayback={
            togglePlayback
          }
          onRestart={
            restartPlayback
          }
        />

        <View style={styles.mockNotice}>
          <Ionicons
            name="shield-checkmark-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <View style={styles.mockNoticeText}>
            <AppText variant="subheading">
              Local Mock TTS
            </AppText>

            <AppText
              variant="bodySmall"
              muted
            >
              M19 does not send Arabic text to any
              external AI or TTS provider. The
              playback timer is simulated locally.
              The TtsService interface is ready
              for a real provider in a later phase.
            </AppText>
          </View>
        </View>

        <AppCard style={styles.boundaryCard}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="git-branch-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText variant="subheading">
              TTS Service Boundary
            </AppText>
          </View>

          <View style={styles.boundaryRows}>
            <View style={styles.boundaryRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Engine
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.boundaryValue}
              >
                MOCK
              </AppText>
            </View>

            <View style={styles.boundaryRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Language
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.boundaryValue}
              >
                ar-SA
              </AppText>
            </View>

            <View style={styles.boundaryRow}>
              <AppText
                variant="bodySmall"
                muted
              >
                Network
              </AppText>

              <AppText
                variant="bodySmall"
                style={styles.boundaryValue}
              >
                None
              </AppText>
            </View>
          </View>
        </AppCard>

        <View style={styles.actions}>
          <AppButton
            label="Reset Audio Settings"
            variant="ghost"
            onPress={
              resetEverything
            }
          />
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

  section: {
    gap: spacing.lg,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  sectionHeading: {
    flex: 1,
    gap: spacing.xs,
  },

  settingBlock: {
    gap: spacing.sm,
  },

  settingLabel: {
    color: colors.primaryDark,
    fontWeight: "800",
  },

  mockNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  mockNoticeText: {
    flex: 1,
    gap: spacing.xs,
  },

  boundaryCard: {
    gap: spacing.lg,
  },

  boundaryRows: {
    gap: spacing.md,
  },

  boundaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  boundaryValue: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  actions: {
    gap: spacing.md,
  },
});