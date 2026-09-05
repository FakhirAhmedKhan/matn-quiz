import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

import { AppHeader, AppScreen } from "../src/components/layout";

import { AppButton, AppCard, AppText } from "../src/components/ui";

import { colors, iconSize, radius, spacing } from "../src/theme";

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function VoicePracticeScreen() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const recorderState = useAudioRecorderState(recorder, 100);

  const player = useAudioPlayer(null, {
    updateInterval: 100,
  });

  const playerStatus = useAudioPlayerStatus(player);

  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  const [recordingDurationMs, setRecordingDurationMs] = useState(0);

  const [microphoneReady, setMicrophoneReady] = useState(false);

  const [busy, setBusy] = useState(false);

  const displayDuration = recorderState.isRecording
    ? recorderState.durationMillis
    : recordingDurationMs;

  async function ensurePermission() {
    const permission = await requestRecordingPermissionsAsync();

    if (!permission.granted) {
      setMicrophoneReady(false);

      Alert.alert(
        "Microphone Permission Required",
        "Allow microphone access to record your recitation.",
      );

      return false;
    }

    setMicrophoneReady(true);

    return true;
  }

  async function startRecording() {
    if (busy || recorderState.isRecording) {
      return;
    }

    setBusy(true);

    try {
      const granted = await ensurePermission();

      if (!granted) {
        return;
      }

      if (playerStatus.playing) {
        player.pause();
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();

      setRecordingUri(null);
      setRecordingDurationMs(0);

      recorder.record();
    } catch (error) {
      console.error("Start recording failed", error);

      Alert.alert(
        "Recording Error",
        "Matn Quiz could not start the microphone.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function stopRecording() {
    if (busy || !recorderState.isRecording) {
      return;
    }

    setBusy(true);

    try {
      const duration = recorderState.durationMillis;

      await recorder.stop();

      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      const uri = recorder.uri;

      if (!uri) {
        throw new Error("Recording URI unavailable.");
      }

      setRecordingDurationMs(duration);

      setRecordingUri(uri);

      player.replace(uri);
    } catch (error) {
      console.error("Stop recording failed", error);

      Alert.alert(
        "Recording Error",
        "The recording could not be prepared for playback.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function playRecording() {
    if (!recordingUri || busy) {
      return;
    }

    try {
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      await player.seekTo(0);

      player.play();
    } catch (error) {
      console.error("Playback failed", error);

      Alert.alert("Playback Error", "Your recording could not be played.");
    }
  }

  function pauseRecordingPlayback() {
    player.pause();
  }

  function recordAgain() {
    if (playerStatus.playing) {
      player.pause();
    }

    void startRecording();
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Voice Practice"
          subtitle="Record & review your recitation"
          showBack
          onBack={() => router.back()}
        />

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="mic-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">Practice with your own voice</AppText>

            <AppText muted>
              Record your Arabic recitation, listen back, and repeat.
            </AppText>
          </View>
        </View>

        <AppCard style={styles.statusCard}>
          <View
            style={[
              styles.micCircle,
              recorderState.isRecording && styles.micCircleActive,
            ]}
          >
            <Ionicons
              name={recorderState.isRecording ? "mic" : "mic-outline"}
              size={44}
              color={
                recorderState.isRecording ? colors.textInverse : colors.primary
              }
            />
          </View>

          <AppText variant="heading" align="center">
            {recorderState.isRecording
              ? "Recording..."
              : recordingUri
                ? "Recording Ready"
                : "Ready to Record"}
          </AppText>

          <AppText variant="display" align="center" style={styles.timer}>
            {formatDuration(displayDuration)}
          </AppText>

          <AppText variant="bodySmall" muted align="center">
            {recorderState.isRecording
              ? "Recite clearly, then tap Stop."
              : recordingUri
                ? "Play your attempt or record again."
                : "Tap Start Recording when you are ready."}
          </AppText>

          {microphoneReady ? (
            <View style={styles.permissionBadge}>
              <Ionicons
                name="checkmark-circle-outline"
                size={iconSize.sm}
                color={colors.primary}
              />

              <AppText variant="caption" style={styles.permissionText}>
                Microphone ready
              </AppText>
            </View>
          ) : null}
        </AppCard>

        <AppCard style={styles.practiceCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons
                name="volume-high-outline"
                size={iconSize.md}
                color={colors.primary}
              />
            </View>

            <View style={styles.sectionText}>
              <AppText variant="subheading">Recitation Practice</AppText>

              <AppText variant="bodySmall" muted>
                Record and listen to your own recitation.
              </AppText>
            </View>
          </View>

          {recorderState.isRecording ? (
            <AppButton
              label="Stop Recording"
              variant="danger"
              size="lg"
              disabled={busy}
              onPress={() => void stopRecording()}
            />
          ) : (
            <AppButton
              label={recordingUri ? "Record Again" : "Start Recording"}
              size="lg"
              loading={busy}
              disabled={busy}
              onPress={recordingUri ? recordAgain : () => void startRecording()}
            />
          )}

          {recordingUri && !recorderState.isRecording ? (
            <AppButton
              label={playerStatus.playing ? "Pause Playback" : "Play Recording"}
              variant="secondary"
              size="lg"
              onPress={
                playerStatus.playing
                  ? pauseRecordingPlayback
                  : () => void playRecording()
              }
            />
          ) : null}
        </AppCard>

        {recordingUri ? (
          <AppCard style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Ionicons
                name="checkmark-circle-outline"
                size={iconSize.md}
                color={colors.primary}
              />

              <View style={styles.reviewText}>
                <AppText variant="subheading">Attempt captured</AppText>

                <AppText variant="bodySmall" muted>
                  Duration {formatDuration(recordingDurationMs)}
                </AppText>
              </View>
            </View>

            <AppText variant="bodySmall" muted>
              This recording currently stays local to this app session.
            </AppText>
          </AppCard>
        ) : null}

        <View style={styles.privacyNotice}>
          <Ionicons
            name="shield-checkmark-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <View style={styles.privacyText}>
            <AppText variant="subheading">Local Voice Practice</AppText>

            <AppText variant="bodySmall" muted>
              Your voice is recorded locally. Speech recognition and
              pronunciation analysis will be added later.
            </AppText>
          </View>
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
    width: 56,
    height: 56,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  introText: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },

  statusCard: {
    alignItems: "center",
    gap: spacing.md,
  },

  micCircle: {
    width: 92,
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 46,
    backgroundColor: colors.primarySoft,
  },

  micCircleActive: {
    backgroundColor: colors.primary,
  },

  timer: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  permissionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  permissionText: {
    color: colors.primaryDark,
    fontWeight: "800",
  },

  practiceCard: {
    gap: spacing.lg,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  sectionIcon: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },

  sectionText: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },

  reviewCard: {
    gap: spacing.md,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  reviewText: {
    flex: 1,
    gap: spacing.xs,
  },

  privacyNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  privacyText: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
});
